import React, { useEffect, useState } from "react";
import { Table, Spin, message, Select, Card, Tag } from "antd";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const API_URL = process.env.REACT_APP_API_URL;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải đơn hàng:", err);
      message.error("Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái
  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/admin/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("✅ Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      message.error("Cập nhật thất bại");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Map màu trạng thái
  const statusColors = {
    pending: "orange",
    paid: "blue",
    shipped: "purple",
    completed: "green",
    cancelled: "red",
  };

  // Cột bảng
  const columns = [
    { title: "Mã đơn", dataIndex: "id", key: "id" },
    {
      title: "Khách hàng",
      dataIndex: ["user", "email"],
      key: "user",
      render: (email) => email || <Tag color="default">Ẩn danh</Tag>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(val) => handleUpdateStatus(record.id, val)}
        >
          <Select.Option value="pending">Đang chờ</Select.Option>
          <Select.Option value="paid">Đã thanh toán</Select.Option>
          <Select.Option value="shipped">Đang giao</Select.Option>
          <Select.Option value="completed">Hoàn thành</Select.Option>
          <Select.Option value="cancelled">Hủy</Select.Option>
        </Select>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      render: (val) => (
        <span style={{ fontWeight: 600, color: "#ea580c" }}>
          {Number(val).toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      title: "Chi tiết",
      dataIndex: "items",
      render: (items) =>
        items && items.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {items.map((i) => (
              <li key={i.id}>
                {i.product?.productName} × {i.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <Tag color="red">Chưa có sản phẩm</Tag>
        ),
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 24, marginLeft: 250 }}>
        <Card
          title="📦 Quản lý đơn hàng"
          bordered
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: 50 }}>
              <Spin size="large" tip="Đang tải đơn hàng..." />
            </div>
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={orders}
              pagination={{ pageSize: 8 }}
              bordered
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;
