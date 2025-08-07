import { Link } from "react-router-dom";
import { Input, Button, Dropdown, Menu, Row, Col, Badge } from "antd";
import { DownOutlined, SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Bell, HelpCircle, Globe, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const languageMenu = (
    <Menu
      style={{
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: 'none',
        padding: '4px 0'
      }}
    >
      <Menu.Item 
        key="vn" 
        style={{ borderRadius: 8, margin: '4px 8px', fontWeight: 500 }}
      >
        🇻🇳 Tiếng Việt
      </Menu.Item>
      <Menu.Item 
        key="en" 
        style={{ borderRadius: 8, margin: '4px 8px', fontWeight: 500 }}
      >
        🇺🇸 English
      </Menu.Item>
    </Menu>
  );

  return (
    <header 
      style={{ 
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(230,244,234,0.95) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(22,101,52,0.1)",
        boxShadow: "0 2px 20px rgba(22,101,52,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}
    >
      <div className={`container mx-auto px-4 transition-all duration-300 ease-out ${
        isScrolled ? 'py-2' : 'py-8'
      }`}>
        <Row justify="space-between" align="middle">
          {/* Logo Section */}
          <Col>
            <Link 
              to="/" 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: isScrolled ? 8 : 20,
                textDecoration: "none",
                transition: "all 0.3s ease"
              }}
              className="hover-scale"
            >
              <div>
                <img 
                  src="/image/BanHuong.png" 
                  alt="Logo" 
                  width={isScrolled ? 24 : 40} 
                  height={isScrolled ? 24 : 40}
                  style={{ borderRadius: 6, transition: "all 0.3s" }}
                />
              </div>
              <div>
              <span 
  style={{ 
    fontWeight: 800, 
    fontSize: isScrolled ? 22 : 32, 
    background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.025em",
    transition: "all 0.3s",
    textShadow: "0 1px 2px rgba(0,0,0,0.2)" // <-- để tách chữ khỏi nền
  }}
>
  Bản Hương
</span>

                <div 
                  style={{ 
                    fontSize: isScrolled ? 10 : 14, 
                    color: "#9ca3af", 
                    fontWeight: 500,
                    marginTop: -2,
                    transition: "all 0.3s"
                  }}
                >
                  Essential Oils
                </div>
              </div>
            </Link>
          </Col>

          {/* Search Section */}
          <Col flex="auto">
            <div className="search-container">
              <Input
                size="large"
                placeholder="Tìm kiếm tinh dầu, hương liệu..."
                style={{ 
                  borderRadius: isScrolled ? 12 : 24, 
                  maxWidth: 520, 
                  margin: isScrolled ? "0 20px" : "0 32px",
                  border: "2px solid transparent",
                  background: "rgba(255,255,255,0.8)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  fontSize: isScrolled ? 15 : 18,
                  height: isScrolled ? 40 : 56,
                  transition: "all 0.3s"
                }}
                suffix={
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    style={{
                      border: "none",
                      background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                      borderRadius: 10,
                      height: isScrolled ? 28 : 40,
                      width: isScrolled ? 28 : 40,
                      boxShadow: "0 2px 8px rgba(22,101,52,0.3)",
                      transition: "all 0.3s"
                    }}
                  />
                }
                className="search-input"
              />
            </div>
          </Col>

          {/* Actions Section */}
          <Col>
            <Row align="middle" gutter={isScrolled ? 4 : 8}>
              {/* Language Dropdown */}
              <Col>
                <Dropdown overlay={languageMenu} trigger={['click']} placement="bottomRight">
                  <Button 
                    type="text" 
                    icon={<Globe size={isScrolled ? 16 : 18} />} 
                    style={{ 
                      color: "#166534",
                      borderRadius: 12,
                      height: isScrolled ? 32 : 40,
                      fontWeight: 500,
                      transition: "all 0.3s",
                      fontSize: isScrolled ? 12 : 14
                    }}
                    className="header-button"
                  >
                    {isScrolled ? "" : "VI"} <DownOutlined style={{ fontSize: isScrolled ? 10 : 12 }} />
                  </Button>
                </Dropdown>
              </Col>

              {/* Shopping Cart */}
              <Col>
                <Badge 
                  count={2} 
                  size="small"
                  style={{
                    backgroundColor: "#166534",
                    boxShadow: "0 2px 8px rgba(22,101,52,0.4)"
                  }}
                >
                  <Button 
                    type="text" 
                    icon={<ShoppingCartOutlined style={{ fontSize: isScrolled ? 16 : 20 }} />}
                    style={{
                      color: "#166534",
                      borderRadius: 12,
                      height: isScrolled ? 32 : 40,
                      width: isScrolled ? 32 : 40,
                      transition: "all 0.3s"
                    }}
                    className="header-button"
                  />
                </Badge>
              </Col>

              {/* Notifications */}
              {!isScrolled && (
                <Col>
                  <Button 
                    type="text" 
                    icon={<Bell size={18} />}
                    style={{
                      color: "#6b7280",
                      borderRadius: 12,
                      height: 40,
                      width: 40,
                      transition: "all 0.3s ease"
                    }}
                    className="header-button"
                  />
                </Col>
              )}

              {/* Help */}
              {!isScrolled && (
                <Col>
                  <Button 
                    type="text" 
                    icon={<HelpCircle size={18} />}
                    style={{
                      color: "#6b7280",
                      borderRadius: 12,
                      height: 40,
                      width: 40,
                      transition: "all 0.3s ease"
                    }}
                    className="header-button"
                  />
                </Col>
              )}

              {/* Social Links */}
              {!isScrolled && (
                <Col>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Link 
                      to="#" 
                      style={{ 
                        color: "#4267B2",
                        padding: 8,
                        borderRadius: 10,
                        transition: "all 0.3s ease",
                        display: "flex"
                      }}
                      className="social-link"
                    >
                      <Facebook size={18} />
                    </Link>
                    <Link 
                      to="#" 
                      style={{ 
                        color: "#E1306C",
                        padding: 8,
                        borderRadius: 10,
                        transition: "all 0.3s ease",
                        display: "flex"
                      }}
                      className="social-link"
                    >
                      <Instagram size={18} />
                    </Link>
                  </div>
                </Col>
              )}

              {/* Auth Links */}
              <Col>
                <div style={{ display: "flex", gap: isScrolled ? 8 : 12, alignItems: "center" }}>
                  {!isScrolled && (
                    <Link 
                      to="#" 
                      style={{ 
                        color: "#6b7280",
                        fontWeight: 500,
                        textDecoration: "none",
                        padding: "8px 16px",
                        borderRadius: 10,
                        transition: "all 0.3s ease",
                        fontSize: 14
                      }}
                      className="auth-link"
                    >
                      Đăng Ký
                    </Link>
                  )}
                  <Link 
                    to="#" 
                    style={{ 
                      color: "#fff",
                      fontWeight: 600,
                      textDecoration: "none",
                      padding: isScrolled ? "6px 12px" : "8px 18px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                      boxShadow: "0 3px 12px rgba(22,101,52,0.3)",
                      transition: "all 0.3s",
                      fontSize: isScrolled ? 12 : 14
                    }}
                    className="login-button"
                  >
                    {isScrolled ? "Login" : "Đăng Nhập"}
                  </Link>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.02);
        }
        
        .search-input:hover, .search-input:focus {
          border-color: #166534 !important;
          box-shadow: 0 4px 24px rgba(22,101,52,0.15) !important;
        }
        
        .header-button:hover {
          background: rgba(22,101,52,0.1) !important;
          transform: translateY(-1px);
          color: #166534 !important;
        }
        
        .social-link:hover {
          background: rgba(0,0,0,0.05);
          transform: translateY(-1px);
        }
        
        .auth-link:hover {
          background: rgba(22,101,52,0.1);
          color: #166534 !important;
        }
        
        .login-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22,101,52,0.4) !important;
        }
        
        .search-container {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </header>
  );
}