import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";
import { fn, col } from "sequelize";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";

export const getFeedbackByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const feedbacks = await Feedback.findAll({
      where: { productId },
      include: [
        { model: User, as: "user", attributes: ["username", "avatarImg"] },
        { model: Product, as: "product", attributes: ["productName"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(feedbacks);
  } catch (err) {
    console.error("❌ Lỗi lấy feedback theo product:", err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy trung bình số sao cho 1 sản phẩm
export const getAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await Feedback.findOne({
      where: { productId },
      attributes: [[fn("AVG", col("rate")), "avgRating"]],
      raw: true,
    });

    res.json({ avgRating: parseFloat(result.avgRating) || 0 });
  } catch (err) {
    console.error("❌ Lỗi khi tính trung bình rating:", err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy feedback theo productId
export const getFeedbackByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const feedbacks = await Feedback.findAll({
      where: { productId },
      include: [
        { model: User, as: "user", attributes: ["username", "avatarImg"] },
        { model: Product, as: "product", attributes: ["productName"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(feedbacks);
  } catch (err) {
    console.error("❌ Lỗi lấy feedback theo product:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Xoá feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const fb = await Feedback.findByPk(id);

    if (!fb) {
      return res.status(404).json({ message: "Feedback không tồn tại" });
    }

    await fb.destroy();
    res.json({ message: "Đã xoá feedback" });
  } catch (err) {
    console.error("❌ Lỗi deleteFeedback:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: [
        {
          model: User,
          as: "user", // ✅ trùng alias trong model
          attributes: ["username", "avatarImg"],
        },
        {
          model: Product,
          as: "product", // ✅ trùng alias trong model
          attributes: ["productName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(feedbacks);
  } catch (err) {
    console.error("❌ Lỗi getAllFeedbacks:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const { productId, rate, feedbackContent } = req.body;
    const userId = req.user.id; // lấy từ JWT

    // 1. Kiểm tra user đã feedback sản phẩm này chưa
    const existingFeedback = await Feedback.findOne({
      where: { userId, productId },
    });

    if (existingFeedback) {
      return res.status(400).json({
        message: "❌ Bạn đã feedback sản phẩm này rồi.",
      });
    }

    // 2. Kiểm tra user có đơn hàng hoàn tất chứa sản phẩm này không
    const purchased = await Order.findOne({
      where: {
        userId,
        status: "completed", // chỉ khi đơn hàng đã hoàn thành
      },
      include: [
        {
          model: OrderItem,
          as: "items", // alias cần khớp với association
          where: { productId },
        },
      ],
    });

    if (!purchased) {
      return res.status(400).json({
        message: "❌ Bạn chỉ có thể feedback cho sản phẩm mà bạn đã mua.",
      });
    }

    // 3. Tạo feedback mới
    const feedback = await Feedback.create({
      productId,
      userId,
      rate,
      feedbackContent,
    });

    res.status(201).json(feedback);
  } catch (err) {
    console.error("❌ Lỗi createFeedback:", err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy một số feedback mới nhất (ví dụ: 5 feedback)
export const getRecentFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: [
        { model: User, as: "user", attributes: ["username", "avatarImg"] },
        { model: Product, as: "product", attributes: ["productName"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5, // chỉ lấy 5 feedback mới nhất
    });

    res.json(feedbacks);
  } catch (err) {
    console.error("❌ Lỗi getRecentFeedbacks:", err);
    res.status(500).json({ message: err.message });
  }
};
