// === middleware/auth.middleware.js ===
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(">>> decoded:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới có quyền này." });
  }
  next();
};

export default verifyToken;