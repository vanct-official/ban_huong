// controllers/order.controller.js
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/product.model.js";
import ProductImage from "../models/productimage.model.js";
import Cart from "../models/cart.model.js";
import { payOS } from "../config/payOS.js"; // instance PayOS đã setup
import { sequelize } from "../config/db.js"; // sequelize instance

// ----------------------------
// Lấy lịch sử đơn hàng
// ----------------------------
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "productName", "unitPrice"],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["productImg"],
                  limit: 1,
                },
              ],
            },
          ],
        },
      ],
      order: [["orderDate", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ Lỗi getOrderHistory:", err);
    res.status(500).json({ error: "Không thể lấy lịch sử đơn hàng" });
  }
};

// ----------------------------
// Mua lại đơn hàng (Reorder)
// ----------------------------
export const reorder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const oldOrder = await Order.findOne({
      where: { id: orderId, userId },
      include: [{ model: OrderItem, as: "items" }],
    });

    if (!oldOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Thêm sản phẩm vào giỏ hàng
    for (const item of oldOrder.items) {
      const product = await Product.findByPk(item.productId);
      if (!product || product.quantity < 1) continue;

      const exist = await Cart.findOne({
        where: { userId, productId: item.productId },
      });

      if (exist) {
        exist.quantity += item.quantity;
        await exist.save();
      } else {
        await Cart.create({
          userId,
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    return res.json({
      success: true,
      message: "✅ Đã thêm sản phẩm từ đơn cũ vào giỏ hàng",
    });
  } catch (err) {
    console.error("❌ Lỗi reorder:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Lỗi khi mua lại",
    });
  }
};

// ----------------------------
// Tạo đơn hàng (Checkout)
// ----------------------------
export const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const {
      items,
      addressId,
      promotionId,
      discountAmount = 0,
      shippingAmount = 0,
      paymentMethod = "COD",
    } = req.body;

    if (!items || items.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Không có sản phẩm trong đơn hàng." });
    }

    // Tính tổng tiền
    const productsTotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const finalAmount =
      productsTotal + Number(shippingAmount) - Number(discountAmount);

    // 1️⃣ Tạo order
    const order = await Order.create(
      {
        userId,
        addressId,
        promotionId: promotionId || null,
        discountAmount,
        shippingAmount,
        totalAmount: productsTotal,
        finalAmount,
        orderDate: new Date(),
        status: "pending",
        paymentMethod,
        paymentStatus: paymentMethod === "PayOS" ? "pending" : "pending",
      },
      { transaction: t }
    );

    // 2️⃣ Lưu order items + giảm kho
    await Promise.all(
      items.map(async (item) => {
        if (!item.productId) return;

        // Lưu order item
        await OrderItem.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            finalPrice: item.price * item.quantity,
          },
          { transaction: t }
        );

        // Giảm tồn kho
        const product = await Product.findByPk(item.productId, {
          transaction: t,
        });
        if (product) {
          product.quantity -= item.quantity;
          if (product.quantity < 0) product.quantity = 0;
          await product.save({ transaction: t });
        }
      })
    );

    // 3️⃣ Xóa giỏ hàng
    await Cart.destroy({ where: { userId }, transaction: t });

    // 4️⃣ Commit transaction
    await t.commit();

    // 5️⃣ Nếu PayOS → tạo link thanh toán
    if (paymentMethod === "PayOS") {
      const orderCode = Number(String(Date.now()).slice(-6));
      const payOSResponse = await payOS.paymentRequests.create({
        orderCode,
        amount: Math.round(finalAmount),
        description: `Đơn hàng ${items.length} sản phẩm`,
        items: items.map((i) => ({
          name: i.name || i.productName || "Sản phẩm",
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
        returnUrl: `${process.env.YOUR_DOMAIN}/checkout-success?orderId=${order.id}`,
        cancelUrl: `${process.env.YOUR_DOMAIN}/checkout-cancel?orderId=${order.id}`,
      });

      if (!payOSResponse?.checkoutUrl)
        return res.status(500).json({ error: "Không thể tạo link PayOS" });

      return res.json({
        success: true,
        orderId: order.id,
        finalAmount,
        payos: {
          checkoutUrl: payOSResponse.checkoutUrl,
          qrCode: payOSResponse.qrCode,
        },
      });
    }

    // COD
    res.json({
      success: true,
      orderId: order.id,
      finalAmount,
      message: "Đơn hàng COD đã được tạo thành công",
    });
  } catch (err) {
    await t.rollback();
    console.error("❌ Lỗi createOrder:", err);
    res.status(500).json({ error: "Không thể tạo đơn hàng" });
  }
};

// ----------------------------
// Xác nhận thanh toán PayOS
// ----------------------------
export const confirmPayOSPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findByPk(orderId);
    if (!order)
      return res.status(404).json({ error: "Đơn hàng không tồn tại" });

    if (order.paymentStatus === "paid") {
      return res.json({
        success: true,
        message: "Đơn hàng đã được thanh toán",
      });
    }

    // Cập nhật trạng thái thanh toán
    order.paymentStatus = "paid";
    order.status = "pending"; // bạn có thể đổi thành "confirmed" nếu muốn
    await order.save();

    res.json({
      success: true,
      orderId: order.id,
      paymentStatus: order.paymentStatus,
    });
  } catch (err) {
    console.error("❌ Lỗi confirmPayOSPayment:", err);
    res.status(500).json({ error: "Không thể xác nhận thanh toán PayOS" });
  }
};
