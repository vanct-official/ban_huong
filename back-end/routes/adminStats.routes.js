import express from "express";
import {
  getAdminStats,
  getAdminReports,
} from "../controllers/adminStats.controller.js";
import { verifyToken, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Thống kê tổng quan: số user, sản phẩm, đơn hàng, doanh thu
router.get("/stats", verifyToken, authorizeAdmin, getAdminStats);

// Báo cáo doanh thu theo tháng + sản phẩm bán chạy
router.get("/reports", verifyToken, authorizeAdmin, getAdminReports);

export default router;
