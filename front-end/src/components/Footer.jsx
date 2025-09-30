import { Row, Col, Divider, Input, Button } from "antd";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";
import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      alert("⚠️ Vui lòng nhập email");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/subscribers`, { email });
      alert(
        "🎉 Cảm ơn bạn đã quan tâm! Bạn đã đăng ký nhận ưu đãi thành công."
      );
      setEmail("");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("❌ Email đã tồn tại, vui lòng dùng email khác.");
      } else {
        alert("🚨 Có lỗi xảy ra, vui lòng thử lại sau.");
      }
      console.error("❌ Lỗi subscribe:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 100%)",
        borderTop: "1px solid #a7f3d0",
        marginTop: 40,
        padding: "48px 0 16px 0",
        fontFamily: "inherit",
        boxShadow: "0 -2px 24px rgba(22,101,52,0.06)",
      }}
    >
      <div className="container mx-auto px-4">
        <Row gutter={[32, 32]} justify="space-between" align="top">
          {/* Logo & Slogan */}
          <Col xs={24} md={8}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <img
                src="/image/BanHuong.png"
                alt="Bản Hương"
                width={70}
                height={70}
                style={{
                  borderRadius: 16,
                  boxShadow: "0 2px 8px rgba(22,101,52,0.10)",
                }}
              />
              <div>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 24,
                    background:
                      "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "0 1px 2px rgba(0,0,0,0.12)",
                  }}
                >
                  Bản Hương
                </span>
                <div
                  style={{
                    color: "#166534",
                    fontWeight: 500,
                    fontSize: 15,
                    marginTop: 2,
                  }}
                >
                  Tinh dầu thiên nhiên – Sống xanh, thư giãn, an toàn.
                </div>
              </div>
            </div>
          </Col>

          {/* Thông tin liên hệ */}
          <Col xs={24} md={8}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 10,
                color: "#166534",
                fontSize: 17,
              }}
            >
              Liên hệ
            </div>
            <div
              style={{
                color: "#444",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Mail size={18} />{" "}
              <a href="mailto:banhuong@gmail.com" style={{ color: "#444" }}>
                banhuong@gmail.com
              </a>
            </div>
            <div
              style={{
                color: "#444",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Phone size={18} />{" "}
              <a href="tel:0123456789" style={{ color: "#444" }}>
                0123 456 789
              </a>
            </div>
            <div
              style={{
                color: "#444",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <MapPin size={18} /> Xã Hòa Lạc, thành phố Hà Nội
            </div>
          </Col>

          {/* Đăng ký email */}
          <Col xs={24} md={8}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 10,
                color: "#166534",
                fontSize: 17,
              }}
            >
              Nhận thông tin ưu đãi
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Input
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="primary"
                loading={loading}
                onClick={handleSubscribe}
              >
                Đăng ký
              </Button>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "32px 0 12px 0", borderColor: "#a7f3d0" }} />
        <div
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: 15,
            letterSpacing: 0.2,
          }}
        >
          © {new Date().getFullYear()}{" "}
          <span style={{ fontWeight: 700, color: "#166534" }}>Bản Hương</span>.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
}
