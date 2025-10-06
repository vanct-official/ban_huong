import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Spin, Typography, Button } from "antd";

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác minh email...");
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/auth/verify-email?token=${token}`
        );

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email đã được xác nhận thành công!");
        } else {
          setStatus("error");
          setMessage(
            data.message || "Liên kết xác nhận không hợp lệ hoặc đã hết hạn."
          );
        }
      } catch (err) {
        setStatus("error");
        setMessage("Lỗi kết nối tới máy chủ.");
      }
    };

    if (token) verifyEmail();
    else {
      setStatus("error");
      setMessage("Thiếu token xác nhận.");
    }
  }, [token]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f9fafb",
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 16,
          textAlign: "center",
          padding: "24px 16px",
        }}
      >
        {status === "loading" && (
          <>
            <Spin size="large" />
            <Title level={4} style={{ marginTop: 20 }}>
              Đang xác minh email...
            </Title>
          </>
        )}

        {status === "success" && (
          <>
            <img
              src="/image/success.png"
              alt="success"
              style={{ width: 100, marginBottom: 16 }}
            />
            <Title level={4} style={{ color: "#166534" }}>
              Xác minh thành công!
            </Title>
            <Text>{message}</Text>
            <Button
              type="primary"
              block
              style={{ marginTop: 16 }}
              onClick={() => navigate("/login")}
            >
              Đăng nhập ngay
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <img
              src="/image/error.png"
              alt="error"
              style={{ width: 100, marginBottom: 16 }}
            />
            <Title level={4} style={{ color: "red" }}>
              Xác minh thất bại
            </Title>
            <Text>{message}</Text>
            <Button
              block
              style={{ marginTop: 16 }}
              onClick={() => navigate("/")}
            >
              Về trang chủ
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
