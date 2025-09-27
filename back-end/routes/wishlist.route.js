<<<<<<< HEAD
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
=======
import express from 'express';
import { getMyWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import authenticate from '../middleware/auth.middleware.js'; // middleware JWT

const router = express.Router();

router.get('/me', authenticate, getMyWishlist);
router.post('/', authenticate, addToWishlist);
router.delete('/:productId', authenticate, removeFromWishlist);
>>>>>>> main

export default router;
