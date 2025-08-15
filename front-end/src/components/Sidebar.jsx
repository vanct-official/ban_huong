import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Avatar, 
  Typography, 
  Badge, 
  Button,
  Space,
  Tooltip,
  Dropdown,
  Modal,
  Form,
  Input,
  Switch,
  Select,
  message,
  notification
} from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  GiftOutlined,
  PieChartOutlined,
  LineChartOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  KeyOutlined,
  SunOutlined,
  MoonOutlined,
  TranslationOutlined,
  CheckCircleOutlined,
  DownOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title, Text } = Typography;

const AdminSidebar = ({ collapsed, onCollapse, selectedKey = 'dashboard', onMenuSelect }) => {
  const [openKeys, setOpenKeys] = useState(['products', 'users', 'orders', 'analytics']);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserFromToken(token);
    }
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchUserFromToken = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.user) {
        localStorage.removeItem("user_data");
        setUser(null);
        return;
      }
      const userData = {
        ...data.user,
        avatar: data.user.avatarImg || data.user.avatar || data.user.picture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.user.name || data.user.username || "User"
                )}&background=166534&color=fff`,
        displayName: data.user.name || data.user.username || 
                     (data.user.email ? data.user.email.split("@")[0] : "User"),
      };
      localStorage.setItem("user_data", JSON.stringify(userData));
      localStorage.setItem("google_token", token);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user from token:', error);
      localStorage.removeItem("user_data");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = () => {
    setIsLoading(true);
    try {
      const googleToken = localStorage.getItem("google_token");
      const userData = localStorage.getItem("user_data");
      if (googleToken && userData) {
        const user = JSON.parse(userData);
        setUser({
          ...user,
          avatar: user.picture || user.avatar || user.avatarImg ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || user.username || 'User'
                  )}&background=166534&color=fff`,
          displayName: user.name || user.username || user.email?.split('@')[0] || 'User',
          role: user.role || 'User',
          status: 'online',
          lastLogin: new Date().toLocaleString('vi-VN'),
          email_verified: user.email_verified || false
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    notification.success({
      message: 'Đăng xuất thành công',
      description: 'Hẹn gặp lại bạn!',
      placement: 'topRight',
      duration: 3,
    });
    if (window.location.pathname.includes('/profile') || 
        window.location.pathname.includes('/admin') ||
        window.location.pathname.includes('/dashboard')) {
      window.location.href = '/';
    }
  };

  const profileMenuItems = [
    {
      key: 'edit-profile',
      icon: <EditOutlined />,
      label: 'Chỉnh sửa thông tin',
      onClick: () => setProfileModalVisible(true),
    },
    {
      key: 'change-password',
      icon: <KeyOutlined />,
      label: 'Đổi mật khẩu',
      onClick: () => setChangePasswordModalVisible(true),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'orders', icon: <ShoppingOutlined />, label: 'Quản lý đơn hàng' },
    { key: 'products', icon: <AppstoreOutlined />, label: 'Quản lý sản phẩm' },
    { key: 'users', icon: <TeamOutlined />, label: 'Quản lý người dùng' },
    { key: 'analytics', icon: <BarChartOutlined />, label: 'Báo cáo & Thống kê' },
    { key: 'marketing', icon: <GiftOutlined />, label: 'Marketing & Khuyến mãi' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt hệ thống' },
  ];

  const handleMenuClick = (item) => onMenuSelect?.(item.key);
  const handleSubMenuOpenChange = (openKeys) => setOpenKeys(openKeys);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={280}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        background: 'linear-gradient(180deg, #166534 0%, #15803d 100%)',
        boxShadow: '4px 0 20px rgba(22,101,52,0.15)',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <div style={{ padding: '16px', background: 'rgba(255,255,255,0.1)' }}>
        {!collapsed ? (
          <Space align="center">
            <img src="/image/BanHuong.png" alt="Bản Hương" style={{ width: 32, height: 32 }} />
            <Title level={3} style={{ margin: 0, color: 'white' }}>Bản Hương</Title>
          </Space>
        ) : (
          <img src="/image/BanHuong.png" alt="Bản Hương" style={{ width: 28, height: 28 }} />
        )}
      </div>

      {user && (
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)' }}>
          <Dropdown menu={{ items: profileMenuItems }} trigger={['click']} arrow>
            <Space align="center" style={{ cursor: 'pointer' }}>
              <Avatar size={40} src={user.avatar} icon={<UserOutlined />} />
              {!collapsed && <Text style={{ color: 'white' }}>{user.displayName}</Text>}
            </Space>
          </Dropdown>
        </div>
      )}

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleSubMenuOpenChange}
        onClick={handleMenuClick}
        items={menuItems}
        style={{ background: 'transparent', border: 'none' }}
        theme="dark"
        inlineIndent={20}
      />
    </Sider>
  );
};

export default AdminSidebar;
