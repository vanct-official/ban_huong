import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Spin,
  Alert,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Divider,
} from "antd";

import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";

const { Title, Text } = Typography;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [defaultAddress, setDefaultAddress] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("profile") + " - Bản Hương";

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError(t("notLoggedIn"));
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || t("fetchUserFailed"));
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  // Khi user đã có, mới fetch địa chỉ mặc định
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch(
          `http://localhost:5000/api/addresses/user/${user.id}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          const found = data.find((addr) => addr.isDefault);
          setDefaultAddress(found || null);
        }
      } catch (err) {
        console.error("❌ Lỗi load địa chỉ:", err);
      }
    };

    if (user?.id) {
      fetchDefaultAddress();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
        }}
      >
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
        }}
      >
        <div style={{ maxWidth: 500, margin: "40px auto" }}>
          <Alert
            type="error"
            message="⚠️ Error"
            description={error}
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </div>
    );

  if (!user)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
        }}
      >
        <div style={{ maxWidth: 500, margin: "40px auto" }}>
          <Alert
            type="warning"
            message={t("userNotFound")}
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </div>
    );

  return (
    <>
      <MainHeader />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
        }}
      >
        <div style={{ padding: "40px 16px", maxWidth: 900, margin: "0 auto" }}>
          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(60,60,120,0.10)",
              border: "none",
              background: "rgba(255,255,255,0.98)",
              minHeight: 320,
            }}
            bodyStyle={{ padding: 0 }}
          >
            <Row gutter={[0, 0]} wrap align="middle">
              {/* Left: Avatar & Basic Info */}
              <Col
                xs={24}
                md={8}
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                  borderRadius: "20px 0 0 20px",
                  minHeight: 320,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 32,
                }}
              >
                <Avatar
                  size={100}
                  src={user.avatarImg}
                  icon={<UserOutlined />}
                  style={{
                    border: "4px solid #fff",
                    marginBottom: 18,
                    boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
                  }}
                />
                <Title level={3} style={{ color: "#fff", marginBottom: 0 }}>
                  {user.firstname} {user.middlename} {user.lastname}
                </Title>
                <Text style={{ color: "#e0e7ff", fontSize: 15 }}>
                  {user.email}
                </Text>
              </Col>

              {/* Right: Details & Actions */}
              <Col xs={24} md={16} style={{ padding: 32 }}>
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Title level={4} style={{ marginBottom: 0 }}>
                    {t("profile")}
                  </Title>
                  <Divider style={{ margin: "8px 0 16px 0" }} />

                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <Space>
                      <MailOutlined
                        style={{ color: "#6366f1", fontSize: 18 }}
                      />
                      <Text strong>{t("email")}:</Text>
                      <Text>{user.email}</Text>
                    </Space>
                    <Space>
                      <PhoneOutlined
                        style={{ color: "#6366f1", fontSize: 18 }}
                      />
                      <Text strong>{t("phone")}:</Text>
                      <Text>
                        {user.phone || (
                          <Text type="secondary" italic>
                            {t("notUpdated")}
                          </Text>
                        )}
                      </Text>
                    </Space>
                  </Space>

                  {/* ✅ Địa chỉ mặc định */}
                  <Space align="start">
                    <UserOutlined
                      style={{ color: "#6366f1", fontSize: 18, marginTop: 2 }}
                    />
                    <div>
                      <Text strong>Địa chỉ mặc định:</Text>
                      <br />
                      {defaultAddress ? (
                        <Text>
                          {defaultAddress.street}, {defaultAddress.ward},{" "}
                          {defaultAddress.province}
                        </Text>
                      ) : (
                        <Text type="secondary" italic>
                          Chưa có địa chỉ mặc định
                        </Text>
                      )}
                    </div>
                  </Space>

                  <Divider style={{ margin: "16px 0" }} />

                  <Space size="middle">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => navigate("/profile/edit")}
                      style={{
                        borderRadius: 8,
                        fontWeight: 600,
                        minWidth: 120,
                      }}
                    >
                      {t("updateProfile")}
                    </Button>
                    <Button
                      danger
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                      style={{
                        borderRadius: 8,
                        fontWeight: 600,
                        minWidth: 120,
                      }}
                    >
                      {t("logout")}
                    </Button>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
