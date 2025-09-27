import React, { useState } from "react";
import { Table, Tag, Space, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import AdminSidebar from "../../../components/Sidebar";

export default function AdminOrders() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data cho UI
  const orders = [
    {
      id: 1,
      customer: { username: "nguyenvana", email: "a@gmail.com" },
      products: ["Tinh dầu cam", "Tinh dầu oải hương"],
      totalPrice: 350000,
      createdAt: "2025-09-25",
      status: "pending",
    },
    {
      id: 2,
      customer: { username: "tranthib", email: "b@gmail.com" },
      products: ["Tinh dầu sả chanh"],
      totalPrice: 150000,
      createdAt: "2025-09-24",
      status: "completed",
    },
    {
      id: 3,
      customer: { username: "lecuong", email: "c@gmail.com" },
      products: ["Tinh dầu bạc hà", "Tinh dầu quế"],
      totalPrice: 270000,
      createdAt: "2025-09-23",
      status: "processing",
    },
  ];

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id) => <strong>#{id}</strong>,
      width: 100,
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <span>
          {record.customer.username} <br />
          <small style={{ color: "#666" }}>{record.customer.email}</small>
        </span>
      ),
      width: 200,
    },
    {
      title: "Sản phẩm",
      key: "products",
      render: (_, record) =>
        record.products.map((p, i) => (
          <Tag key={i} color="blue">
            {p}
          </Tag>
        )),
      width: 250,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => (
        <span style={{ color: "#d97706", fontWeight: 600 }}>
          {Number(value).toLocaleString("vi-VN")} đ
        </span>
      ),
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          pending: "orange",
          processing: "blue",
          completed: "green",
          cancelled: "red",
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
      width: 150,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => alert(`Xem chi tiết đơn #${record.id}`)}
          >
            Xem
          </Button>
          <Button danger size="small">
            Cập nhật
          </Button>
        </Space>
      ),
      width: 180,
    },
  ];

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
          <AdminSidebar collapsed={false} selectedKey="orders" />
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
          <AdminSidebar collapsed={false} selectedKey="orders" />
        </Drawer>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: isMobile ? 8 : 24,
          maxWidth: 1200,
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
            <h2 style={{ margin: 0, color: "#166534" }}>📦 Quản lý đơn hàng</h2>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(22,101,52,0.08)",
            padding: isMobile ? 4 : 24,
          }}
        >
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{ pageSize: isMobile ? 5 : 10 }}
            bordered
            scroll={{ x: 900 }}
            size={isMobile ? "small" : "middle"}
          />
        </div>
      </div>
    </div>
  );
}
