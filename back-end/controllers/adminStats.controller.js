import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";

// 🟢 Lấy thống kê tổng quan
export const getAdminStats = async (req, res) => {
  try {
    const users = await User.count();
    const products = await Product.count();
    const orders = await Order.count();

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

    res.json({ users, products, orders, revenue });
  } catch (err) {
    console.error("❌ Lỗi getAdminStats:", err);
    res.status(500).json({ error: "Không thể lấy thống kê" });
  }
};

// 🟢 Top khách hàng chi tiêu nhiều nhất
export const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await OrderItem.findAll({
      attributes: [
        "orderId",
        [
          sequelize.fn("SUM", sequelize.literal("quantity * unitPrice")),
          "totalSpent",
        ],
      ],
      include: [
        {
          model: Order,
          attributes: ["userId"],
          include: [{ model: User, attributes: ["id", "username", "email"] }],
        },
      ],
      group: ["Order.userId"],
      order: [[sequelize.literal("totalSpent"), "DESC"]],
      limit: 5,
      raw: true,
      nest: true,
    });

    res.json(topCustomers);
  } catch (err) {
    console.error("❌ Lỗi getTopCustomers:", err);
    res.status(500).json({ error: "Không thể lấy top khách hàng" });
  }
};

// 🟢 Doanh thu theo tháng
export const getRevenueByMonth = async (req, res) => {
  try {
    const revenueByMonth = await OrderItem.findAll({
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [
          sequelize.fn("SUM", sequelize.literal("quantity * unitPrice")),
          "totalRevenue",
        ],
      ],
      group: ["month"],
      order: [[sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    res.json(revenueByMonth);
  } catch (err) {
    console.error("❌ Lỗi getRevenueByMonth:", err);
    res.status(500).json({ error: "Không thể lấy doanh thu theo tháng" });
  }
};

// 🟢 Sản phẩm bán chạy
export const getBestSellerProducts = async (req, res) => {
  try {
    const bestSellers = await OrderItem.findAll({
      attributes: [
        "productId",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"],
      ],
      include: [
        {
          model: Product,
          attributes: ["id", "productName", "productImg", "unitPrice"],
        },
      ],
      group: ["productId"],
      order: [[sequelize.literal("totalSold"), "DESC"]],
      limit: 5,
      raw: true,
      nest: true,
    });

    res.json(bestSellers);
  } catch (err) {
    console.error("❌ Lỗi getBestSellerProducts:", err);
    res.status(500).json({ error: "Không thể lấy sản phẩm bán chạy" });
  }
};
