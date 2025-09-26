import express from "express";
import {
  getProducts,
  createProduct,
  searchProducts,
  getProductsAdvanced,
  getProductById,
} from "../controllers/product.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", upload.single("productImg"), createProduct);
router.get("/search", searchProducts); // 🔍 /api/products/search?q=abc
// API nâng cao: tìm kiếm + lọc + sort + phân trang
router.get("/", getProductsAdvanced);
router.get("/:id", getProductById);

export default router;
