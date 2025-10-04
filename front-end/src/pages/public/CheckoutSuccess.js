import React from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate("/orders/history");
  };

  return (
    <>
    <MainHeader />
    <div
      className="checkout-success"
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
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: "#16a34a", fontWeight: 700, marginBottom: 12 }}>
          Thanh toán thành công!
        </h2>
        <p style={{ fontSize: 18, color: "#166534", marginBottom: 24 }}>
          Cảm ơn bạn đã mua hàng tại{" "}
          <span style={{ fontWeight: 600 }}>Bản Hương 🌿</span>
        </p>
        <button
          onClick={handleViewOrders}
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
        >
          Xem đơn hàng
        </button>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default CheckoutSuccess;
