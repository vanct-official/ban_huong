import express from "express";
import {
  createFeedback,
  getFeedbackByProduct,
  getAverageRating,
} from "../controllers/feedback.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createFeedback); // tạo feedback
router.get("/:productId", getFeedbackByProduct); // lấy feedback theo productId
router.get("/avg/:productId", getAverageRating); // lấy trung bình số sao cho 1 sản phẩm
export default router;
