import { Order, OrderItem, Product, User } from "../models/index.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
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
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    order.status = status;
    await order.save();

    res.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (err) {
    console.error("❌ Lỗi updateOrderStatus:", err);
    res.status(500).json({ error: "Không thể cập nhật trạng thái đơn hàng" });
  }
};
