import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", isAuthenticated, addToCart);
router.get("/", isAuthenticated, getCart);
router.delete("/:productId", isAuthenticated, removeFromCart);
router.put("/:productId", verifyToken, updateCartItem);

export default router;
