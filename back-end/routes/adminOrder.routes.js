import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminOrder.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// chỉ admin mới xem & quản lý đơn hàng
router.get("/", authenticate, authorize("admin"), getAllOrders);
router.put("/:id/status", authenticate, authorize("admin"), updateOrderStatus);

export default router;
