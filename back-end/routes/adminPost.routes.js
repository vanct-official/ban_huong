import express from "express";
import upload from "../middleware/uploadpost.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/adminPost.controller.js";
import { verifyToken, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Danh sách bài viết
router.get("/", verifyToken, authorizeAdmin, getAllPosts);

// Thêm bài viết
router.post(
  "/",
  verifyToken,
  authorizeAdmin,
  upload.single("thumbnail"),
  createPost
);

// Lấy chi tiết 1 bài viết
router.get("/:id", verifyToken, authorizeAdmin, getPostById);

// Cập nhật bài viết
router.put(
  "/:id",
  verifyToken,
  authorizeAdmin,
  upload.single("thumbnail"),
  updatePost
);

// Xóa bài viết
router.delete("/:id", verifyToken, authorizeAdmin, deletePost);

export default router;
