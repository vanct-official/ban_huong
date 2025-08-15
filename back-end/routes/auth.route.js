// routes/auth.routes.js
import express from "express";
import passport from "../config/passportConfig.js";
import jwt from "jsonwebtoken";
import {
  loginWithGoogle
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js"; // Thêm dòng này
import User from "../models/user.model.js"; // Thêm dòng này

const router = express.Router();

router.post("/google", loginWithGoogle);

// ===== Đăng nhập bằng Google =====
// 1. Bấm nút "Login with Google" → redirect tới Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Callback Google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) return res.redirect("/login?error=no_user");

    // Kiểm tra user mới
    if (req.user.isNewUser) {
      return res.redirect(`/register?email=${encodeURIComponent(req.user.email)}`);
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`http://localhost:3000?token=${token}`);
  }
);


router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["passwordHash"] }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
