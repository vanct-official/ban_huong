// routes/payOSWebhook.route.js
import express from "express";
import crypto from "crypto";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";

const router = express.Router();

// Middleware để lấy rawBody cho việc verify signature
router.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf; // lưu rawBody để verify signature
  }
}));

// Hàm verify signature từ PayOS
function verifyPayOSSignature(req) {
  const signature = req.headers["x-signature"];
  const rawBody = req.rawBody;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!signature || !rawBody) return false;

  const expected = crypto
    .createHmac("sha256", checksumKey)
    .update(rawBody)
    .digest("hex");

  return signature === expected;
}

// POST /api/payOS/webhook
router.post("/webhook", async (req, res) => {
  try {
    const data = req.body.data;

    // 1️⃣ Verify signature
    if (!verifyPayOSSignature(req)) {
      console.warn("⚠️ Webhook signature không hợp lệ!");
      return res.status(403).json({ message: "Invalid signature" });
    }

    // 2️⃣ Kiểm tra trạng thái thanh toán
    if (!data || data.status !== "PAID") {
      console.warn("⚠️ Transaction không hợp lệ hoặc chưa thanh toán");
      return res.status(400).json({ message: "Invalid or unpaid transaction" });
    }

    // 3️⃣ Lấy thông tin metadata
    const metadata = data.metadata || {};
    const {
      orderCode,
      userId,
      addressId,
      items = [],
      promotionId,
      discountAmount = 0,
      shippingAmount = 0,
    } = metadata;

    // 4️⃣ Tránh tạo trùng order nếu webhook gửi lại
    const existingOrder = await Order.findOne({ where: { orderCode } });
    if (existingOrder) {
      console.log(`⚠️ Webhook bị gửi lại cho order ${orderCode}`);
      return res.status(200).json({ success: true });
    }

    // 5️⃣ Tạo order
    const newOrder = await Order.create({
      userId,
      orderCode,
      addressId,
      promotionId,
      discountAmount,
      shippingAmount,
      totalAmount: data.amount,
      paymentMethod: "PayOS",
      paymentStatus: "Paid",
      orderStatus: "Pending",
    });

    // 6️⃣ Tạo order items
    for (const item of items) {
      await OrderItem.create({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        finalPrice: item.price * item.quantity,
      });
    }

    console.log("✅ Đã tạo đơn hàng sau khi PayOS thanh toán:", newOrder.id);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Lỗi xử lý webhook:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
