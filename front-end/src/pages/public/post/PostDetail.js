import React, { useEffect, useState } from "react";
import { Spin, Typography } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainHeader from "../../../components/MainHeader";
import Footer from "../../../components/Footer";

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return; // 👈 nếu slug undefined thì bỏ qua
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/${slug}`);
        setPost(res.data);
        document.title = res.data.title + " - Bản Hương";
      } catch (err) {
        console.error("❌ Lỗi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <Spin tip="Đang tải..." />;
  if (!post) return <p>❌ Không tìm thấy bài viết</p>;

  return (
    <>
      <MainHeader />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
        <Title>{post.title}</Title>
        <img
          src={post.thumbnail || "/default-thumb.jpg"}
          alt={post.title}
          style={{ width: "100%", marginBottom: 20 }}
        />
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      <Footer />
    </>
  );
}
