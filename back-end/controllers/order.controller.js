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
      totalAmount,
      promotionId,
      discountAmount,
      finalAmount,
    } = req.body;

    // Tạo đơn hàng
    const order = await Order.create({
      userId,
      addressId,
      orderDate: new Date(),
      status: "pending", // hoặc status mặc định
      totalAmount,
      promotionId,
      discountAmount,
      finalAmount,
    });

    // Tạo các item cho đơn hàng
    for (const item of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("❌ Lỗi createOrder:", err);
    res.status(500).json({ error: "Không thể tạo đơn hàng" });
  }
};