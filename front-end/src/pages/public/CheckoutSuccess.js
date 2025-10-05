// pages/CheckoutSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { message, Spin, Button } from "antd";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status"); // PayOS trả về status=PAID hay khác

    if (!orderId) {
      message.error("Không tìm thấy đơn hàng!");
      navigate("/");
      return;
    }

    const confirmPayment = async () => {
      try {
        if (status === "PAID") {
          const token = localStorage.getItem("token");
          await axios.post(
            `${API_URL}/api/orders/confirm-payos`,
            { orderId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        setSuccess(true);
        message.success("✅ Thanh toán thành công!");
      } catch (err) {
        console.error("❌ Lỗi xác nhận thanh toán:", err);
        message.error("Xác nhận thanh toán thất bại");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(60,60,120,0.10)",
            padding: "48px 32px",
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Spin size="large" tip="Đang xác nhận thanh toán..." />
        </div>
      </div>
    );
  }

  return (
    <div
      className="checkout-success"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: success
          ? "linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)"
          : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(60,60,120,0.10)",
          padding: "48px 32px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        {success ? (
          <>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: "#16a34a", fontWeight: 700, marginBottom: 12 }}>
              Thanh toán thành công!
            </h2>
            <p style={{ fontSize: 18, color: "#166534", marginBottom: 24 }}>
              Đơn hàng của bạn đã được ghi nhận.<br />
              Cảm ơn bạn đã mua hàng tại <span style={{ fontWeight: 600 }}>Bản Hương 🌿</span>
            </p>
            <Button
              type="primary"
              size="large"
              style={{
                marginTop: "10px",
                padding: "12px 32px",
                background: "linear-gradient(135deg, #16a34a 0%, #4ade80 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(22,101,52,0.15)",
                transition: "background 0.2s",
              }}
              onClick={() => navigate("/orders/history")}
            >
              Xem đơn hàng
            </Button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 60, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: "#e11d48", fontWeight: 700, marginBottom: 12 }}>
              Thanh toán chưa được xác nhận
            </h2>
            <p style={{ fontSize: 18, color: "#be123c", marginBottom: 24 }}>
              Vui lòng liên hệ bộ phận hỗ trợ nếu cần.<br />
              Hoặc thử lại sau.
            </p>
            <Button
              type="default"
              size="large"
              style={{
                marginTop: "10px",
                padding: "12px 32px",
                background: "linear-gradient(135deg, #e11d48 0%, #fca5a5 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(220,38,38,0.15)",
                transition: "background 0.2s",
              }}
              onClick={() => navigate("/")}
            >
              Quay về trang chủ
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
