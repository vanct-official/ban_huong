import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Typography, Rate } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function TopRatedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/top-rated"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải top sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  if (loading)
    return (
      <Spin
        tip="Đang tải top sản phẩm..."
        style={{ display: "block", margin: "20px auto" }}
      />
    );

  return (
    <div style={{ marginTop: 60, maxWidth: 1200, margin: "0 auto" }}>
      <Title
        level={2}
        style={{
          textAlign: "center",
          color: "#166534",
          fontWeight: 800,
          marginBottom: 32,
        }}
      >
        Top 5 sản phẩm được đánh giá cao nhất
      </Title>
      <Row gutter={[24, 24]}>
        {products.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
            <Card
              hoverable
              cover={
                <img
                  src={p.productImg || "/default-product.png"}
                  alt={p.productName}
                  style={{ height: 220, objectFit: "cover" }}
                />
              }
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <h3 style={{ fontWeight: 600 }}>{p.productName}</h3>
              <p style={{ color: "#ea580c", fontWeight: 700 }}>
                {Number(p.unitPrice).toLocaleString()} đ
              </p>
              <Rate disabled value={parseFloat(p.avgRating)} allowHalf />
              <p style={{ fontSize: 13, color: "#666" }}>
                {parseFloat(p.avgRating).toFixed(1)} ★ ({p.feedbackCount} nhận
                xét)
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
