import express from "express";
import {
  createFeedback,
  getFeedbackByProduct,
  getAverageRating,
  getAllFeedbacks,
  getFeedbackByProductId,
  deleteFeedback,
  getRecentFeedbacks,
} from "../controllers/feedback.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

// Tạo feedback (user)
router.post("/", verifyToken, createFeedback);

// Feedback cho 1 product (frontend)
router.get("/product/:productId", getFeedbackByProduct);

// Trung bình số sao cho 1 sản phẩm
router.get("/avg/:productId", getAverageRating);

// Lấy feedback mới nhất (5 cái) cho trang chủ
router.get("/recent", getRecentFeedbacks);

// Tất cả feedback (admin)
router.get("/", getAllFeedbacks);

// Admin lọc theo product
router.get("/admin/product/:productId", getFeedbackByProductId);

// Xoá feedback (admin)
router.delete("/:id", deleteFeedback);

export default router;
