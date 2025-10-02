import express from "express";
import passport from "../config/passportConfig.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "sequelize"; // 👈 thêm vào

import {
  getUserProfile,
  loginWithGoogle,
  updateMyProfile,
  updateUserProfile,
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

/**
 * ========== Google Login ==========
 */
router.post("/google", loginWithGoogle);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    if (!req.user) return res.redirect("/login?error=no_user");

    if (req.user.isNewUser) {
      return res.redirect(
        `/register?email=${encodeURIComponent(req.user.email)}`
      );
    }

    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

/**
 * ========== Đăng ký & Đăng nhập ==========
 */
router.post("/register", register);
router.post("/login", login);

/**
 * ========== User Profile ==========
 */
router.get("/me", verifyToken, getUserProfile);
router.put("/me", verifyToken, updateMyProfile);
router.put("/:id", updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ exists: false });

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  } catch (err) {
    console.error("❌ Check email error:", err);
    res.status(500).json({ exists: false });
  }
});
export default router;
