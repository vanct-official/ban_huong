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

  // Thêm hàm cập nhật trạng thái thanh toán
  const handleUpdatePaymentStatus = async (id, paymentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/admin/orders/${id}/status`,
        { paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("✅ Cập nhật trạng thái thanh toán thành công");
      fetchOrders();
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      message.error("Cập nhật trạng thái thanh toán thất bại");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const paymentMethodColors = {
    payos: "blue",
    PayOS: "blue",
    cash: "gold",
    Cash: "gold",
  };

  const paymentStatusColors = {
    pending: "orange",
    paid: "green",
    failed: "red",
    canceled: "red",
  };

  const paymentStatusOptions = [
    { value: "pending", label: "Chờ thanh toán" },
    { value: "paid", label: "Đã thanh toán" },
    { value: "failed", label: "Thất bại" },
    { value: "canceled", label: "Đã hủy" },
  ];

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
      title: "Hình thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (val) => (
        <Tag color={paymentMethodColors[val] || "default"}>
          {val === "payos" || val === "PayOS" ? "PayOS" : "Tiền mặt"}
        </Tag>
      ),
    },
    {
      title: "Tình trạng thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (val, record) => (
        <Select
          value={val}
          style={{ width: 140 }}
          onChange={(newStatus) => handleUpdatePaymentStatus(record.id, newStatus)}
          disabled={val === "paid"}
        >
          {paymentStatusOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(val) => handleUpdateStatus(record.id, val)}
          disabled={status === "completed"} // 🔒 khóa nếu đã hoàn thành
        >
          <Select.Option value="pending">Đang chờ</Select.Option>
          <Select.Option value="shipped">Đang giao</Select.Option>
          <Select.Option value="completed">Hoàn thành</Select.Option>
          <Select.Option value="cancelled">Hủy</Select.Option>
        </Select>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "finalAmount",
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

  // Thêm expandedRowRender để hiển thị chi tiết đơn hàng
  const expandedRowRender = (record) => (
    <div>
      {/* Danh sách sản phẩm */}
      {record.items && record.items.length > 0 ? (
        record.items.map((item) => (
          <Card
            key={item.id}
            style={{
              marginBottom: 12,
              borderRadius: 10,
              border: "1px solid #eee",
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              <img
                src={
                  item.product?.images?.[0]?.productImg
                    ? `http://localhost:5000/${item.product.images[0].productImg}`
                    : "/default-product.png"
                }
                alt={item.product?.productName}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>
                  {item.product?.productName}
                </div>
                <div>
                  Giá: {Number(item.unitPrice).toLocaleString("vi-VN")} đ
                </div>
                <div>Số lượng: {item.quantity}</div>
                <div>
                  Thành tiền:{" "}
                  {Number(item.unitPrice * item.quantity).toLocaleString("vi-VN")} đ
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Tag color="red">Chưa có sản phẩm</Tag>
      )}
      {/* Thông tin tổng kết đơn hàng */}
      <div
        style={{
          marginTop: 16,
          padding: "16px 18px",
          background: "#f9fafb",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(60,60,120,0.06)",
          maxWidth: 500,
        }}
      >
        <div style={{ fontWeight: 500 }}>
          Tổng tiền sản phẩm: <span>{Number(record.totalAmount).toLocaleString("vi-VN")} đ</span>
        </div>
        <div style={{ fontWeight: 500 }}>
          Mã giảm giá:{" "}
          {record.promotionId ? (
            <Tag color="green">{record.promotionId}</Tag>
          ) : (
            <Tag color="default">Không áp dụng</Tag>
          )}
        </div>
        <div style={{ fontWeight: 500 }}>
          Số tiền giảm giá: <span style={{ color: "#e11d48" }}>-{Number(record.discountAmount).toLocaleString("vi-VN")} đ</span>
        </div>
        <div style={{ fontWeight: 500 }}>
          Phí vận chuyển: <span>{Number(record.shippingAmount).toLocaleString("vi-VN")} đ</span>
        </div>
        <div style={{ fontWeight: 700, color: "#ea580c", fontSize: 18, marginTop: 8 }}>
          Thành tiền: {Number(record.finalAmount).toLocaleString("vi-VN")} đ
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 24, marginLeft: 250 }}>
        <Card
          title={<h2 style={{ color: "#166534" }}>📦 Quản lý đơn hàng</h2>}
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
              expandable={{
                expandedRowRender,
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;
