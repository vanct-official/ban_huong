// config/payOS.js
import { PayOS } from "@payos/node"; // mặc định export là một hàm
import dotenv from "dotenv";

dotenv.config();

// Tạo instance PayOS bằng cách gọi trực tiếp hàm
export const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

console.log("✅ PayOS initialized successfully");
