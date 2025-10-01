import express from "express";
import { getOrderHistory, reorder } from "../controllers/order.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import verifyToken from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/history", authenticate, getOrderHistory);
router.post("/:orderId/reorder", verifyToken, reorder);

export default router;
