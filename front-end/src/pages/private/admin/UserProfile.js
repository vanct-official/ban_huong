import React, { useEffect, useState } from "react";
import { Card, Avatar, Spin, Alert, Button, Badge, Divider, Space, Typography } from "antd";
import MainHeader from "../../../components/MainHeader";
import Footer from "../../../components/Footer";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  LogoutOutlined,
  EditOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("google_token");
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

  const handleLogout = () => {
    localStorage.removeItem("google_token");
    navigate("/");
  };

  if (loading)
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, fontSize: 16 }}>{t("loading")}</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div style={{ 
        minHeight: '100vh', 
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <MainHeader />
        <div style={{ maxWidth: 500, margin: '40px auto' }}>
          <Alert
            type="error"
            message="⚠️ Error"
            description={error}
            style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
        </div>
        <Footer />
      </div>
    );

  if (!user)
    return (
      <div style={{ 
        minHeight: '100vh', 
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <MainHeader />
        <div style={{ maxWidth: 500, margin: '40px auto' }}>
          <Alert
            type="warning"
            message={t("userNotFound")}
            style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
        </div>
        <Footer />
      </div>
    );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '150px',
        height: '150px',
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        background: 'rgba(255,255,255,0.08)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <MainHeader />
      
      <div style={{ padding: '40px 20px', position: 'relative' }}>
        <Card
          style={{ 
            maxWidth: 600, 
            margin: '0 auto', 
            borderRadius: 24,
            overflow: 'hidden',
            border: 'none',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.05)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            position: 'relative'
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* Header with gradient background */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 30px 80px',
            position: 'relative',
            textAlign: 'center'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="20" cy="20" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat'
            }} />
            
            <Badge.Ribbon text="VIP" color="gold" style={{ top: 10, right: 10 }}>
              <div />
            </Badge.Ribbon>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <Badge count={<StarFilled style={{ color: '#faad14', fontSize: 16 }} />}>
                <Avatar
                  size={120}
                  src={user.avatarImg}
                  icon={<UserOutlined />}
                  style={{ 
                    border: '4px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                />
              </Badge>
              <Title 
                level={2} 
                style={{ 
                  color: 'white', 
                  marginTop: 20, 
                  marginBottom: 8,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {user.firstname} {user.middlename} {user.lastname}
              </Title>
              <Text style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: 16,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                {t("profile")}
              </Text>
            </div>
          </div>

          {/* Profile Information */}
          <div style={{ padding: '40px 30px 30px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              
              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, #f6f8ff 0%, #f0f4ff 100%)',
                borderRadius: 16,
                border: '1px solid rgba(102, 126, 234, 0.1)'
              }}>
                <Space size="middle" style={{ width: '100%' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IdcardOutlined style={{ fontSize: 20, color: 'white' }} />
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>
                      {t("id")}
                    </Text>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>
                      #{user.id}
                    </div>
                  </div>
                </Space>
              </div>

              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, #fff6f6 0%, #fff0f0 100%)',
                borderRadius: 16,
                border: '1px solid rgba(255, 77, 79, 0.1)'
              }}>
                <Space size="middle" style={{ width: '100%' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MailOutlined style={{ fontSize: 20, color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>
                      {t("email")}
                    </Text>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', wordBreak: 'break-all' }}>
                      {user.email}
                    </div>
                  </div>
                </Space>
              </div>

              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, #f0fff4 0%, #f6fffa 100%)',
                borderRadius: 16,
                border: '1px solid rgba(82, 196, 26, 0.1)'
              }}>
                <Space size="middle" style={{ width: '100%' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PhoneOutlined style={{ fontSize: 20, color: 'white' }} />
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>
                      {t("phone")}
                    </Text>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>
                      {user.phone || (
                        <Text type="secondary" italic>{t("notUpdated")}</Text>
                      )}
                    </div>
                  </div>
                </Space>
              </div>

            </Space>
          </div>

          <Divider style={{ margin: '0 30px 30px' }} />

          {/* Action Buttons */}
          <div style={{ padding: '0 30px 40px' }}>
            <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
              <Button 
                type="primary" 
                size="large"
                icon={<EditOutlined />}
                onClick={() => navigate("/admin/profile/edit")}
                style={{
                  borderRadius: 12,
                  height: 48,
                  paddingLeft: 24,
                  paddingRight: 24,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  fontSize: 16,
                  fontWeight: 600
                }}
              >
                {t("updateProfile")}
              </Button>
              <Button
                danger
                size="large"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{
                  borderRadius: 12,
                  height: 48,
                  paddingLeft: 24,
                  paddingRight: 24,
                  fontSize: 16,
                  fontWeight: 600
                }}
              >
                {t("logout")}
              </Button>
            </Space>
          </div>
        </Card>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;