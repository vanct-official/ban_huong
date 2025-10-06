import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import { sequelize } from "../config/db.js";
import ProductImage from "../models/productimage.model.js";

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

export const getAdminReports = async (req, res) => {
  try {
    // Doanh thu theo tháng
    const revenueByMonth = await Order.findAll({
      attributes: [
        [
          sequelize.fn(
            "DATE_FORMAT",
            sequelize.col("Order.orderDate"),
            "%Y-%m"
          ),
          "month",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("items.unitPrice * items.quantity")
          ),
          "totalRevenue",
        ],
      ],
      include: [{ model: OrderItem, as: "items", attributes: [] }],
      group: ["month"],
      order: [[sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    // Top sản phẩm bán chạy
    const topProducts = await OrderItem.findAll({
      attributes: [
        "productId",
        [sequelize.fn("SUM", sequelize.col("OrderItem.quantity")), "totalSold"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "productName"],
        },
      ],
      group: ["OrderItem.productId", "product.id", "product.productName"],
      order: [[sequelize.literal("totalSold"), "DESC"]],
      limit: 5,
      raw: true,
      nest: true,
    });

    // ✅ Lấy ảnh riêng cho từng sản phẩm
    for (let p of topProducts) {
      const img = await ProductImage.findOne({
        where: { productId: p.productId },
        attributes: ["productImg"],
      });
      p.productImg = img ? img.productImg : null;
    }

    res.json({
      revenueByMonth: revenueByMonth.map((r) => ({
        month: r.month,
        totalRevenue: Number(r.totalRevenue) || 0,
      })),
      topProducts: topProducts.map((p) => ({
        productId: p.productId,
        productName: p.product.productName,
        totalSold: Number(p.totalSold),
        productImg: p.productImg,
      })),
    });
  } catch (err) {
    console.error("❌ Lỗi getAdminReports:", err);
    res.status(500).json({ error: err.message });
  }
};
