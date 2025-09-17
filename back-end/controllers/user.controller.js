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

    // Tách họ tên
    let firstName = "", lastName = "";
    if (name) {
      const nameParts = name.trim().split(" ");
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }

    // Tìm user
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Nếu chưa có user → tạo mới
      user = await User.create({
        username: email.split("@")[0],
        firstname: firstName,
        middlename: "",
        lastname: lastName,
        email,
        phone: null,
        passwordHash: "", // không dùng mật khẩu
        avatarImg: picture || null,
      });
    } else {
      // Nếu đã có user, cập nhật avatar nếu cần
      if (picture && user.avatarImg !== picture) {
        user.avatarImg = picture;
        await user.save();
      }
    }

    // Tạo JWT
    const google_token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Google login successful",
      google_token,
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

    res.status(200).json({user});
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
