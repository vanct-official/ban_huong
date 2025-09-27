import express from "express";
import {
  getAddressesByUserId,
  getMyAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"; // nhớ import

const router = express.Router();

// ✅ Lấy địa chỉ của user theo id (public hoặc cho admin)
router.get("/user/:userId", getAddressesByUserId);

// ✅ Lấy địa chỉ của user đang đăng nhập (token)
router.get("/me", authMiddleware, getMyAddresses);

// ✅ Thêm địa chỉ mới cho user đang đăng nhập
router.post("/", authMiddleware, createAddress);

// ✅ Xóa địa chỉ theo id (chỉ chủ sở hữu mới được xóa)
router.delete("/:id", authMiddleware, deleteAddress);

// ✅ Đặt địa chỉ mặc định
router.put("/:id/default", authMiddleware, setDefaultAddress);

export default router;
