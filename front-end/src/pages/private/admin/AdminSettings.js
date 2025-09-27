import React, { useState } from "react";
import {
  Drawer,
  Button,
  Tabs,
  Form,
  Input,
  Switch,
  Select,
  Divider,
  message,
} from "antd";
import { MenuOutlined, SaveOutlined } from "@ant-design/icons";
import AdminSidebar from "../../../components/Sidebar";

const { TabPane } = Tabs;
const { Option } = Select;

export default function AdminSettings() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [form] = Form.useForm();

  // Giả lập dữ liệu cài đặt ban đầu
  const initialSettings = {
    storeName: "Tinh Dầu Hoa Hồi",
    email: "contact@hoahoi.vn",
    phone: "0123 456 789",
    address: "123 Đường Láng, Hà Nội",
    paymentMethod: "cod",
    shippingFee: 30000,
    emailNotification: true,
    pushNotification: false,
  };

  const handleSave = () => {
    message.success("Đã lưu cài đặt thành công!");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
      {/* Sidebar */}
      {!isMobile && (
        <div
          style={{
            minWidth: 220,
            background: "#fff",
            borderRight: "1px solid #eee",
          }}
        >
          <AdminSidebar collapsed={false} selectedKey="settings" />
        </div>
      )}

      {/* Drawer Sidebar (Mobile) */}
      {isMobile && (
        <Drawer
          placement="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          bodyStyle={{ padding: 0 }}
          width={220}
        >
          <AdminSidebar collapsed={false} selectedKey="settings" />
        </Drawer>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: isMobile ? 8 : 24,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? 12 : 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setSidebarOpen(true)}
                style={{ borderRadius: 8 }}
              />
            )}
            <h2 style={{ margin: 0, color: "#166534" }}>⚙️ Cài đặt hệ thống</h2>
          </div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            style={{ borderRadius: 8, background: "#166534" }}
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        </div>

        {/* Tabs */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(22,101,52,0.08)",
            padding: isMobile ? 8 : 24,
          }}
        >
          <Tabs defaultActiveKey="1" tabBarGutter={32}>
            {/* Tab 1: Thông tin cửa hàng */}
            <TabPane tab="🏪 Thông tin cửa hàng" key="1">
              <Form
                layout="vertical"
                form={form}
                initialValues={initialSettings}
                onFinish={handleSave}
              >
                <Form.Item
                  label="Tên cửa hàng"
                  name="storeName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên cửa hàng" },
                  ]}
                >
                  <Input placeholder="Nhập tên cửa hàng" />
                </Form.Item>

                <Form.Item
                  label="Email liên hệ"
                  name="email"
                  rules={[{ type: "email", message: "Email không hợp lệ" }]}
                >
                  <Input placeholder="contact@hoahoi.vn" />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                  ]}
                >
                  <Input placeholder="0123 456 789" />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                  <Input placeholder="123 Đường Láng, Hà Nội" />
                </Form.Item>
              </Form>
            </TabPane>

            {/* Tab 2: Thanh toán & Vận chuyển */}
            <TabPane tab="💳 Thanh toán & Vận chuyển" key="2">
              <Form
                layout="vertical"
                form={form}
                initialValues={initialSettings}
                onFinish={handleSave}
              >
                <Form.Item
                  label="Phương thức thanh toán mặc định"
                  name="paymentMethod"
                >
                  <Select>
                    <Option value="cod">Thanh toán khi nhận hàng (COD)</Option>
                    <Option value="bank">Chuyển khoản ngân hàng</Option>
                    <Option value="momo">Ví MoMo</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Phí vận chuyển mặc định" name="shippingFee">
                  <Input
                    type="number"
                    placeholder="Nhập phí vận chuyển (VNĐ)"
                  />
                </Form.Item>
              </Form>
            </TabPane>

            {/* Tab 3: Thông báo */}
            <TabPane tab="🔔 Thông báo" key="3">
              <Form
                layout="vertical"
                form={form}
                initialValues={initialSettings}
                onFinish={handleSave}
              >
                <Form.Item
                  label="Thông báo Email"
                  name="emailNotification"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  label="Thông báo đẩy (Push Notification)"
                  name="pushNotification"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Form>
            </TabPane>

            {/* Tab 4: Tài khoản Admin */}
            <TabPane tab="👤 Tài khoản Admin" key="4">
              <Form layout="vertical" onFinish={handleSave}>
                <Form.Item
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu hiện tại",
                    },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu mới" />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu mới",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không khớp")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>

          <Divider />

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              style={{ borderRadius: 8, background: "#166534" }}
              onClick={handleSave}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
