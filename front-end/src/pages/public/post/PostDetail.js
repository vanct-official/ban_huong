import React, { useEffect, useState } from "react";
import { Spin, Typography, Card } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MainHeader from "../../../components/MainHeader";
import Footer from "../../../components/Footer";

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]); // 👈 khai báo state để lưu bài viết liên quan
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/${slug}`);
        setPost(res.data);

        // gọi API bài viết liên quan
        const relatedRes = await axios.get(
          `${API_URL}/api/posts/${slug}/related`
        );
        setRelated(relatedRes.data); // 👈 cập nhật state
      } catch (err) {
        console.error("❌ Lỗi tải post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <Spin tip="Đang tải..." />;

  return (
    <>
      <MainHeader />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
        {post && (
          <>
            <Title>{post.title}</Title>
            <img
              src={post.thumbnail}
              alt={post.title}
              style={{ width: "50%", borderRadius: 8 }}
            />
            <p dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* ✅ Hiển thị bài viết liên quan */}
            {related.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <Title level={3}>📌 Bài viết liên quan</Title>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {related.map((r) => (
                    <Card
                      key={r.id}
                      hoverable
                      cover={
                        <img
                          src={
                            r.thumbnail
                              ? `${API_URL}${r.thumbnail}`
                              : "/default-post.png"
                          }
                          alt={r.title}
                          style={{ height: 150, objectFit: "cover" }}
                        />
                      }
                      style={{ width: 220 }}
                      onClick={() => navigate(`/posts/${r.slug}`)}
                    >
                      <h4>{r.title}</h4>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
