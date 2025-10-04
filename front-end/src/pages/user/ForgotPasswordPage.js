import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import React, { useState } from "react";

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        window.alert("Email khôi phục đã được gửi! Vui lòng kiểm tra hộp thư.");
      } else {
        window.alert(data.message || "Email không tồn tại trong hệ thống");
      }
    } catch (err) {
      window.alert("Lỗi server, không thể kết nối tới backend");
    } finally {
      setLoading(false);
    }
  };

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
      <Card style={{ maxWidth: 400, width: "100%", borderRadius: 12 }}>
        {/* 👇 Quay lại trang trước */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            fontSize: 20,
            color: "#166534",
          }}
        />

        <Title level={3} style={{ textAlign: "center", color: "#166534" }}>
          Quên mật khẩu
        </Title>
        <Text type="secondary">
          Nhập email của bạn để nhận link đặt lại mật khẩu.
        </Text>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Nhập email hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ background: "#166534", borderColor: "#166534" }}
          >
            Gửi link khôi phục
          </Button>
        </Form>
      </Card>
    </div>
  );
}
