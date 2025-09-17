// routes/user.route.js
import express from "express";
import { getUserProfile, getAllUsers } from "../controllers/user.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", authenticate, getUserProfile);
router.get("/", authenticate, getAllUsers);

export default router;
