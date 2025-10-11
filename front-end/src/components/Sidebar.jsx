import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm dòng này
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Space,
  Dropdown,
  Button,
  Tooltip,
  Drawer,
} from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  GiftOutlined,
  LogoutOutlined,
  EditOutlined,
  KeyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RedoOutlined,
  FormOutlined,
  HighlightOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Title, Text } = Typography;

const menuItems = [
  // {
  //   key: "dashboard",
  //   icon: <DashboardOutlined />,
  //   label: "Tổng quan",
  //   path: "/admin",
  // },
  {
    key: "orders",
    icon: <ShoppingOutlined />,
    label: "Đơn hàng",
    path: "/admin/orders",
  },
  {
    key: "products",
    icon: <AppstoreOutlined />,
    label: "Sản phẩm",
    path: "/admin/products",
  },
  {
    key: "users",
    icon: <TeamOutlined />,
    label: "Người dùng",
    path: "/admin/users",
  },
  {
    key: "feedback",
    icon: <RedoOutlined />,
    label: "Feedback",
    path: "/admin/feedback",
  },
  {
    key: "analytics",
    icon: <BarChartOutlined />,
    label: "Thống kê",
    path: "/admin/analytics",
  },
  {
    key: "marketing",
    icon: <GiftOutlined />,
    label: "Khuyến mãi",
    path: "/admin/marketing",
  },
  {
    key: "posts",
    icon: <HighlightOutlined />,
    label: "Bài viết",
    path: "/admin/posts",
  },
  {
    key: "email-subscribers",
    icon: <FormOutlined />,
    label: "Email đăng kí uu đãi",
    path: "/admin/email-subscribers",
  },
  {
    key: "question-answers",
    icon: <FormOutlined />,
    label: "Câu hỏi thường gặp",
    path: "/admin/faqs",
  },
  // {
  //   key: "settings",
  //   icon: <SettingOutlined />,
  //   label: "Cài đặt",
  //   path: "/admin/settings",
  // },
];

export default function AdminSidebar({
  collapsed,
  onCollapse,
  selectedKey = "dashboard",
  onMenuSelect,
}) {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate(); // Thêm dòng này

  useEffect(() => {
    // Responsive: auto hide sidebar on mobile
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Lấy user từ localStorage
    const userData = localStorage.getItem("user_data");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  const profileMenuItems = [
    // {
    //   key: "edit-profile",
    //   icon: <EditOutlined />,
    //   label: "Chỉnh sửa thông tin",
    //   onClick: () => (window.location.href = "/profile/edit"),
    // },
    // {
    //   key: "change-password",
    //   icon: <KeyOutlined />,
    //   label: "Đổi mật khẩu",
    //   onClick: () => (window.location.href = "/profile/change-password"),
    // },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const sidebarContent = (
    <>
      <div
        style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(255,255,255,0.07)",
          borderBottom: "1px solid #14532d22",
        }}
      >
        <img
          src="/image/BanHuong.png"
          alt="Bản Hương"
          style={{ width: 38, height: 38, borderRadius: 10 }}
        />
        {!collapsed && (
          <Title
            level={4}
            style={{
              margin: 0,
              color: "#fff",
              fontWeight: 800,
              letterSpacing: 1,
              fontSize: 22,
              background: "linear-gradient(135deg, #fff 0%, #a7f3d0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Bản Hương
          </Title>
        )}
      </div>
      {user && (
        <div
          style={{
            padding: collapsed ? "16px 0" : "16px",
            textAlign: collapsed ? "center" : "left",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid #14532d22",
          }}
        >
          <Dropdown
            menu={{ items: profileMenuItems }}
            trigger={["click"]}
            arrow
          >
            <Space
              align="center"
              style={{
                cursor: "pointer",
                width: "100%",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <Avatar size={48} src={user.avatar} icon={<UserOutlined />} />
              {!collapsed && (
                <div>
                  <Text
                    style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}
                  >
                    {user.displayName}
                  </Text>
                  <div style={{ color: "#a7f3d0", fontSize: 13 }}>
                    {user.role || "User"}
                  </div>
                </div>
              )}
            </Space>
          </Dropdown>
        </div>
      )}
      <Menu
        mode="inline"
        selectedKeys={[]}
        onClick={({ key }) => {
          const item = menuItems.find((i) => i.key === key);
          if (item && item.path) {
            navigate(item.path);
          }
          onMenuSelect?.(key);
        }}
        items={menuItems}
        style={{
          background: "transparent",
          border: "none",
          marginTop: 8,
          fontWeight: 600,
        }}
        theme="dark"
        inlineIndent={20}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: collapsed ? 8 : 16,
          background: "rgba(255,255,255,0.04)",
          borderTop: "1px solid #14532d22",
          textAlign: collapsed ? "center" : "right",
        }}
      >
        <Tooltip title={collapsed ? "Mở rộng" : "Thu gọn"}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse?.(!collapsed)}
            style={{
              color: "#fff",
              fontSize: 20,
              borderRadius: 8,
              background: "rgba(22,101,52,0.15)",
            }}
          />
        </Tooltip>
      </div>
    </>
  );

  // Drawer for mobile
  if (isMobile) {
    return (
      <>
        <Button
          type="primary"
          icon={<MenuUnfoldOutlined />}
          style={{
            position: "fixed",
            top: 18,
            left: 18,
            zIndex: 1100,
            borderRadius: 8,
            background: "#166534",
            border: "none",
          }}
          onClick={() => setDrawerOpen(true)}
        />
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={240}
          bodyStyle={{
            padding: 0,
            background: "linear-gradient(180deg, #166534 0%, #15803d 100%)",
          }}
          closable={false}
        >
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  // Sider for desktop
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        background: "linear-gradient(180deg, #166534 0%, #15803d 100%)",
        boxShadow: "4px 0 20px rgba(22,101,52,0.10)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {sidebarContent}
    </Sider>
  );
}
