import React, { useEffect, useState } from "react";
import { Tag, Spin, Typography, Card } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

export default function PopularSearches() {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/popular-searches`);
        setKeywords(res.data);
      } catch (err) {
        console.error("❌ Lỗi lấy từ khóa phổ biến:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (loading) {
    return (
      <Spin
        tip="Đang tải từ khóa phổ biến..."
        style={{ display: "block", margin: "20px auto" }}
      />
    );
  }

  if (keywords.length === 0) {
    return null; // Không render gì nếu chưa có từ khóa
  }

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <Card
        style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        bodyStyle={{ padding: 24 }}
      >
        <Title level={3} style={{ marginBottom: 16, color: "#166534" }}>
          🔥 Từ khóa tìm kiếm phổ biến
        </Title>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {keywords.map((k) => (
            <Tag
              key={k.id}
              color="green"
              style={{
                fontSize: 15,
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/products?q=${k.keyword}`)}
            >
              {k.keyword} ({k.count})
            </Tag>
          ))}
        </div>
      </Card>
    </div>
  );
}
