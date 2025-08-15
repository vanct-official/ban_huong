import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Avatar, 
  Typography, 
  Badge, 
  Divider,
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
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  MessageOutlined,
  GiftOutlined,
  TagsOutlined,
  TruckOutlined,
  WalletOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ShopOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CrownOutlined,
  EditOutlined,
  KeyOutlined,
  SunOutlined,
  MoonOutlined,
  TranslationOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
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

  // Xử lý token Google trên URL và check auth status
  useEffect(() => {
    checkAuthStatus();
    
    // Xử lý token từ URL (giống MainHeader)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserFromToken(token);
    }

    // Listen for storage changes
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
        avatar: data.user.avatarImg || 
                data.user.avatar || 
                data.user.picture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.user.name || data.user.username || "User"
                )}&background=166534&color=fff`,
        displayName: data.user.name || 
                    data.user.username || 
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
          // Thêm các thuộc tính để tương thích với admin
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
      
      notification.success({
        message: 'Đăng xuất thành công',
        description: 'Hẹn gặp lại bạn!',
        placement: 'topRight',
        duration: 3,
      });
      
      // Redirect to home if on protected page
      if (window.location.pathname.includes('/profile') || 
          window.location.pathname.includes('/admin') ||
          window.location.pathname.includes('/dashboard')) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.clear();
      setUser(null);
      window.location.reload();
    }
  };

  const handleProfileUpdate = async (values) => {
    try {
      // TODO: Call API to update profile
      console.log('Profile update:', values);
      
      // Update local storage
      const updatedUser = { ...user, ...values };
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      message.success('Cập nhật thông tin thành công');
      setProfileModalVisible(false);
    } catch (error) {
      console.error('Profile update error:', error);
      message.error('Cập nhật thông tin thất bại');
    }
  };

  const handleChangePassword = async (values) => {
    try {
      // TODO: Call API to change password
      console.log('Change password:', values);
      message.success('Đổi mật khẩu thành công');
      setChangePasswordModalVisible(false);
    } catch (error) {
      console.error('Change password error:', error);
      message.error('Đổi mật khẩu thất bại');
    }
  };

  const profileMenuItems = [
    {
      key: 'profile-info',
      label: (
        <div style={{ padding: '8px 0', minWidth: '200px' }}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text strong style={{ fontSize: '16px' }}>{user?.displayName || 'User'}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{user?.email}</Text>
            <Badge 
              status={user?.status === 'online' ? 'success' : 'default'} 
              text={<Text style={{ fontSize: '11px' }}>
                {user?.status === 'online' ? 'Đang hoạt động' : 'Offline'}
              </Text>} 
            />
            {user?.email_verified && (
              <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                ✓ Đã xác minh
              </Text>
            )}
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Đăng nhập lần cuối: {user?.lastLogin || 'N/A'}
            </Text>
          </Space>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
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
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'Đơn hàng của tôi',
      onClick: () => window.location.href = '/orders'
    },
    {
      key: 'wishlist',
      icon: <HeartOutlined />,
      label: 'Danh sách yêu thích',
      onClick: () => window.location.href = '/wishlist'
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Thông báo',
      onClick: () => window.location.href = '/notifications'
    },
    {
      key: 'dark-mode',
      icon: darkMode ? <SunOutlined /> : <MoonOutlined />,
      label: (
        <Space>
          <span>{darkMode ? 'Chế độ sáng' : 'Chế độ tối'}</span>
          <Switch 
            size="small" 
            checked={darkMode} 
            onChange={setDarkMode}
          />
        </Space>
      ),
    },
    {
      key: 'language',
      icon: <TranslationOutlined />,
      label: 'Ngôn ngữ',
      children: [
        { key: 'vi', label: '🇻🇳 Tiếng Việt' },
        { key: 'en', label: '🇺🇸 English' },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'activity-log',
      icon: <CheckCircleOutlined />,
      label: 'Lịch sử hoạt động',
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'Hỗ trợ',
    },
    {
      type: 'divider',
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
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'Quản lý đơn hàng',
      children: [
        {
          key: 'orders-all',
          label: 'Tất cả đơn hàng',
        },
        {
          key: 'orders-pending',
          label: (
            <Space>
              <span>Chờ xử lý</span>
              <Badge count={12} size="small" />
            </Space>
          ),
        },
        {
          key: 'orders-processing',
          label: (
            <Space>
              <span>Đang xử lý</span>
              <Badge count={8} size="small" />
            </Space>
          ),
        },
        {
          key: 'orders-shipping',
          label: 'Đang giao hàng',
        },
        {
          key: 'orders-completed',
          label: 'Hoàn thành',
        },
        {
          key: 'orders-cancelled',
          label: 'Đã hủy',
        },
      ],
    },
    {
      key: 'products',
      icon: <AppstoreOutlined />,
      label: 'Quản lý sản phẩm',
      children: [
        {
          key: 'products-all',
          label: 'Tất cả sản phẩm',
        },
        {
          key: 'products-add',
          label: 'Thêm sản phẩm',
        },
        {
          key: 'products-categories',
          label: 'Danh mục sản phẩm',
        },
        {
          key: 'products-inventory',
          label: 'Quản lý kho',
        },
        {
          key: 'products-reviews',
          label: (
            <Space>
              <span>Đánh giá sản phẩm</span>
              <Badge count={5} size="small" />
            </Space>
          ),
        },
      ],
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Quản lý người dùng',
      children: [
        {
          key: 'users-customers',
          label: 'Khách hàng',
        },
        {
          key: 'users-admins',
          label: 'Quản trị viên',
        },
        {
          key: 'users-permissions',
          label: 'Phân quyền',
        },
        {
          key: 'users-activity',
          label: 'Hoạt động người dùng',
        },
      ],
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Báo cáo & Thống kê',
      children: [
        {
          key: 'analytics-sales',
          icon: <PieChartOutlined />,
          label: 'Báo cáo bán hàng',
        },
        {
          key: 'analytics-revenue',
          icon: <LineChartOutlined />,
          label: 'Doanh thu',
        },
        {
          key: 'analytics-products',
          label: 'Sản phẩm bán chạy',
        },
        {
          key: 'analytics-customers',
          label: 'Phân tích khách hàng',
        },
        {
          key: 'analytics-traffic',
          label: 'Lưu lượng website',
        },
      ],
    },
    {
      key: 'marketing',
      icon: <GiftOutlined />,
      label: 'Marketing & Khuyến mãi',
      children: [
        {
          key: 'marketing-coupons',
          label: 'Mã giảm giá',
        },
        {
          key: 'marketing-campaigns',
          label: 'Chiến dịch marketing',
        },
        {
          key: 'marketing-email',
          label: 'Email marketing',
        },
        {
          key: 'marketing-banners',
          label: 'Banner quảng cáo',
        },
        {
          key: 'marketing-loyalty',
          label: 'Chương trình tích điểm',
        },
      ],
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt hệ thống',
      children: [
        {
          key: 'settings-general',
          label: 'Cài đặt chung',
        },
        {
          key: 'settings-payment',
          label: 'Cài đặt thanh toán',
        },
        {
          key: 'settings-email',
          label: 'Cài đặt email',
        },
        {
          key: 'settings-security',
          label: 'Bảo mật',
        },
      ],
    },
  ];

  const handleMenuClick = (item) => {
    onMenuSelect?.(item.key);
  };

  const handleSubMenuOpenChange = (openKeys) => {
    setOpenKeys(openKeys);
  };

  // Render login prompt if no user
  if (!isLoading && !user) {
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
        }}
      >
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/image/BanHuong.png"
            alt="Bản Hương"
            style={{ width: '60px', height: '60px', marginBottom: '20px' }}
          />
          <Title level={4} style={{ color: 'white', marginBottom: '10px' }}>
            Bản Hương
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>
            Vui lòng đăng nhập để tiếp tục
          </Text>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Button 
              type="primary" 
              size="large" 
              style={{ width: '100%' }}
              onClick={() => window.location.href = '/login'}
            >
              Đăng nhập
            </Button>
            <Button 
              type="default" 
              size="large" 
              style={{ width: '100%' }}
              onClick={() => window.location.href = '/register'}
            >
              Đăng ký
            </Button>
          </Space>
        </div>
      </Sider>
    );
  }

  return (
    <>
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
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: collapsed ? '16px 8px' : '20px 24px',
            background: 'rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            textAlign: collapsed ? 'center' : 'left',
          }}
        >
          {!collapsed ? (
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space align="center">
                <img
                  src="/image/BanHuong.png"
                  alt="Bản Hương"
                  style={{ width: '32px', height: '32px' }}
                />
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  Bản Hương
                </Title>
              </Space>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                Essential Oils Dashboard
              </Text>
            </Space>
          ) : (
            <img
              src="/image/BanHuong.png"
              alt="Bản Hương"
              style={{ width: '28px', height: '28px' }}
            />
          )}
        </div>

        {/* User Profile */}
        {user && (
          <div
            style={{
              padding: collapsed ? '16px 8px' : '20px 24px',
              background: 'rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {collapsed ? (
              <Tooltip title={`${user.displayName} - ${user.role || 'User'}`} placement="right">
                <Dropdown
                  menu={{ items: profileMenuItems }}
                  trigger={['click']}
                  placement="rightTop"
                  arrow
                >
                  <div style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <Badge
                      dot={user.status === 'online'}
                      offset={[-8, 8]}
                      status={user.status === 'online' ? 'success' : 'default'}
                    >
                      <Avatar
                        size={32}
                        src={user.avatar}
                        icon={<UserOutlined />}
                        style={{
                          border: '2px solid rgba(255,255,255,0.3)',
                        }}
                      />
                    </Badge>
                  </div>
                </Dropdown>
              </Tooltip>
            ) : (
              <Dropdown
                menu={{ items: profileMenuItems }}
                trigger={['click']}
                placement="bottomLeft"
                arrow
              >
                <div style={{ cursor: 'pointer' }}>
                  <Space align="center" size={12} style={{ width: '100%' }}>
                    <Badge
                      dot={user.status === 'online'}
                      offset={[-8, 8]}
                      status={user.status === 'online' ? 'success' : 'default'}
                    >
                      <Avatar
                        size={40}
                        src={user.avatar}
                        icon={<UserOutlined />}
                        style={{
                          border: '2px solid rgba(255,255,255,0.3)',
                        }}
                      />
                    </Badge>
                    <div style={{ flex: 1 }}>
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Title level={5} style={{ margin: 0, color: 'white' }}>
                            {user.displayName}
                          </Title>
                          <DownOutlined style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }} />
                        </Space>
                        <Space>
                          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                            {user.role || 'User'}
                          </Text>
                          {user.email_verified && (
                            <Text style={{ color: '#52c41a', fontSize: '10px' }}>
                              ✓ Verified
                            </Text>
                          )}
                        </Space>
                      </Space>
                    </div>
                  </Space>
                </div>
              </Dropdown>
            )}
          </div>
        )}

        {/* Collapse Toggle */}
        <div style={{ padding: '12px', textAlign: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            style={{
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
            }}
          />
        </div>

        {/* Menu */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            openKeys={openKeys}
            onOpenChange={handleSubMenuOpenChange}
            onClick={handleMenuClick}
            items={menuItems}
            style={{
              background: 'transparent',
              border: 'none',
            }}
            theme="dark"
            inlineIndent={20}
          />
        </div>

        {/* Quick Actions */}
        {!collapsed && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Text
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Truy cập nhanh
            </Text>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Button
                type="text"
                icon={<HomeOutlined />}
                size="small"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '4px 8px',
                }}
                onClick={() => window.location.href = '/'}
              >
                Xem website
              </Button>
              <Button
                type="text"
                icon={<BellOutlined />}
                size="small"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '4px 8px',
                }}
                onClick={() => window.location.href = '/notifications'}
              >
                <Space>
                  <span>Thông báo</span>
                  <Badge count={7} size="small" />
                </Space>
              </Button>
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                size="small"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '4px 8px',
                }}
                onClick={() => window.location.href = '/help'}
              >
                Hỗ trợ
              </Button>
            </Space>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            padding: collapsed ? '12px 8px' : '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.1)',
          }}
        >
          {!collapsed ? (
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {user && (
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  size="small"
                  danger
                  style={{
                    color: '#ff7875',
                    justifyContent: 'flex-start',
                    width: '100%',
                    padding: '4px 8px',
                  }}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              )}
              <Text
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '10px',
                  textAlign: 'center',
                  display: 'block',
                }}
              >
                © 2024 Bản Hương v2.1.0
              </Text>
            </Space>
          ) : (
            user && (
              <Tooltip title="Đăng xuất" placement="right">
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  size="small"
                  danger
                  style={{
                    color: '#ff7875',
                    width: '100%',
                  }}
                  onClick={handleLogout}
                />
              </Tooltip>
            )
          )}
        </div>
      </Sider>

      {/* Profile Edit Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>Chỉnh sửa thông tin cá nhân</span>
          </Space>
        }
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          layout="vertical"
          onFinish={handleProfileUpdate}
          initialValues={{
            name: user?.displayName,
            email: user?.email,
            phone: user?.phone,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Avatar size={80} src={user?.avatar} icon={<UserOutlined />} />
            <div style={{ marginTop: '12px' }}>
              <Button type="link" size="small">
                Thay đổi ảnh đại diện
              </Button>
            </div>
          </div>

          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setProfileModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title={
          <Space>
            <KeyOutlined />
            <span>Đổi mật khẩu</span>
          </Space>
        }
        open={changePasswordModalVisible}
        onCancel={() => setChangePasswordModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setChangePasswordModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// Demo usage component
const AdminSidebarDemo = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <AdminSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        selectedKey={selectedKey}
        onMenuSelect={setSelectedKey}
      />
    </div>
  );
};

export default AdminSidebarDemo;