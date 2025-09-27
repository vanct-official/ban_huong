import React, { useEffect, useState } from "react";
import { Table, Button, Image, Popconfirm, message, Space, Tag, Drawer } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, MenuOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/Sidebar";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const navigate = useNavigate();

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách sản phẩm!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      message.success("Đã xóa sản phẩm!");
      fetchProducts();
    } catch (err) {
      message.error("Xóa thất bại!");
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "productImg",
      key: "productImg",
      render: (img) =>
        img ? (
          <Image
            src={img}
            alt="Ảnh"
            width={50}
            height={50}
            style={{ objectFit: "cover", borderRadius: 8, background: "#fff" }}
            fallback="/default-product.png"
          />
        ) : (
          <Image
            src="/default-product.png"
            alt="Ảnh"
            width={50}
            height={50}
            style={{ objectFit: "cover", borderRadius: 8, background: "#fff" }}
          />
        ),
      width: 70,
      align: "center",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text) => (
        <span style={{ fontWeight: 600 }}>{text}</span>
      ),
      width: 180,
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => (
        <span style={{ color: "#ea580c", fontWeight: 700 }}>
          {Number(price).toLocaleString()} đ
        </span>
      ),
      width: 100,
      align: "right",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty) => (
        <span style={{ color: qty === 0 ? "#dc2626" : "#166534", fontWeight: 600 }}>
          {qty}
        </span>
      ),
      width: 90,
      align: "center",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) =>
        record.quantity === 0 ? (
          <Tag color="red">Hết hàng</Tag>
        ) : (
          <Tag color="green">Còn hàng</Tag>
        ),
      width: 100,
      align: "center",
      responsive: ["md", "lg"],
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/products/update/${record.id}`)}
            type="primary"
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 140,
      align: "center",
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
      {/* Sidebar */}
      {!isMobile && (
        <div style={{ minWidth: 220, background: "#fff", borderRight: "1px solid #eee" }}>
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
      <div style={{ flex: 1, padding: isMobile ? 8 : 24, maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isMobile ? 12 : 24,
          gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setSidebarOpen(true)}
                style={{ borderRadius: 8, marginRight: 8 }}
              />
            )}
            <h2 style={{ margin: 0, color: "#166534", fontSize: isMobile ? 20 : 26 }}>Quản lý sản phẩm</h2>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/products/add")}
              style={{ borderRadius: 8, fontWeight: 600, fontSize: isMobile ? 13 : 16, height: isMobile ? 32 : 40 }}
            >
              Thêm sản phẩm
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchProducts}
              style={{ borderRadius: 8, fontSize: isMobile ? 13 : 16, height: isMobile ? 32 : 40 }}
            >
              Làm mới
            </Button>
          </Space>
        </div>
        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(22,101,52,0.08)", padding: isMobile ? 4 : 24 }}>
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: isMobile ? 5 : 10 }}
            bordered
            scroll={{ x: 700 }}
            size={isMobile ? "small" : "middle"}
          />
        </div>
      </div>
    </div>
  );
}