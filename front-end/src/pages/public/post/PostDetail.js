import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Typography, Row, Col } from "antd";
import axios from "axios";
import MainHeader from "../../../components/MainHeader";
import Footer from "../../../components/Footer";

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/${slug}`);
        setPost(res.data);

        // 👉 lấy bài viết liên quan
        const relatedRes = await axios.get(
          `${API_URL}/api/posts/${slug}/related`
        );
        setRelated(relatedRes.data);
      } catch (err) {
        console.error("❌ Lỗi tải post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <Spin
        tip="Đang tải bài viết..."
        style={{ display: "block", margin: "40px auto" }}
      />
    );
  }

  if (!post) {
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        ❌ Bài viết không tồn tại
      </p>
    );
  }

  return (
    <>
      <MainHeader />

      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
        {/* --- Title --- */}
        <Title level={2} style={{ color: "#166534" }}>
          {post.title}
        </Title>

        {/* --- Meta info --- */}
        <p style={{ color: "#666", fontSize: 14 }}>
          ✍️ {post.author || "Admin"} • 📅{" "}
          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          {post.updatedAt && (
            <>
              {" "}
              • 🔄 Cập nhật:{" "}
              {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
            </>
          )}
        </p>

        {/* --- Ảnh đại diện --- */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 8,
              margin: "20px 0",
            }}
          />
        )}

        {/* --- Nội dung --- */}
        <div
          style={{ fontSize: 16, lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* --- Related Posts --- */}
        {related.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <Title level={3} style={{ color: "#166534" }}>
              📌 Bài viết liên quan
            </Title>
            <Row gutter={[24, 24]}>
              {related.map((rp) => (
                <Col xs={24} sm={12} md={8} key={rp.id}>
                  <Card
                    hoverable
                    cover={
                      rp.image && (
                        <img
                          src={`${API_URL}/uploads/${rp.image}`}
                          alt={rp.title}
                          style={{ height: 180, objectFit: "cover" }}
                        />
                      )
                    }
                    onClick={() => navigate(`/posts/${rp.slug}`)}
                  >
                    <Card.Meta
                      title={rp.title}
                      description={
                        rp.excerpt || rp.content?.substring(0, 80) + "..."
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
