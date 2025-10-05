// server.js
import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import "./config/passportConfig.js";
import { connectDB } from "./config/db.js";

// Controllers
import { getProvinces } from "./controllers/province.controller.js";
import { getAllUsers } from "./controllers/user.controller.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import wardRoutes from "./routes/ward.route.js";
import addressRoutes from "./routes/address.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import cartRoutes from "./routes/cart.route.js";
import feedbackRoutes from "./routes/feedback.route.js";
import adminUserRoutes from "./routes/adminUser.route.js";
import promotionRoutes from "./routes/promotion.route.js";
import orderRoutes from "./routes/order.routes.js";
import adminOrderRoutes from "./routes/adminOrder.routes.js";
import postRoutes from "./routes/post.routes.js";
import adminPostRoutes from "./routes/adminPost.routes.js";
import adminStatsRoutes from "./routes/adminStats.routes.js";
import subscriberRoutes from "./routes/subscriber.route.js";
import faqRoutes from "./routes/faq.routes.js";
import { payOS } from "./config/payOS.js";
import payOSWebhookRoutes from "./routes/payOSWebhook.route.js";

// Load environment variables
dotenv.config();

// Tạo lại __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  process.env.YOUR_DOMAIN, // frontend chạy local
  "https://ban-huong.vercel.app", // frontend deploy trên Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman or server-to-server requests
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy: ${origin} not allowed`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Kết nối DB
connectDB();

// Routes
app.get("/api/provinces", getProvinces);
app.get("/api/users", getAllUsers);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/wishlists", wishlistRoutes);

// Phục vụ ảnh tĩnh từ thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Cho phép truy cập thư mục uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads/posts")));

app.use("/api/cart", cartRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use("/api/admin/users", adminUserRoutes);
app.use("/api/promotions", promotionRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/admin/posts", adminPostRoutes);

app.use("/api/admin", adminStatsRoutes);

app.use("/api/subscribers", subscriberRoutes);

// PayOS - Create Payment Link
app.post("/api/create-payment-link", async (req, res) => {
  try {
    const { amount, description, items, orderId } = req.body; // thêm orderId nếu có

    console.log("📦 Body gửi PayOS:", { amount, description, items, orderId });

    if (!amount || isNaN(amount)) {
      console.error("⚠️ Amount không hợp lệ:", amount);
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentLinkResponse = await payOS.paymentRequests.create({
      orderCode: Number(String(Date.now()).slice(-6)), // hoặc uuidv4() để đảm bảo duy nhất
      amount: Math.floor(Number(amount)),
      description: description || "Thanh toán đơn hàng",
      items: items.map((item) => ({
        name: item.name,
        quantity: parseInt(item.quantity),
        price: parseInt(item.price),
      })),
      // gắn orderId vào returnUrl để frontend biết đơn hàng nào
      returnUrl: `${process.env.YOUR_DOMAIN}/checkout-success?orderId=${orderId}`,
      cancelUrl: `${process.env.YOUR_DOMAIN}/checkout-cancel?orderId=${orderId}`,
    });

    console.log("✅ Phản hồi từ PayOS:", paymentLinkResponse);
    res.json(paymentLinkResponse);
  } catch (error) {
    console.error("❌ Lỗi tạo link PayOS:", error);
    res.status(500).json({ error: error.message });
  }
});


app.use("/api/payos", payOSWebhookRoutes);

app.use("/api/faqs", faqRoutes);

// Lắng nghe cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
