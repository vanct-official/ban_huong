const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * All functions to Authentication
 * 1. Login with Google
 * @param {*} req
 * @param {*} res
 * @returns
 */

// 1. Login with Google
exports.loginWithGoogle = async (req, res) => {
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

    // Tách họ tên, đảm bảo không lỗi nếu chỉ có 1 từ
    let firstName = "", lastName = "";
    if (name) {
      const nameParts = name.trim().split(" ");
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }

    // Tìm user
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Nếu chưa có user → tạo mới (đăng ký)
      user = await User.create({
        username: email.split("@")[0],
        firstname: firstName,
        middlename: "",
        lastname: lastName,
        email,
        phone: null,
        passwordHash: "", // vì bỏ email/password
        avatarImg: picture || null,
      });
    } else {
      // Nếu đã có user, cập nhật avatar mới nếu khác avatar hiện tại
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
 * All functions to manage user (profile, list users, etc.)
 * 1. Get user profile
 * 2. Get all users (using for admin)
 * 3. Update user profile
 * 4. Deactivate user account

 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

// 1. Get user profile
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id; // Lấy userId từ token đã xác thực

  try {
    // Tìm người dùng theo ID
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["passwordHash"] }, // Không trả về mật khẩu
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get all users (using for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["passwordHash"] }, // Không trả về mật khẩu
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
