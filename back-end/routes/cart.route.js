import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", isAuthenticated, addToCart);
router.get("/", isAuthenticated, getCart);
router.delete("/:productId", isAuthenticated, removeFromCart);

export default router;
