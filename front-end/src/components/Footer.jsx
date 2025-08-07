// front-end/src/components/Footer.jsx
import { Row, Col } from "antd";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #e6f4ea 0%, #f0fdf4 100%)", // nền xanh nhạt
        borderTop: "1px solid #a7f3d0",
        marginTop: 40,
        padding: "40px 0 16px 0",
        fontFamily: "inherit"
      }}
    >
      <div className="container mx-auto px-4">
        <Row gutter={[32, 24]} justify="space-between" align="top">
          {/* Logo & Slogan */}
          <Col xs={24} md={8}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <img
                src="/image/BanHuong.png"
                alt="Bản Hương"
                width={100}
                height={100}
              />
              <span
  style={{
    fontWeight: 800,
    fontSize: 22,
    background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "0 1px 2px rgba(0,0,0,0.15)" // <-- giúp tăng độ tương phản
  }}
>
  Bản Hương
</span>

            </div>
            <div style={{ color: "#166534", fontWeight: 500, fontSize: 15 }}>
              Tinh dầu thiên nhiên – Sống xanh, thư giãn, an toàn.
            </div>
          </Col>

          {/* Thông tin liên hệ */}
          <Col xs={24} md={8}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "#166534" }}>Liên hệ</div>
            <div style={{ color: "#444", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Mail size={16} /> banhuong@gmail.com
            </div>
            <div style={{ color: "#444", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Phone size={16} /> 0123 456 789
            </div>
            <div style={{ color: "#444", display: "flex", alignItems: "center", gap: 8 }}>
              Địa chỉ: Xã Hòa Lạc, thành phố Hà Nội
            </div>
          </Col>

          {/* Mạng xã hội */}
          <Col xs={24} md={8}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "#166534" }}>Kết nối với chúng tôi</div>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: "#4267B2" }}>
                <Facebook size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: "#E1306C" }}>
                <Instagram size={24} />
              </a>
            </div>
          </Col>
        </Row>
        <div
          style={{
            borderTop: "1px solid #fcd9c1",
            marginTop: 32,
            paddingTop: 12,
            textAlign: "center",
            color: "#b45309",
            fontSize: 14
          }}
        >
          © {new Date().getFullYear()} Bản Hương. All rights reserved.
        </div>
      </div>
    </footer>
  );
}