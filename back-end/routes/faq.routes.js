import express from "express";
import {
  getFaqs,
  getAllFaqs,
  askFaq,
  approveFaq,
  answerFaq,
  getApprovedFaqs,
} from "../controllers/faq.controller.js";
import { verifyToken, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// User lấy FAQ đã duyệt
router.get("/", getFaqs);

// Admin lấy tất cả FAQ
router.get("/all", verifyToken, authorizeAdmin, getAllFaqs);

// User đặt câu hỏi (không cần login)
router.post("/ask", askFaq);

// Admin duyệt
router.put("/:id/approve", verifyToken, authorizeAdmin, approveFaq);

// Admin trả lời
router.put("/:id/answer", verifyToken, authorizeAdmin, answerFaq);

// Lấy FAQ đã duyệt (dành cho public FAQ page)
router.get("/approved", getApprovedFaqs);
export default router;
