import express from "express";
import {
  getAdminStats,
  getTopCustomers,
  getRevenueByMonth,
  getBestSellerProducts,
} from "../controllers/adminStats.controller.js";
import { verifyToken, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", verifyToken, authorizeAdmin, getAdminStats);
router.get("/top-customers", verifyToken, authorizeAdmin, getTopCustomers);
router.get("/revenue/month", verifyToken, authorizeAdmin, getRevenueByMonth);
router.get("/best-sellers", verifyToken, authorizeAdmin, getBestSellerProducts);

export default router;
