import React, { useEffect, useState } from "react";
import { Table, Tag, Avatar, Button, message, Card } from "antd";
import { DeleteOutlined, StarFilled } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy feedback từ server
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/feedback");
      setFeedbacks(res.data);
    } catch (err) {
      console.error("❌ Lỗi lấy feedback:", err);
      message.error("Không thể tải danh sách feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Xoá feedback
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${id}`);
      message.success("Đã xoá feedback");
      fetchFeedbacks();
    } catch (err) {
      console.error("❌ Lỗi xoá feedback:", err);
      message.error("Xoá thất bại");
    }
  };

  // Cột cho bảng
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
    },
    {
      title: "Đánh giá",
      dataIndex: "rate",
      key: "rate",
      render: (rate) => (
        <span style={{ color: "#faad14", fontWeight: 600 }}>
          {Array.from({ length: rate }).map((_, i) => (
            <StarFilled key={i} />
          ))}
        </span>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "feedbackContent",
      key: "feedbackContent",
      render: (text) => <span style={{ color: "#555" }}>{text}</span>,
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
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          Xoá
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Nội dung quản lý feedback */}
      <div style={{ flex: 1, padding: 20 }}>
        <Card title="Quản lý Feedback" bordered>
          <Table
            columns={columns}
            dataSource={feedbacks}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminFeedback;
