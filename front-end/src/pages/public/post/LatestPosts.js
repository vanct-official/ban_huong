import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function LatestPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/latest`);
        setPosts(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Spin tip="Đang tải bài viết..." />;

  return (
    <div style={{ marginTop: 50 }}>
      <Title level={2}>Các bài viết mới</Title>
      <Row gutter={[24, 24]}>
        {posts.map((post) => (
          <Col xs={24} sm={12} md={8} key={post.id}>
            <Card
              hoverable
              cover={
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
                />
              }
              onClick={() => navigate(`/posts/${post.slug}`)}
            >
              <div style={{ color: "#888", fontSize: 12 }}>
                <CalendarOutlined />{" "}
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </div>
              <h3 style={{ fontWeight: 700, color: "#166534" }}>
                {post.title}
              </h3>
              <p style={{ color: "#555" }}>{post.content.slice(0, 100)}...</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
