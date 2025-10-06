import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  Avatar,
  Button,
  Typography,
  Space,
  Form,
  Input,
  Divider,
  notification,
} from "antd";
import {
  LogoutOutlined,
  MailOutlined,
  GoogleOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const { Title, Text } = Typography;

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Kiểm tra login từ localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user_data");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    setUser(null);
  };

  // ✅ Login Google
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        const userData = {
          ...data.user,
          picture: data.user.avatar || data.user.picture || decoded.picture,
          loginMethod: "google",
        };
        setUser(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));

        notification.success({ message: "Đăng nhập Google thành công!" });

        // ✅ Redirect theo role
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        notification.error({
          message: data.message || "Đăng nhập Google thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Google login error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    notification.error({ message: "Không thể đăng nhập với Google" });
  };

  // ✅ Login Email/Password
  const handleLogin = async (values) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_data", JSON.stringify(data.user));
        setUser(data.user);

        notification.success({ message: "Đăng nhập thành công" });

        // ✅ Redirect theo role
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // ❌ Sai mật khẩu / tài khoản → dùng alert
        window.alert(data.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      window.alert("Lỗi server, vui lòng thử lại sau!");
    }
  };

  const handleLogout = () => {
    clearAuth();
    notification.info({ message: "Đã đăng xuất" });
  };

  return (
    <GoogleOAuthProvider clientId="677644332847-gj96iobsvcsqlnno7ea8dlv3nsqt4gfr.apps.googleusercontent.com">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9fafb",
          padding: 20,
        }}
      >
        {!user ? (
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
              Bản Hương
            </Title>
            <Text>Essential Oils & Natural Fragrances</Text>

            <Divider />

            {/* Form login tài khoản */}
            <Form layout="vertical" onFinish={handleLogin}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/")}
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  fontSize: 20,
                  color: "#166534",
                }}
              ></Button>
              <Form.Item
                name="emailOrUsername"
                rules={[
                  { required: true, message: "Nhập email hoặc username" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email hoặc Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Nhập mật khẩu" }]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
              {/* 👇 Thêm nút Quên mật khẩu */}
              <p style={{ textAlign: "right", marginTop: -12 }}>
                <a onClick={() => navigate("/forgot-password")}>
                  Quên mật khẩu?
                </a>
              </p>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ marginBottom: 16 }}
              >
                Đăng nhập tài khoản
              </Button>
            </Form>

            <Divider>Hoặc</Divider>

            {/* Google Login */}
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              shape="rectangular"
              width="100%"
              text="signin_with"
            />

            <p style={{ marginTop: 16 }}>
              Chưa có tài khoản?{" "}
              <a onClick={() => navigate("/register")}>Đăng ký</a>
            </p>
          </Card>
        ) : (
          <Card
            style={{
              maxWidth: 420,
              width: "100%",
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Avatar size={80} src={user.picture} />
              <Title level={4} style={{ marginTop: 12 }}>
                {user.name || user.username}
              </Title>
              <Text type="secondary">{user.email}</Text>
            </div>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button type="primary" block onClick={() => navigate("/")}>
                Về Trang chủ
              </Button>
              <Button
                block
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </Space>
          </Card>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
