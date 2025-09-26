import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Dropdown, Row, Col, Badge, Avatar, notification, Drawer, Divider } from "antd";
import { 
  DownOutlined, 
  SearchOutlined, 
  ShoppingCartOutlined, 
  LogoutOutlined, 
  UserOutlined,
  SettingOutlined,
  ShoppingOutlined,
  HeartOutlined,
  BellOutlined,
  GiftOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { Bell, HelpCircle, Globe, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import "../i18n";
import { useTranslation } from "react-i18next";

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const { t, i18n } = useTranslation();

  // Xử lý token Google trên URL (chỉ chạy 1 lần khi load)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      window.history.replaceState({}, document.title, window.location.pathname);
      fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.user) {
            localStorage.removeItem("user_data");
            setUser(null);
            return;
          }
          const userData = {
            ...data.user,
            avatar:
              data.user.avatarImg ||
              data.user.avatar ||
              data.user.picture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                data.user.name || data.user.username || "User"
              )}&background=166534&color=fff`,
            displayName:
              data.user.name ||
              data.user.username ||
              (data.user.email ? data.user.email.split("@")[0] : "User"),
          };
          localStorage.setItem("user_data", JSON.stringify(userData));
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("user_data");
          setUser(null);
        });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kiểm tra authentication status
  useEffect(() => {
    checkAuthStatus();
    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuthStatus = () => {
    try {
      // Check multiple token sources
      const googleToken = localStorage.getItem("google_token");
      const userData = localStorage.getItem("user_data");
      
      if (googleToken && userData) {
        const user = JSON.parse(userData);
        setUser({
          ...user,
          // Ensure avatar URL is available
          avatar: user.picture || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'User')}&background=166534&color=fff`,
          displayName: user.name || user.username || user.email?.split('@')[0] || 'User'
        });
        
        // Load cart count if user is authenticated
        loadCartCount();
      } else {
        setUser(null);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    }
  };

  const loadCartCount = () => {
    // TODO: Load cart count from API or localStorage
    const savedCartCount = localStorage.getItem("cart_count") || "0";
    setCartCount(parseInt(savedCartCount));
  };

  const handleLogout = async () => {
    try {
      // Call logout API if available
      // await authService.logout();
      
      // Clear all auth data
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("google_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("cart_count");
      
      setUser(null);
      setCartCount(0);
      
      notification.success({
        message: 'Đăng xuất thành công',
        description: 'Hẹn gặp lại bạn!',
        placement: 'topRight',
        duration: 3,
      });
      
      // Redirect to home if on protected page
      if (window.location.pathname.includes('/profile') || 
          window.location.pathname.includes('/orders') ||
          window.location.pathname.includes('/dashboard')) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.clear();
      setUser(null);
      setCartCount(0);
      window.location.reload();
    }
  };

  const handleLanguageChange = ({ key }) => {
    i18n.changeLanguage(key);
    localStorage.setItem("lang", key); // Lưu lại lựa chọn
  };

  const handleHeaderSearch = (value) => {
    if (value && value.trim() !== "") {
      navigate(`/products?q=${encodeURIComponent(value.trim())}`);
      setDrawerOpen(false); // đóng drawer nếu đang ở mobile
    }
  };

  const languageMenuItems = [
    { 
      key: "vi", 
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
          <span style={{ fontSize: 16 }}>🇻🇳</span>
          <span>Tiếng Việt</span>
        </div>
      )
    },
    { 
      key: "en", 
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
          <span style={{ fontSize: 16 }}>🇺🇸</span>
          <span>English</span>
        </div>
      )
    },
  ];

  const userMenuItems = user ? [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar 
              src={user.avatar} 
              size={40} 
              icon={<UserOutlined />}
              style={{ border: '2px solid #f0f0f0' }}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#262626', marginBottom: 2 }}>
                {user.displayName}
              </div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                {user.email}
              </div>
              {user.email_verified && (
                <div style={{ fontSize: 11, color: '#52c41a', marginTop: 2 }}>
                  ✓ Đã xác minh
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      disabled: true
    },
    {
      key: 'profile',
      label: t("profile"),
      icon: <UserOutlined />,
      onClick: () => window.location.href = '/profile'
    },
    {
      key: 'orders',
      label: t("myOrders"),
      icon: <ShoppingOutlined />,
      onClick: () => window.location.href = '/orders'
    },
    {
      key: 'wishlist',
      label: t("wishlist"),
      icon: <HeartOutlined />,
      onClick: () => window.location.href = '/wishlist'
    },
    {
      key: 'notifications',
      label: t("notifications"),
      icon: <BellOutlined />,
      onClick: () => window.location.href = '/notifications'
    },
    {
      type: 'divider'
    },
    {
      key: 'rewards',
      label: t("bonusPoints"),
      icon: <GiftOutlined />,
      onClick: () => window.location.href = '/rewards'
    },
    {
      key: 'settings',
      label: t("settings"),
      icon: <SettingOutlined />,
      onClick: () => window.location.href = '/settings'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: t("logout"),
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      style: { color: '#ff4d4f' }
    },
  ] : [];

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, []);

  // Responsive: detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Drawer content for mobile
  const drawerMenu = (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <Link to="/" onClick={() => setDrawerOpen(false)}>
          <img src="/image/BanHuong.png" alt="Logo" width={40} style={{ borderRadius: 8 }} />
          <div style={{ fontWeight: 800, fontSize: 24, marginTop: 8, color: "#166534" }}>Bản Hương</div>
        </Link>
      </div>
      <Divider />
      {/* XÓA phần Input tìm kiếm ở đây */}
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Dropdown menu={{ items: languageMenuItems, onClick: handleLanguageChange }} trigger={['click']} placement="bottomLeft">
          <Button icon={<Globe size={18} />} block>
            {i18n.language === "en" ? "EN" : "VI"} <DownOutlined />
          </Button>
        </Dropdown>
        <Link to="/cart" onClick={() => setDrawerOpen(false)}>
          <Button icon={<ShoppingCartOutlined />} block>
            {t("cart")} <Badge count={cartCount} style={{ backgroundColor: "#166534", marginLeft: 8 }} />
          </Button>
        </Link>
        {user && (
          <>
            <Button icon={<UserOutlined />} block onClick={() => { setDrawerOpen(false); window.location.href = '/profile'; }}>
              {t("profile")}
            </Button>
            <Button icon={<ShoppingOutlined />} block onClick={() => { setDrawerOpen(false); window.location.href = '/orders'; }}>
              {t("myOrders")}
            </Button>
            <Button icon={<HeartOutlined />} block onClick={() => { setDrawerOpen(false); window.location.href = '/wishlist'; }}>
              {t("wishlist")}
            </Button>
            <Button icon={<BellOutlined />} block onClick={() => { setDrawerOpen(false); window.location.href = '/notifications'; }}>
              {t("notifications")}
            </Button>
            <Button icon={<GiftOutlined />} block onClick={() => { setDrawerOpen(false); window.location.href = '/rewards'; }}>
              {t("bonusPoints")}
            </Button>
            <Button icon={<SettingOutlined />} block onClick={() => { setDrawerOpen(false); window.location.href = '/settings'; }}>
              {t("settings")}
            </Button>
            <Button icon={<LogoutOutlined />} block danger onClick={() => { setDrawerOpen(false); handleLogout(); }}>
              {t("logout")}
            </Button>
          </>
        )}
        {!user && (
          <Link to="/login" onClick={() => setDrawerOpen(false)}>
            <Button type="primary" block>
              {t("login")}
            </Button>
          </Link>
        )}
      </div>
      <Divider />
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <a href="#" style={{ color: "#4267B2" }}><Facebook size={20} /></a>
        <a href="#" style={{ color: "#E1306C" }}><Instagram size={20} /></a>
        <Button type="text" icon={<HelpCircle size={20} />} onClick={() => { setDrawerOpen(false); window.location.href = '/help'; }} />
      </div>
    </div>
  );

  return (
    <header 
      style={{ 
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(230,244,234,0.95) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(22,101,52,0.1)",
        boxShadow: isScrolled 
          ? "0 2px 20px rgba(22,101,52,0.12)" 
          : "0 2px 20px rgba(22,101,52,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "all 0.3s ease"
      }}
    >
      <div className={`container mx-auto px-4 transition-all duration-300 ease-out ${isScrolled ? "py-2" : "py-8"}`}>
        <Row justify="space-between" align="middle">
          {/* Logo */}
          <Col>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: isScrolled ? 8 : 20, textDecoration: "none" }}>
              <img 
                src="/image/BanHuong.png" 
                alt="Logo" 
                width={isScrolled ? 24 : 40} 
                height={isScrolled ? 24 : 40} 
                style={{ 
                  borderRadius: 6,
                  transition: "all 0.3s ease",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }} 
              />
              <div>
                <span style={{
                  fontWeight: 800,
                  fontSize: isScrolled ? 22 : 32,
                  background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.025em",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  transition: "font-size 0.3s ease"
                }}>Bản Hương</span>
                <div style={{ 
                  fontSize: isScrolled ? 10 : 14, 
                  color: "#9ca3af", 
                  fontWeight: 500, 
                  marginTop: -2,
                  transition: "font-size 0.3s ease"
                }}>
                  Essential Oils
                </div>
              </div>
            </Link>
          </Col>

          {/* Hamburger for mobile */}
          {isMobile ? (
            <Col>
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: 28, color: "#166534" }} />}
                onClick={() => setDrawerOpen(true)}
                style={{
                  borderRadius: 12,
                  height: 44,
                  width: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              />
              <Drawer
                title={null}
                placement="right"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                width={300}
                bodyStyle={{ padding: 0, background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)" }}
                closeIcon={null}
              >
                {drawerMenu}
              </Drawer>
            </Col>
          ) : (
            // Desktop full menu
            <Col flex="auto">
              {/* XÓA toàn bộ phần Input tìm kiếm ở đây */}
            </Col>
          )}

          {/* Actions */}
          {!isMobile && (
            <Col>
              <Row align="middle" gutter={isScrolled ? 4 : 8}>
                {/* Language */}
                <Col>
                  <Dropdown 
                    menu={{ 
                      items: languageMenuItems, 
                      onClick: handleLanguageChange 
                    }} 
                    trigger={['click']} 
                    placement="bottomRight"
                  >
                    <Button 
                      type="text" 
                      icon={<Globe size={isScrolled ? 16 : 18} />} 
                      style={{ 
                        color: "#166534", 
                        borderRadius: 12, 
                        height: isScrolled ? 32 : 40, 
                        fontWeight: 500,
                        transition: "all 0.2s ease"
                      }}
                      className="hover-scale"
                    >
                      {!isScrolled && (i18n.language === "en" ? "EN" : "VI")} <DownOutlined style={{ fontSize: isScrolled ? 10 : 12 }} />
                    </Button>
                  </Dropdown>
                </Col>
                {/* Cart */}
                <Col>
                  <Link to="/cart">
                    <Badge 
                      count={cartCount} 
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
                          transition: "all 0.2s ease"
                        }}
                        className="hover-scale"
                      />
                    </Badge>
                  </Link>
                </Col>
                {/* Thêm nút Wishlist vào đây */}
                <Col>
                  <Link to="/wishlist">
                    <Button
                      type="text"
                      icon={<HeartOutlined style={{ fontSize: isScrolled ? 16 : 20, color: "#dc2626" }} />}
                      style={{
                        borderRadius: 12,
                        height: isScrolled ? 32 : 40,
                        width: isScrolled ? 32 : 40,
                        transition: "all 0.2s ease"
                      }}
                      className="hover-scale"
                    />
                  </Link>
                </Col>
                {/* Notifications / Help / Social - Only show when not scrolled */}
                {!isScrolled && (
                  <>
                    {user && (
                      <Col>
                        <Badge dot={false} size="small">
                          <Button 
                            type="text" 
                            icon={<Bell size={18} />} 
                            style={{ 
                              color: "#6b7280", 
                              borderRadius: 12, 
                              height: 40, 
                              width: 40 
                            }}
                            className="hover-scale"
                            onClick={() => window.location.href = '/notifications'}
                          />
                        </Badge>
                      </Col>
                    )}
                    <Col>
                      <Button 
                        type="text" 
                        icon={<HelpCircle size={18} />} 
                        style={{ 
                          color: "#6b7280", 
                          borderRadius: 12, 
                          height: 40, 
                          width: 40 
                        }}
                        className="hover-scale"
                        onClick={() => window.location.href = '/help'}
                      />
                    </Col>
                    <Col>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Link 
                          to="#" 
                          style={{ 
                            color: "#4267B2", 
                            padding: 8, 
                            borderRadius: 10, 
                            display: "flex",
                            transition: "transform 0.2s ease"
                          }}
                          className="hover-scale"
                        >
                          <Facebook size={18} />
                        </Link>
                        <Link 
                          to="#" 
                          style={{ 
                            color: "#E1306C", 
                            padding: 8, 
                            borderRadius: 10, 
                            display: "flex",
                            transition: "transform 0.2s ease"
                          }}
                          className="hover-scale"
                        >
                          <Instagram size={18} />
                        </Link>
                      </div>
                    </Col>
                  </>
                )}
                {/* Auth / User */}
                <Col>
                  {user ? (
                    <Dropdown 
                      menu={{ items: userMenuItems }} 
                      placement="bottomRight" 
                      trigger={['click']}
                      overlayStyle={{ marginTop: 8 }}
                    >
                      <Button 
                        type="text" 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: isScrolled ? 6 : 8,
                          height: isScrolled ? 32 : 40,
                          padding: isScrolled ? "0 8px" : "0 12px",
                          borderRadius: 12,
                          background: "rgba(22,101,52,0.05)",
                          border: "1px solid rgba(22,101,52,0.1)",
                          transition: "all 0.2s ease"
                        }}
                        className="hover-scale"
                      >
                        <Avatar 
                          src={user.avatar} 
                          size={isScrolled ? 24 : 32} 
                          icon={<UserOutlined />}
                          style={{ 
                            border: "2px solid #fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                          }}
                        />
                        {!isScrolled && (
                          <span style={{ 
                            fontWeight: 500,
                            color: "#166534",
                            maxWidth: 100,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {user.displayName}
                          </span>
                        )}
                        <DownOutlined style={{ 
                          fontSize: isScrolled ? 10 : 12,
                          color: "#166534"
                        }} />
                      </Button>
                    </Dropdown>
                  ) : (
                    <div style={{ display: "flex", gap: isScrolled ? 8 : 12, alignItems: "center" }}>
                      <Link 
                        to="/login" 
                        style={{
                          color: "#fff",
                          fontWeight: 600,
                          textDecoration: "none",
                          padding: isScrolled ? "6px 12px" : "8px 18px",
                          borderRadius: 12,
                          background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                          boxShadow: "0 2px 12px rgba(22,101,52,0.3)",
                          transition: "all 0.2s ease"
                        }}
                        className="hover-scale"
                      >
                        {t("login")}
                      </Link>
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </div>

      {/* Enhanced CSS */}
      <style>
        {`
          .hover-scale {
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
          }
          .hover-scale:hover { 
            transform: scale(1.05); 
            box-shadow: 0 4px 16px rgba(22,101,52,0.2) !important;
          }
          .search-input:hover, 
          .search-input:focus, 
          .search-input.ant-input-focused {
            border-color: #166534 !important; 
            box-shadow: 0 4px 24px rgba(22,101,52,0.15) !important; 
          }
          .ant-dropdown-menu {
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
            border: 1px solid rgba(22,101,52,0.1) !important;
          }
          .ant-dropdown-menu-item {
            border-radius: 8px !important;
            margin: 2px 4px !important;
            transition: all 0.2s ease !important;
          }
          .ant-dropdown-menu-item:hover {
            background: rgba(22,101,52,0.05) !important;
          }
          .ant-badge-count {
            font-size: 10px !important;
            height: 18px !important;
            min-width: 18px !important;
            line-height: 18px !important;
          }
        `}
      </style>
    </header>
  );
}