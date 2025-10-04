import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/product.model.js";
import ProductImage from "../models/productimage.model.js";
import Cart from "../models/cart.model.js";

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
                  limit: 1, // chỉ lấy 1 ảnh
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

    for (const item of oldOrder.items) {
      const product = await Product.findByPk(item.productId);

      if (!product || product.quantity < 1) continue;

      const exist = await Cart.findOne({
        where: { userId, productId: item.productId },
      });

      if (exist) {
        exist.quantity += item.quantity;
        await exist.save(); // ✅ update
      } else {
        await Cart.create({
          userId,
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    // 👇 Đảm bảo luôn trả về response
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

// Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      items,
      addressId,
      promotionId,
      discountAmount = 0,
      shippingAmount = 0,
      totalAmount = 0,
      finalAmount = 0,
      paymentMethod = "cod",
    } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Không có sản phẩm trong đơn hàng." });
    }

    // 🧮 Tính lại tổng tiền từ items để tránh bị gian lận frontend
    const productsTotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const computedFinalAmount =
      productsTotal + Number(shippingAmount) - Number(discountAmount);

    // 🧾 Tạo đơn hàng
    const order = await Order.create({
      userId,
      addressId,
      orderDate: new Date(),
      status: "pending",
      totalAmount: productsTotal,
      shippingAmount,
      promotionId: promotionId || null,
      discountAmount,
      finalAmount: computedFinalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "payos" ? "paid" : "unpaid",
    });

    // 🛒 Lưu danh sách sản phẩm
    for (const item of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,

      });
    }

    // 🟦 Nếu thanh toán qua PayOS → tạo link thanh toán
    if (paymentMethod === "payos") {
      const payOSResponse = await PayOS.paymentRequests.create({
        orderCode: Number(String(Date.now()).slice(-6)),
        amount: Math.round(computedFinalAmount),
        description: `Đơn hàng ${items.length} sản phẩm`,
        items: items.map((i) => ({
          name: i.name || i.productName,
          quantity: parseInt(i.quantity),
          price: parseFloat(i.price),
        })),
      });

      if (!payOSResponse || !payOSResponse.checkoutUrl) {
        return res.status(500).json({ error: "Không thể tạo link PayOS" });
      }

      // Lưu trạng thái thanh toán chờ xử lý
      await order.update({
        paymentStatus: "pending",
      });

      return res.json({
        success: true,
        orderId: order.id,
        totalAmount: computedFinalAmount,
        payos: {
          checkoutUrl: payOSResponse.checkoutUrl,
          qrCode: payOSResponse.qrCode,
        },
      });
    }

    // 🟩 Nếu COD
    res.json({
      success: true,
      message: "Đơn hàng COD đã được tạo thành công.",
      orderId: order.id,
      totalAmount: computedFinalAmount,
    });
  } catch (err) {
    console.error("❌ Lỗi createOrder:", err);
    res.status(500).json({ error: "Không thể tạo đơn hàng" });
  }
};