import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controllers/wishlist.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth, addToWishlist);
router.delete("/:productId", auth, removeFromWishlist);
router.get("/", auth, getWishlist);

export default router;
