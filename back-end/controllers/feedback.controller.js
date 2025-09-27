// controllers/feedback.controller.js
import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";
import { fn, col } from "sequelize";

export const createFeedback = async (req, res) => {
  try {
    const { productId, rate, feedbackContent } = req.body;
    const userId = req.user.id; // lấy từ JWT

    const feedback = await Feedback.create({
      productId,
      userId,
      rate,
      feedbackContent,
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeedbackByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const feedbacks = await Feedback.findAll({
      where: { productId },
      include: [
        {
          model: User,
          attributes: ["username", "avatarImg"], // ✅ chỉ lấy username + avatar
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(feedbacks);
  } catch (err) {
    console.error("❌ Lỗi khi lấy feedback:", err);
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
