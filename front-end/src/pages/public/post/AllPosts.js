import React, { useEffect, useState } from "react";
import { Card, Spin, Typography } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error("❌ Lỗi lấy tất cả bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Spin
        tip="Đang tải bài viết..."
        style={{ display: "block", margin: "20px auto" }}
      />
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 16px" }}>
      <Title level={3} style={{ marginBottom: 16, color: "#166534" }}>
        📚 Tất cả bài viết
      </Title>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {posts.map((p) => (
          <Card
            key={p.id}
            hoverable
            cover={
              p.thumbnail && (
                <img
                  alt={p.title}
                  src={p.thumbnail}
                  style={{ height: 180, objectFit: "cover" }}
                />
              )
            }
          >
            <Link to={`/posts/${p.slug}`}>
              <Title level={4}>{p.title}</Title>
            </Link>
            <Text type="secondary">
              ✍️ {p.author || "Admin"} | 📅{" "}
              {new Date(p.createdAt).toLocaleDateString("vi-VN")}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
}
