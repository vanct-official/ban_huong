import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import { sequelize } from "../config/db.js";

export const getAdminStats = async (req, res) => {
  try {
    // Đếm số user
    const users = await User.count();

    // Đếm số sản phẩm
    const products = await Product.count();

    // Đếm số đơn hàng
    const orders = await Order.count();

    // Tính tổng doanh thu (tổng quantity * unitPrice)
    const revenueData = await OrderItem.findAll({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.literal("quantity * unitPrice")),
          "totalRevenue",
        ],
      ],
      raw: true,
    });

    const revenue = revenueData[0].totalRevenue || 0;

    res.json({
      users,
      products,
      orders,
      revenue,
    });
  } catch (err) {
    console.error("❌ Lỗi getAdminStats:", err);
    res.status(500).json({ error: "Không thể lấy thống kê" });
  }
};
