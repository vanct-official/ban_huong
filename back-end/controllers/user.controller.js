// controllers/user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import nodemailer from "nodemailer";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. Login with Google
export const loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify Google idToken
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;
    const googleId = payload.sub; // unique Google account ID

    // Tách tên
    let firstName = "",
      lastName = "";
    if (name) {
      const parts = name.trim().split(" ");
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    }

    // Tìm user theo email hoặc googleId
    let user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { googleId }],
      },
    });

    // Nếu chưa có user -> tạo mới
    if (!user) {
      user = await User.create({
        username: email.split("@")[0],
        firstname: firstName,
        lastname: lastName,
        email,
        avatarImg: picture || null,
        isActive: true,
        googleId,
        isNewUser: true,
      });
    } else {
      // Cập nhật googleId nếu chưa có
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

      // Chặn login nếu user bị disable
      if (!user.isActive) {
        return res
          .status(403)
          .json({ message: "Tài khoản của bạn đã bị khóa." });
      }

      // Cập nhật avatar nếu khác
      if (picture && user.avatarImg !== picture) {
        user.avatarImg = picture;
        await user.save();
      }
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        name: `${user.firstname} ${user.lastname}`.trim(),
        email: user.email,
        avatar: user.avatarImg,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error logging in with Google:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 2. Get user profile
 */
export const getUserProfile = async (req, res) => {
  const userId = req.user.id; // lấy từ token đã xác thực

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 3. Get all users (for admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 4. Update user profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, phone, avatarImg } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstname) user.firstname = firstname;
    if (middlename) user.middlename = middlename;
    if (lastname) user.lastname = lastname;
    if (phone) user.phone = phone;
    if (avatarImg) user.avatarImg = avatarImg;

    const updated = await user.save();
    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // 👈 lấy từ JWT middleware
    const { firstname, middlename, lastname, email, phone, avatarImg } =
      req.body;

    // ✅ Tìm user theo Primary Key
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Cập nhật field nếu có trong body
    if (firstname) user.firstname = firstname;
    if (middlename) user.middlename = middlename;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (avatarImg) user.avatarImg = avatarImg;

    // ✅ Lưu lại
    const updatedUser = await user.save();

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Quên mật khẩu
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // ❌ Nếu là user Google thì không cho reset
    if (!user.password) {
      return res
        .status(400)
        .json({ message: "Tài khoản Google không thể đổi mật khẩu tại đây" });
    }

    // 👉 Tạo token reset
    const token = crypto.randomBytes(32).toString("hex");
    const expireTime = Date.now() + 3600000; // 1h

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(expireTime);
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bản Hương" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Khôi phục mật khẩu",
      html: `
        <p>Xin chào ${user.firstname},</p>
        <p>Nhấn vào link dưới đây để đặt lại mật khẩu:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link này sẽ hết hạn sau 1 giờ.</p>
      `,
    });

    res.json({ message: "Email khôi phục mật khẩu đã được gửi!" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }, // còn hạn
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // ❌ Nếu là user Google thì từ chối
    if (!user.password) {
      return res
        .status(400)
        .json({ message: "Tài khoản Google không thể đổi mật khẩu tại đây" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Mật khẩu đã được đặt lại thành công!" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { username, firstname, lastname, email, phone, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
    }

    // Kiểm tra email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const finalUsername = username || email.split("@")[0];
    const existingUsername = await User.findOne({
      where: { username: finalUsername },
    });
    if (existingUsername)
      return res.status(400).json({ message: "Username đã tồn tại" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo token xác minh email
    const emailToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username: finalUsername,
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      email_verification_token: emailToken,
      email_verified: false,
    });

    // Gửi email xác minh
    const verifyLink = `${process.env.YOUR_DOMAIN}/verify-email?token=${emailToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bản Hương" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Xác nhận tài khoản của bạn",
      html: `
        <h3>Xin chào ${user.firstname},</h3>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại <b>Bản Hương</b>.</p>
        <p>Nhấn vào liên kết sau để xác nhận email của bạn:</p>
        <a href="${verifyLink}" target="_blank">${verifyLink}</a>
        <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
      `,
    });

    res.status(201).json({
      message:
        "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu" });

    // ⚠️ Thêm đoạn này
    if (!user.email_verified) {
      return res.status(403).json({
        message: "Vui lòng xác nhận email trước khi đăng nhập.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Tài khoản bị khóa" });
    }

    // JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        role: user.role,
        avatar: user.avatarImg,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
