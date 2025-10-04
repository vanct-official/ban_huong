import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  notification,
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        notification.success({
          message: "Đăng ký thành công",
          description: "Bạn có thể đăng nhập ngay bây giờ!",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "Đăng ký thất bại",
          description: data.message || "Có lỗi xảy ra",
        });
      }
    } catch (err) {
      notification.error({
        message: "Lỗi server",
        description: "Không thể kết nối tới backend",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        padding: 20,
      }}
    >
      <Card
        style={{
          maxWidth: 420,
          width: "100%",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <img
          src="/image/BanHuong.png"
          alt="Bản Hương"
          style={{ width: 80, marginBottom: 12 }}
        />
        <Title level={3} style={{ color: "#166534" }}>
          Đăng ký tài khoản
        </Title>
        <Text type="secondary">Tạo tài khoản để bắt đầu trải nghiệm</Text>

        <Divider />

        {/* Form đăng ký */}
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            name="firstname"
            label="Họ"
            rules={[{ required: true, message: "Vui lòng nhập họ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Email không hợp lệ" },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    const res = await fetch(`${API_URL}/api/auth/check-email`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: value }),
                    });
                    const data = await res.json();
                    if (data.exists) {
                      return Promise.reject("Email này đã được sử dụng!");
                    }
                    return Promise.resolve();
                  } catch (err) {
                    return Promise.reject(
                      "Không thể kiểm tra email, thử lại sau"
                    );
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              marginTop: 10,
              background: "#166534",
              borderColor: "#166534",
            }}
          >
            Đăng ký
          </Button>
        </Form>

        <p style={{ marginTop: 16 }}>
          Đã có tài khoản? <a onClick={() => navigate("/login")}>Đăng nhập</a>
        </p>
      </Card>
    </div>
  );
}
