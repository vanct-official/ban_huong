import React from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";

const CheckoutCancel = () => {
  const navigate = useNavigate();

  return (
    <>
    <MainHeader />
    <div
      className="checkout-cancel"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
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
        <div style={{ fontSize: 60, marginBottom: 16 }}>❌</div>
        <h2 style={{ color: "#e11d48", fontWeight: 700, marginBottom: 12 }}>
          Thanh toán thất bại hoặc đã hủy!
        </h2>
        <p style={{ fontSize: 18, color: "#be123c", marginBottom: 24 }}>
          Giao dịch của bạn chưa được hoàn tất.
          <br />
          Vui lòng kiểm tra lại hoặc thử lại sau.
        </p>
        <button
          onClick={() => navigate("/cart")}
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
        >
          Quay lại giỏ hàng
        </button>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default CheckoutCancel;
