import { Order, OrderItem, Product, User } from "../models/index.js";
import ProductImage from "../models/productimage.model.js";


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: [
        "id",
        "orderDate",
        "status",
        "finalAmount",
        "totalAmount",
        "discountAmount",
        "promotionId",
        "shippingAmount",
        "paymentStatus", // thêm trường này
        "paymentMethod", // thêm trường này
        // ... các trường khác nếu cần
      ],
      include: [
        { model: User, as: "user", attributes: ["id", "email"] },
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
    console.error("❌ Lỗi getAllOrders:", err);
    res.status(500).json({ error: "Không thể lấy danh sách đơn hàng" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, paymentMethod } = req.body;

    const order = await Order.findByPk(id);
    if (!order)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    await order.save();

    res.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (err) {
    console.error("❌ Lỗi updateOrderStatus:", err);
    res.status(500).json({ error: "Không thể cập nhật trạng thái đơn hàng" });
  }
};
