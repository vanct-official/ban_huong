import React from "react";
import { Card, Typography, Button, Space } from "antd";
import AdminSidebarDemo from "../../../components/Sidebar";

const { Title, Text } = Typography;

export default function AdminPage() {
  return (
    <div>
      <div>
        <AdminSidebarDemo />
      </div>
      <div style={{ padding: 32, background: "#f7f7f7", minHeight: "100vh" }}>
        <Card style={{ maxWidth: 600, margin: "0 auto", borderRadius: 16 }}>
          <Title level={2} style={{ marginBottom: 16 }}>
            Trang Quản Trị Admin
          </Title>
          <Text style={{ color: "#888" }}>
            Đây là giao diện demo. Bạn có thể chỉnh sửa, thêm chức năng quản lý
            người dùng, sản phẩm, đơn hàng...
          </Text>
          <Space style={{ marginTop: 32 }}>
            <Button type="primary">Quản lý người dùng</Button>
            <Button>Quản lý sản phẩm</Button>
            <Button>Quản lý đơn hàng</Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
