import express from "express";
import {
  createFeedback,
  getFeedbackByProduct,
  getAverageRating,
  getAllFeedbacks,
  getFeedbackByProductId,
  deleteFeedback,
} from "../controllers/feedback.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createFeedback); // tạo feedback
router.get("/:productId", getFeedbackByProduct); // feedback cho 1 product (frontend detail)
router.get("/avg/:productId", getAverageRating); // lấy trung bình số sao cho 1 sản phẩm
router.get("/", getAllFeedbacks); // tất cả feedback
router.get("/product/:productId", getFeedbackByProductId); // ✅ admin lọc theo product
router.post("/", verifyToken, createFeedback);
router.delete("/:id", deleteFeedback);

export default router;
