import express from "express";
import { getOrderHistory } from "../controllers/order.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/history", authenticate, getOrderHistory);

export default router;
