import React, { useEffect, useState } from "react";
import { Table, Button, message, Card, Popconfirm } from "antd";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import {
  DeleteOutlined,
  ReloadOutlined,
  MailOutlined,
} from "@ant-design/icons";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ManageSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Lấy danh sách subscriber từ API
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/subscribers`);
      setSubscribers(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải subscribers:", err);
      message.error("Không tải được danh sách subscribers");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Xóa subscriber theo id
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/subscribers/${id}`);
      message.success("Xóa subscriber thành công");
      setSubscribers(subscribers.filter((sub) => sub.id !== id));
    } catch (err) {
      console.error("❌ Lỗi xóa subscriber:", err);
      message.error("Xóa subscriber thất bại");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const columns = [
    {
      title: "📧 Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <span>
          <MailOutlined style={{ marginRight: 8, color: "#1677ff" }} />
          {text}
        </span>
      ),
    },
    {
      title: "⏰ Ngày đăng ký",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "⚙️ Thao tác",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa email này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Sidebar />
      <div style={{ maxWidth: 900, margin: "20px auto" }}>
        <Card
          title={<h2 style={{ color: "#166534" }}>📧 Quản lý Subscribers</h2>}
          bordered
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={subscribers}
            loading={loading}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </div>
    </>
  );
};

export default ManageSubscribers;
