// routes/auth.routes.js
import express from "express";
import passport from "../config/passportConfig.js";
import jwt from "jsonwebtoken";
import {
  getUserProfile,
  loginWithGoogle,
  updateMyProfile,
  updateUserProfile,
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

// 3. Lấy thông tin user hiện tại
router.get("/me", verifyToken, getUserProfile);

// 5. Cập nhật thông tin user hiện tại
router.put("/me", verifyToken, updateMyProfile);

// 4. Cập nhật thông tin user
router.put("/:id", updateUserProfile);





export default router;
