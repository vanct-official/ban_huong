import express from "express";
import { getAdminStats } from "../controllers/adminStats.controller.js";
import { verifyToken, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", verifyToken, authorizeAdmin, getAdminStats);

export default router;
