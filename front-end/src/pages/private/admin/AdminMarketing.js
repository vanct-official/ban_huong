import React, { useState } from "react";
import { Table, Tag, Space, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import AdminSidebar from "../../../components/Sidebar";

export default function AdminMarketing() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data khuyến mãi
  const promotions = [
    {
      id: 1,
      name: "Giảm 20% tinh dầu hoa hồi",
      discountType: "percent", // percent hoặc fixed
      discountValue: 20,
      startDate: "2025-09-20",
      endDate: "2025-10-05",
      status: "active", // active, upcoming, expired
    },
    {
      id: 2,
      name: "Giảm 50.000đ cho đơn từ 300.000đ",
      discountType: "fixed",
      discountValue: 50000,
      startDate: "2025-09-25",
      endDate: "2025-10-10",
      status: "upcoming",
    },
    {
      id: 3,
      name: "Sale cuối tháng 9",
      discountType: "percent",
      discountValue: 15,
      startDate: "2025-09-15",
      endDate: "2025-09-25",
      status: "expired",
    },
  ];

  const columns = [
    {
      title: "Mã KM",
      dataIndex: "id",
      key: "id",
      render: (id) => <strong>#{id}</strong>,
      width: 100,
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "name",
      key: "name",
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
      width: 250,
    },
    {
      title: "Mức giảm",
      key: "discountValue",
      render: (_, record) =>
        record.discountType === "percent" ? (
          <Tag color="green">{record.discountValue}%</Tag>
        ) : (
          <Tag color="blue">
            {Number(record.discountValue).toLocaleString("vi-VN")} đ
          </Tag>
        ),
      width: 150,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          active: "green",
          upcoming: "blue",
          expired: "red",
        };
        const textMap = {
          active: "Đang diễn ra",
          upcoming: "Sắp tới",
          expired: "Đã kết thúc",
        };
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
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
            onClick={() => alert(`Xem chi tiết khuyến mãi #${record.id}`)}
          >
            Xem
          </Button>
          <Button danger size="small">
            Chỉnh sửa
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
          <AdminSidebar collapsed={false} selectedKey="promotions" />
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
          <AdminSidebar collapsed={false} selectedKey="promotions" />
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
            <h2 style={{ margin: 0, color: "#166534" }}>
              🎉 Quản lý khuyến mãi
            </h2>
          </div>
          <Button
            type="primary"
            style={{ borderRadius: 8, background: "#166534" }}
            onClick={() => alert("Thêm khuyến mãi mới")}
          >
            + Thêm khuyến mãi
          </Button>
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
            dataSource={promotions}
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
