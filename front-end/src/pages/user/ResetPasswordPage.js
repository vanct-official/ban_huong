import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, notification } from "antd";

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await res.json();
      if (res.ok) {
        notification.success({
          message: "Đổi mật khẩu thành công!",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "Thất bại",
          description: data.message || "Token không hợp lệ hoặc đã hết hạn",
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
        justifyContent: "center",
        alignItems: "center",
        background: "#f9fafb",
      }}
    >
      <Card style={{ width: 400, borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: "center", color: "#166534" }}>
          Đặt lại mật khẩu
        </Title>
        <Form layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
                message:
                  "Mật khẩu tối thiểu 8 ký tự, gồm chữ cái, số và ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Xác nhận
          </Button>
        </Form>
      </Card>
    </div>
  );
}
