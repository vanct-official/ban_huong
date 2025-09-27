import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  message,
  Drawer,
  Space,
  Select,
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import axios from "axios";
import AdminSidebar from "../../../components/Sidebar";

const { Option } = Select;

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch feedbacks
  const fetchFeedbacks = async (productId = null) => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/feedback";
      if (productId) url += `/product/${productId}`;
      const res = await axios.get(url);
      setFeedbacks(res.data);
    } catch (err) {
      console.error("❌ Lỗi lấy feedback:", err);
      message.error("Không thể tải danh sách feedback");
    }
    setLoading(false);
  };

  // Fetch products for dropdown
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Lỗi lấy sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchProducts();
  }, []);

  // Delete feedback
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${id}`);
      message.success("Đã xoá feedback");
      fetchFeedbacks(selectedProduct);
    } catch (err) {
      console.error("❌ Lỗi xoá feedback:", err);
      message.error("Xoá thất bại");
    }
  };

  // Columns
  const columns = [
    {
      title: "Người dùng",
      dataIndex: "User",
      key: "user",
      render: (user) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar src={user?.avatarImg || "/default-avatar.png"} />
          {user?.username}
        </span>
      ),
      width: 200,
    },
    {
      title: "Sản phẩm",
      dataIndex: "Product",
      key: "product",
      render: (product) => (
        <Tag color="green" style={{ fontWeight: 500 }}>
          {product?.productName}
        </Tag>
      ),
      width: 180,
    },
    {
      title: "Số sao",
      dataIndex: "rate",
      key: "rate",
      render: (rate) => (
        <span style={{ color: "#faad14", fontWeight: 600 }}>{rate} ★</span>
      ),
      width: 100,
      align: "center",
    },
    {
      title: "Nội dung",
      dataIndex: "feedbackContent",
      key: "feedbackContent",
      render: (text) => <span style={{ color: "#555" }}>{text}</span>,
      ellipsis: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        new Date(date).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      width: 160,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => handleDelete(record.id)}
        >
          Xoá
        </Button>
      ),
      width: 100,
      align: "center",
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
          <AdminSidebar collapsed={false} />
        </div>
      )}
      {/* Drawer sidebar for mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          bodyStyle={{ padding: 0 }}
          width={220}
        >
          <AdminSidebar collapsed={false} />
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
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setSidebarOpen(true)}
                style={{ borderRadius: 8, marginRight: 8 }}
              />
            )}
            <h2
              style={{
                margin: 0,
                color: "#166534",
                fontSize: isMobile ? 20 : 26,
              }}
            >
              Quản lý Feedback
            </h2>
          </div>
          <Space>
            {/* Bộ lọc sản phẩm */}
            <Select
              style={{ width: 220 }}
              placeholder="Lọc theo sản phẩm"
              allowClear
              value={selectedProduct}
              onChange={(value) => {
                setSelectedProduct(value);
                fetchFeedbacks(value);
              }}
            >
              {products.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.productName}
                </Option>
              ))}
            </Select>
          </Space>
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
            dataSource={feedbacks}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: isMobile ? 5 : 10 }}
            bordered
            scroll={{ x: 800 }}
            size={isMobile ? "small" : "middle"}
          />
        </div>
      </div>
    </div>
  );
}
