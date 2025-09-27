import express from "express";
import {
  createFeedback,
  getFeedbackByProduct,
} from "../controllers/feedback.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createFeedback); // tạo feedback
router.get("/:productId", getFeedbackByProduct); // lấy feedback theo productId

export default router;
