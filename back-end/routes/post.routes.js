import express from "express";
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  deletePost,
  getLatestPosts,
  getRelatedPosts,
} from "../controllers/post.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// ✅ Lấy bài viết mới nhất
router.get("/latest", getLatestPosts); // 👈 thêm route này

// ✅ Lấy tất cả bài viết
router.get("/", getAllPosts);

// ✅ Lấy chi tiết bài viết theo slug
router.get("/:slug", getPostBySlug);

// ✅ Tạo bài viết mới (có upload ảnh thumbnail)
router.post("/", upload.single("thumbnail"), createPost);

// ✅ Xóa bài viết
router.delete("/:id", deletePost);

// ✅ Lấy các bài viết liên quan (cùng tác giả, không bao gồm bài hiện tại)
router.get("/:slug/related", getRelatedPosts);

export default router;
