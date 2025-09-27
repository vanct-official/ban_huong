import express from 'express';
import { getMyWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import authenticate from '../middleware/auth.middleware.js'; // middleware JWT

const router = express.Router();

router.get('/me', authenticate, getMyWishlist);
router.post('/', authenticate, addToWishlist);
router.delete('/:productId', authenticate, removeFromWishlist);

export default router;
