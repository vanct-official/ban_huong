import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import axios from "axios";
import AdminSidebar from "../../../components/Sidebar";
import dayjs from "dayjs";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminPromotion() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form] = Form.useForm();

  // Responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/promotions`);
      setPromotions(res.data);
    } catch {
      message.error("Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingPromo) {
        await axios.put(`${API_URL}/api/promotions/${editingPromo.id}`, values);
        message.success("Cập nhật thành công");
      } else {
        await axios.post(`${API_URL}/api/promotions`, values);
        message.success("Thêm mới thành công");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingPromo(null);
      fetchPromotions();
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/promotions/${id}`);
      message.success("Xóa thành công");
      fetchPromotions();
    } catch {
      message.error("Không thể xóa");
    }
  };

  const columns = [
    { title: "Tên khuyến mãi", dataIndex: "promotionName" },
    { title: "Giảm (%)", dataIndex: "discountPercent" },
    {
      title: "Số tiền tối thiểu (₫)",
      dataIndex: "minOrderValue",
      render: (value) =>
        value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    }, // ✅ thêm cột
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              setEditingPromo(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
      {/* Sidebar (Desktop) */}
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
            onClick={() => {
              form.resetFields();
              setEditingPromo(null);
              setIsModalOpen(true);
            }}
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
            loading={loading}
            size={isMobile ? "small" : "middle"}
          />
        </div>
      </div>

      {/* Modal thêm/sửa */}
      <Modal
        title={editingPromo ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingPromo(null);
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="promotionName"
            label="Tên khuyến mãi"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discountPercent"
            label="Giảm (%)"
            rules={[{ required: true, message: "Vui lòng nhập phần trăm" }]}
          >
            <Input type="number" min={0} max={100} />
          </Form.Item>
          <Form.Item
            name="minOrderValue"
            label="Giá trị tối thiểu (₫)"
            rules={[
              { required: true, message: "Vui lòng nhập giá trị tối thiểu" },
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
