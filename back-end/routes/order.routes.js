import express from "express";
import { getOrderHistory, reorder, createOrder, confirmPayOSPayment } from "../controllers/order.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import verifyToken from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/history", authenticate, getOrderHistory);
router.post("/:orderId/reorder", verifyToken, reorder);
router.post("/", verifyToken, createOrder);

// Xác nhận thanh toán PayOS
router.post("/confirm-payos", verifyToken, confirmPayOSPayment);

export default router;
