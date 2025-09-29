import express from "express";
import {
  getAllUsers,
  suspendUser,
  activateUser,
  makeAdmin,
} from "../controllers/adminUser.controller.js";
import { verifyToken, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, authorizeAdmin, getAllUsers);
router.put("/:id/suspend", verifyToken, authorizeAdmin, suspendUser);
router.put("/:id/activate", verifyToken, authorizeAdmin, activateUser);
router.put("/:id/make-admin", verifyToken, authorizeAdmin, makeAdmin);

export default router;
