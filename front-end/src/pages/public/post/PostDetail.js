import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Typography, Card } from "antd";
import axios from "axios";
import MainHeader from "../../../components/MainHeader";
import Footer from "../../../components/Footer";

const { Title, Paragraph, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return; // 👈 tránh gọi API khi slug undefined
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/${slug}`);
        setPost(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải chi tiết bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Spin
        tip="Đang tải bài viết..."
        style={{ display: "block", margin: "20px auto" }}
      />
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        ❌ Không tìm thấy bài viết
      </div>
    );
  }

  return (
    <>
      <MainHeader />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
        <Card
          cover={
            <img
              src={post.thumbnail}
              alt={post.title}
              style={{ maxHeight: 400, objectFit: "cover" }}
            />
          }
          style={{ borderRadius: 12 }}
        >
          <Title level={2}>{post.title}</Title>
          <Text type="secondary">
            ✍️ {post.author} | 🗓{" "}
            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
            <br />
            🔄 Cập nhật: {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
          </Text>
          <Paragraph style={{ marginTop: 20 }}>{post.content}</Paragraph>
        </Card>
      </div>
      <Footer />
    </>
  );
}
