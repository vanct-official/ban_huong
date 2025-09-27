// controllers/feedback.controller.js
import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";

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
