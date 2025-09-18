import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  Avatar,
  Button,
  Typography,
  Row,
  Col,
  Space,
  notification,
  Modal,
  Divider,
} from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  MailOutlined,
  GoogleOutlined,
  ShoppingOutlined,
  HeartOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Kiểm tra user đã đăng nhập khi component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const googleToken = localStorage.getItem("google_token");
      const userData = localStorage.getItem("user_data");

      if ((accessToken || googleToken) && userData) {
        try {
          // Verify token với backend nếu có API
          const response = await fetch(
            `${
              process.env.REACT_APP_API_URL || "http://localhost:5000"
            }/api/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken || googleToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const userInfo = {
              ...data.user,
              picture:
                data.user.avatar || data.user.picture || data.user.avatarImg,
              loginMethod: "google",
            };
            setUser(userInfo);
          } else {
            console.warn("API /me không phản hồi, dùng cached user");
            const cachedUser = JSON.parse(userData);
            if (cachedUser) {
              setUser(cachedUser);
            } else {
              clearAuthData();
            }
          }
        } catch (error) {
          // Nếu không có API, sử dụng dữ liệu từ localStorage
          console.log("Using cached user data");
          const cachedUser = JSON.parse(userData);
          setUser({
            ...cachedUser,
            picture:
              cachedUser.avatar || cachedUser.picture || cachedUser.avatarImg,
            loginMethod: "google",
          });
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      clearAuthData();
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("google_token");
    localStorage.removeItem("user_data");
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // Decode token để lấy thông tin cơ bản
      const decoded = jwtDecode(credentialResponse.credential);

      try {
        // Gửi Google token lên Backend để xác thực (nếu có API)
        const response = await fetch(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000"
          }/api/auth/google`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: credentialResponse.credential,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Lưu token và thông tin user từ backend
          if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
          }
          localStorage.setItem(
            "google_token",
            data.google_token || credentialResponse.credential
          );

          const userData = {
            ...data.user,
            picture:
              data.user.avatar ||
              data.user.picture ||
              data.user.avatarImg ||
              decoded.picture,
            loginMethod: "google",
          };

          setUser(userData);
          localStorage.setItem("user_data", JSON.stringify(userData));

          notification.success({
            message: "Đăng nhập thành công!",
            description: `Chào mừng ${userData.name} đến với Bản Hương`,
            placement: "topRight",
            duration: 3,
          });
        } else {
          throw new Error("Backend authentication failed");
        }
      } catch (apiError) {
        // Nếu không có API hoặc API lỗi, sử dụng thông tin từ Google token
        console.log("Using Google token directly:", apiError.message);

        localStorage.setItem("google_token", credentialResponse.credential);

        const userData = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          email_verified: decoded.email_verified,
          loginMethod: "google",
        };

        setUser(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));

        notification.success({
          message: "Đăng nhập thành công!",
          description: `Chào mừng ${userData.name} đến với Bản Hương`,
          placement: "topRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      notification.error({
        message: "Đăng nhập thất bại",
        description: "Có lỗi xảy ra trong quá trình đăng nhập với Google",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    notification.error({
      message: "Đăng nhập thất bại",
      description: "Không thể đăng nhập với Google. Vui lòng thử lại sau.",
      placement: "topRight",
    });
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const googleToken = localStorage.getItem("google_token");

      if (accessToken || googleToken) {
        try {
          // Gửi request logout lên Backend nếu có API
          await fetch(
            `${
              process.env.REACT_APP_API_URL || "http://localhost:5000"
            }/api/auth/logout`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken || googleToken}`,
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          console.log("Logout API not available, proceeding with local logout");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear tất cả dữ liệu local
      clearAuthData();
      setUser(null);

      notification.info({
        message: "Đã đăng xuất",
        description: "Hẹn gặp lại bạn!",
        placement: "topRight",
      });

      // Redirect về trang chủ
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const handleHome = () => {
    if(!user) {
      notification.warning({message: "Vui lòng đăng nhập"});
      return navigate("/login");
    }
    navigate(user.role === "admin" ? "/admin" : "/");
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  // Modal handlers
  const showTermsModal = () => {
    setTermsModalVisible(true);
  };

  const showPrivacyModal = () => {
    setPrivacyModalVisible(true);
  };

  const handleTermsModalClose = () => {
    setTermsModalVisible(false);
  };

  const handlePrivacyModalClose = () => {
    setPrivacyModalVisible(false);
  };

  return (
    <GoogleOAuthProvider clientId="677644332847-gj96iobsvcsqlnno7ea8dlv3nsqt4gfr.apps.googleusercontent.com">
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #f7fee7 50%, #ecfdf5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          position: "relative",
        }}
      >
        {/* Decorative background elements */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "10%",
              width: "120px",
              height: "120px",
              background:
                "linear-gradient(135deg, rgba(22,101,52,0.1) 0%, rgba(21,128,61,0.1) 100%)",
              borderRadius: "50%",
              filter: "blur(40px)",
              animation: "float 6s ease-in-out infinite",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "60%",
              right: "15%",
              width: "80px",
              height: "80px",
              background:
                "linear-gradient(135deg, rgba(21,128,61,0.15) 0%, rgba(34,197,94,0.15) 100%)",
              borderRadius: "50%",
              filter: "blur(30px)",
              animation: "float 8s ease-in-out infinite reverse",
            }}
          ></div>
        </div>

        <Row
          justify="center"
          style={{
            width: "100%",
            maxWidth: "1200px",
            zIndex: 2,
            position: "relative",
          }}
        >
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            {!user ? (
              // Login Card
              <Card
                style={{
                  borderRadius: "24px",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 20px 60px rgba(22,101,52,0.12), 0 8px 32px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
                bodyStyle={{ padding: "48px 32px" }}
              >
                {/* Logo & Brand */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <img
                    src="/image/BanHuong.png"
                    alt="Bản Hương Logo"
                    style={{ width: "100px", marginBottom: "16px" }}
                  />

                  <Title
                    level={1}
                    style={{
                      margin: "0 0 8px 0",
                      background:
                        "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontSize: "32px",
                      fontWeight: 800,
                    }}
                  >
                    {t("banHuong")}
                  </Title>

                  <Text
                    style={{
                      color: "#9ca3af",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    Essential Oils & Natural Fragrances
                  </Text>
                </div>

                {/* Welcome Message */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <Title
                    level={2}
                    style={{ marginBottom: "8px", color: "#374151" }}
                  >
                    {t("welcomeToBanHuong")}
                  </Title>
                  <Text style={{ color: "#6b7280", fontSize: "16px" }}>
                    Đăng nhập để khám phá thế giới tinh dầu thiên nhiên
                  </Text>
                </div>

                {/* Google Login Section */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                      boxShadow: "0 4px 20px rgba(22,101,52,0.3)",
                    }}
                  >
                    <div
                      style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "8px",
                      }}
                    >
                      <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginError}
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                        logo_alignment="left"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {loading && (
                    <div style={{ marginTop: "16px" }}>
                      <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                        Đang xử lý đăng nhập...
                      </Text>
                    </div>
                  )}
                </div>

                {/* Features Highlight */}
                <div
                  style={{
                    background: "rgba(22,101,52,0.05)",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      textAlign: "center",
                      marginBottom: "16px",
                      color: "#166534",
                    }}
                  >
                    Tại sao chọn Bản Hương?
                  </Title>
                  <Row gutter={16}>
                    <Col span={8} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                        🌿
                      </div>
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        100% Thiên nhiên
                      </Text>
                    </Col>
                    <Col span={8} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                        🚚
                      </div>
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Giao hàng nhanh
                      </Text>
                    </Col>
                    <Col span={8} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                        ⭐
                      </div>
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          display: "block",
                        }}
                      >
                        Chất lượng cao
                      </Text>
                    </Col>
                  </Row>
                </div>

                {/* Terms */}
                <div style={{ textAlign: "center" }}>
                  <Text
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    Bằng cách đăng nhập, bạn đồng ý với{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        showTermsModal();
                      }}
                      style={{ color: "#166534", fontWeight: 500 }}
                    >
                      Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        showPrivacyModal();
                      }}
                      style={{ color: "#166534", fontWeight: 500 }}
                    >
                      Chính sách bảo mật
                    </a>{" "}
                    của chúng tôi
                  </Text>
                </div>
              </Card>
            ) : (
              // User Profile Card
              <Card
                style={{
                  borderRadius: "24px",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 20px 60px rgba(22,101,52,0.12), 0 8px 32px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
                bodyStyle={{ padding: "48px 32px" }}
              >
                {/* Success Animation */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      margin: "0 auto 16px",
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "bounceIn 0.6s ease-out",
                    }}
                  >
                    <span style={{ color: "white", fontSize: "24px" }}>✓</span>
                  </div>
                  <Title level={3} style={{ color: "#166534", margin: 0 }}>
                    {t("loginSuccessfully")}
                  </Title>
                  <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                    Chào mừng bạn trở lại Bản Hương
                  </Text>
                </div>

                {/* User Info */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <Avatar
                    size={100}
                    src={user.picture}
                    style={{
                      marginBottom: "20px",
                      border: "4px solid #fff",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    }}
                  />

                  <Title
                    level={2}
                    style={{ margin: "0 0 8px 0", color: "#1f2937" }}
                  >
                    {user.name}
                  </Title>

                  <Space direction="vertical" size="small">
                    <Space>
                      <MailOutlined style={{ color: "#6b7280" }} />
                      <Text style={{ color: "#6b7280", fontSize: "16px" }}>
                        {user.email}
                      </Text>
                    </Space>
                    {user.email_verified && (
                      <Text style={{ color: "#166534", fontSize: "14px" }}>
                        ✓ Email đã được xác minh
                      </Text>
                    )}
                    <Space>
                      <GoogleOutlined style={{ color: "#4285f4" }} />
                      <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                        Đăng nhập bằng Google
                      </Text>
                    </Space>
                  </Space>
                </div>

                {/* User Stats/Info */}
                <Row gutter={16} style={{ marginBottom: "32px" }}>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "16px",
                        background: "rgba(238,77,45,0.05)",
                        borderRadius: "12px",
                      }}
                    >
                      <ShoppingOutlined
                        style={{
                          fontSize: "20px",
                          color: "#ee4d2d",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#ee4d2d",
                        }}
                      >
                        0
                      </div>
                      <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                        Đơn hàng
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "16px",
                        background: "rgba(249,115,22,0.05)",
                        borderRadius: "12px",
                      }}
                    >
                      <HeartOutlined
                        style={{
                          fontSize: "20px",
                          color: "#f97316",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#f97316",
                        }}
                      >
                        0
                      </div>
                      <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                        Yêu thích
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "16px",
                        background: "rgba(16,185,129,0.05)",
                        borderRadius: "12px",
                      }}
                    >
                      <GiftOutlined
                        style={{
                          fontSize: "20px",
                          color: "#10b981",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#10b981",
                        }}
                      >
                        New
                      </div>
                      <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                        Thành viên
                      </Text>
                    </div>
                  </Col>
                </Row>

                {/* Action Buttons */}
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handleHome}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: 600,
                      boxShadow: "0 4px 20px rgba(22,101,52,0.3)",
                    }}
                  >
                    {t("returnHome")}
                  </Button>

                  <Button
                    size="large"
                    block
                    onClick={handleViewProfile}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      borderColor: "#166534",
                      color: "#166534",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    Xem hồ sơ
                  </Button>

                  <Button
                    size="large"
                    block
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      borderColor: "#d1d5db",
                      color: "#6b7280",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    Đăng xuất
                  </Button>
                </Space>
              </Card>
            )}
          </Col>
        </Row>

        {/* Terms of Service Modal */}
        <Modal
          title={
            <div style={{ textAlign: "center", color: "#166534" }}>
              <Title level={3} style={{ margin: 0, color: "#166534" }}>
                📋 Điều khoản dịch vụ
              </Title>
            </div>
          }
          open={termsModalVisible}
          onCancel={handleTermsModalClose}
          footer={[
            <Button key="close" type="primary" onClick={handleTermsModalClose}>
              Đã hiểu
            </Button>,
          ]}
          width={700}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto", padding: "24px" }}
        >
          <div>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
              Chào mừng bạn đến với <strong>Bản Hương</strong> - nền tảng thương
              mại điện tử chuyên về tinh dầu và các sản phẩm thiên nhiên. Bằng
              cách sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều
              khoản dưới đây.
            </Paragraph>

            <Divider />

            <Title level={4} style={{ color: "#166534" }}>
              1. Điều khoản sử dụng
            </Title>
            <Paragraph>
              • Bạn phải từ 18 tuổi trở lên để sử dụng dịch vụ
              <br />
              • Thông tin đăng ký phải chính xác và đầy đủ
              <br />
              • Bạn chịu trách nhiệm về tất cả hoạt động trong tài khoản
              <br />• Không được sử dụng dịch vụ cho mục đích bất hợp pháp
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              2. Sản phẩm và dịch vụ
            </Title>
            <Paragraph>
              • Tất cả sản phẩm được bán đều là tinh dầu thiên nhiên chất lượng
              cao
              <br />
              • Giá cả và thông tin sản phẩm có thể thay đổi mà không cần báo
              trước
              <br />• Chúng tôi bảo lưu quyền từ chối hoặc hủy đơn hàng trong
              trường hợp cần thiết
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              3. Thanh toán và giao hàng
            </Title>
            <Paragraph>
              • Chấp nhận các phương thức thanh toán: thẻ tín dụng, chuyển
              khoản, COD
              <br />
              • Giao hàng trong vòng 2-5 ngày làm việc
              <br />• Phí giao hàng được tính theo khu vực và trọng lượng đơn
              hàng
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              4. Chính sách đổi trả
            </Title>
            <Paragraph>
              • Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng
              <br />
              • Sản phẩm phải còn nguyên vẹn, chưa sử dụng
              <br />• Chi phí vận chuyển đổi trả do khách hàng chi trả (trừ
              trường hợp lỗi từ shop)
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              5. Trách nhiệm và giới hạn
            </Title>
            <Paragraph>
              • Bản Hương không chịu trách nhiệm về các phản ứng dị ứng cá nhân
              <br />
              • Khách hàng cần đọc kỹ thành phần và hướng dẫn sử dụng
              <br />• Tham khảo ý kiến bác sĩ trước khi sử dụng nếu có vấn đề
              sức khỏe
            </Paragraph>

            <Divider />

            <Paragraph
              style={{
                textAlign: "center",
                fontStyle: "italic",
                color: "#666",
              }}
            >
              Điều khoản có hiệu lực từ ngày 01/01/2024 và có thể được cập nhật
              bất cứ lúc nào.
              <br />
              Để biết thêm chi tiết, vui lòng liên hệ: support@banhuong.com
            </Paragraph>
          </div>
        </Modal>

        {/* Privacy Policy Modal */}
        <Modal
          title={
            <div style={{ textAlign: "center", color: "#166534" }}>
              <Title level={3} style={{ margin: 0, color: "#166534" }}>
                🔒 Chính sách bảo mật
              </Title>
            </div>
          }
          open={privacyModalVisible}
          onCancel={handlePrivacyModalClose}
          footer={[
            <Button
              key="close"
              type="primary"
              onClick={handlePrivacyModalClose}
            >
              Đã hiểu
            </Button>,
          ]}
          width={700}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto", padding: "24px" }}
        >
          <div>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
              Tại <strong>Bản Hương</strong>, chúng tôi cam kết bảo vệ thông tin
              cá nhân của bạn. Chính sách này giải thích cách chúng tôi thu
              thập, sử dụng và bảo vệ dữ liệu của bạn.
            </Paragraph>

            <Divider />

            <Title level={4} style={{ color: "#166534" }}>
              1. Thông tin chúng tôi thu thập
            </Title>
            <Paragraph>
              <strong>Thông tin cá nhân:</strong>
              <br />
              • Họ tên, email, số điện thoại
              <br />
              • Địa chỉ giao hàng và thanh toán
              <br />
              • Thông tin đăng nhập Google (nếu sử dụng)
              <br />
              • Lịch sử mua hàng và sở thích sản phẩm
              <br />
              <br />
              <strong>Thông tin kỹ thuật:</strong>
              <br />
              • Địa chỉ IP, loại thiết bị, trình duyệt
              <br />
              • Cookie và dữ liệu phiên làm việc
              <br />• Thông tin tương tác với website
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              2. Mục đích sử dụng thông tin
            </Title>
            <Paragraph>
              • <strong>Xử lý đơn hàng:</strong> Xác nhận, đóng gói và giao hàng
              <br />• <strong>Chăm sóc khách hàng:</strong> Hỗ trợ, giải đáp
              thắc mắc
              <br />• <strong>Marketing:</strong> Gửi thông tin khuyến mãi, sản
              phẩm mới (với sự đồng ý)
              <br />• <strong>Cải thiện dịch vụ:</strong> Phân tích hành vi để
              nâng cao trải nghiệm
              <br />• <strong>Bảo mật:</strong> Phòng chống gian lận, bảo vệ tài
              khoản
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              3. Chia sẻ thông tin
            </Title>
            <Paragraph>
              <strong>Chúng tôi KHÔNG bán thông tin cá nhân của bạn.</strong>
              <br />
              <br />
              <strong>Chia sẻ có giới hạn với:</strong>
              <br />• <strong>Đối tác vận chuyển:</strong> Để giao hàng (chỉ
              thông tin cần thiết)
              <br />• <strong>Cổng thanh toán:</strong> Xử lý giao dịch an toàn
              <br />• <strong>Nhà cung cấp dịch vụ:</strong> Email marketing,
              phân tích dữ liệu
              <br />• <strong>Cơ quan pháp luật:</strong> Khi có yêu cầu hợp
              pháp
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              4. Bảo mật dữ liệu
            </Title>
            <Paragraph>
              • <strong>Mã hóa SSL:</strong> Bảo vệ dữ liệu truyền tải
              <br />• <strong>Firewall:</strong> Ngăn chặn truy cập trái phép
              <br />• <strong>Backup định kỳ:</strong> Phòng ngừa mất dữ liệu
              <br />• <strong>Kiểm soát truy cập:</strong> Chỉ nhân viên được ủy
              quyền mới có thể truy cập
              <br />• <strong>Đào tạo bảo mật:</strong> Nhân viên được đào tạo
              về bảo mật thông tin
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              5. Quyền của bạn
            </Title>
            <Paragraph>
              • <strong>Truy cập:</strong> Xem thông tin cá nhân chúng tôi lưu
              trữ
              <br />• <strong>Chỉnh sửa:</strong> Cập nhật thông tin cá nhân
              <br />• <strong>Xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu
              <br />• <strong>Từ chối marketing:</strong> Hủy đăng ký nhận email
              quảng cáo
              <br />• <strong>Di chuyển dữ liệu:</strong> Xuất dữ liệu cá nhân
              dạng file
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              6. Cookie và công nghệ theo dõi
            </Title>
            <Paragraph>
              • <strong>Cookie cần thiết:</strong> Đảm bảo website hoạt động
              <br />• <strong>Cookie phân tích:</strong> Hiểu cách sử dụng
              website
              <br />• <strong>Cookie marketing:</strong> Hiển thị quảng cáo phù
              hợp
              <br />• <strong>Quản lý cookie:</strong> Bạn có thể tắt cookie
              trong trình duyệt
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              7. Thời gian lưu trữ
            </Title>
            <Paragraph>
              • <strong>Tài khoản hoạt động:</strong> Lưu trữ cho đến khi bạn
              xóa tài khoản
              <br />• <strong>Lịch sử đơn hàng:</strong> 5 năm (theo quy định
              pháp luật)
              <br />• <strong>Dữ liệu marketing:</strong> 2 năm hoặc đến khi bạn
              hủy đăng ký
              <br />• <strong>Log hệ thống:</strong> 12 tháng
            </Paragraph>

            <Title level={4} style={{ color: "#166534" }}>
              8. Liên hệ về bảo mật
            </Title>
            <Paragraph
              style={{
                background: "#f8f9fa",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              Nếu có thắc mắc về chính sách bảo mật hoặc muốn thực hiện quyền
              của mình:
              <br />
              <br />
              📧 <strong>Email:</strong> privacy@banhuong.com
              <br />
              📞 <strong>Hotline:</strong> 1900 888 999
              <br />
              📍 <strong>Địa chỉ:</strong> Số 123 Đường ABC, Quận 1, TP.HCM
              <br />
              🕒 <strong>Giờ hỗ trợ:</strong> 8:00 - 22:00 (Thứ 2 - CN)
            </Paragraph>

            <Divider />

            <Paragraph
              style={{
                textAlign: "center",
                fontStyle: "italic",
                color: "#666",
              }}
            >
              Chính sách có hiệu lực từ ngày 01/01/2024. Chúng tôi có thể cập
              nhật chính sách này và sẽ thông báo cho bạn về các thay đổi quan
              trọng.
              <br />
              <strong>Lần cập nhật cuối:</strong> 15/08/2024
            </Paragraph>
          </div>
        </Modal>

        {/* Custom CSS */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes bounceIn {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </GoogleOAuthProvider>
  );
}
