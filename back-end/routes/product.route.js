import express from "express";
import {
  getProducts,
  createProduct,
  searchProducts,
  getProductsAdvanced,
  getProductById,
  updateProduct,
  deleteProduct,
  getTopRatedProducts,
  getBestSellers,
  getProductRating,
} from "../controllers/product.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// ✅ Đặt route đặc biệt trước route động
router.get("/top-rated", getTopRatedProducts);
router.get("/best-sellers", getBestSellers);

router.get("/", getProducts);
router.post("/", upload.array("images", 5), createProduct);
router.get("/search", searchProducts); // 🔍 /api/products/search?q=abc
// API nâng cao: tìm kiếm + lọc + sort + phân trang
router.get("/", getProductsAdvanced);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 5), updateProduct); // ✅ update
router.delete("/:id", deleteProduct); // ✅ route xoá
router.get("/:id/rating", getProductRating); // ✅ lấy đánh giá & số sao trung bình
export default router;
