// controllers/user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * 1. Login with Google
 */
// 1. Login with Google
export const loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // Tách tên
    let firstName = "",
      lastName = "";
    if (name) {
      const parts = name.trim().split(" ");
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    }

    // Tìm hoặc tạo user
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        username: email.split("@")[0],
        firstname: firstName,
        lastname: lastName,
        email,
        avatarImg: picture || null,
      });
    } else {
      if (picture && user.avatarImg !== picture) {
        user.avatarImg = picture;
        await user.save();
      }
    }

    // Tạo JWT backend cấp
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Google login successful",
      token, // 👈 đổi tên cho chuẩn
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
      attributes: { exclude: ["passwordHash"] },
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
      attributes: { exclude: ["passwordHash"] },
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
