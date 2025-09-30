import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../../components/Sidebar";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      message.error("Không thể tải bài viết");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/admin/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Xóa thành công");
      fetchPosts();
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (img) =>
        img ? (
          <img src={img} alt="" style={{ width: 60, borderRadius: 4 }} />
        ) : (
          "No Image"
        ),
    },
    { title: "Tiêu đề", dataIndex: "title" },
    { title: "Tác giả", dataIndex: "author" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/admin/posts/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 24, marginLeft: 240 }}>
        <h2>📝 Quản lý bài viết</h2>
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => navigate("/admin/posts/add")}
        >
          ➕ Thêm bài viết
        </Button>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={posts}
          loading={loading}
        />
      </div>
    </div>
  );
}
