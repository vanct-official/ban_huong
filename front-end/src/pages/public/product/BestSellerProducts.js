import React, { useEffect, useState } from "react";
import { Card, Carousel, Spin, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const { Title } = Typography;

export default function BestSellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
         const res = await axios.get(`${API_URL}/api/products/best-sellers`);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải sản phẩm bán chạy:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  if (loading)
    return (
      <Spin
        tip="Đang tải sản phẩm bán chạy..."
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
        Sản phẩm bán chạy nhất
      </Title>
      <Carousel autoplay autoplaySpeed={4000} dots slidesToShow={3}>
        {products.map((p) => (
          <div key={p.id} style={{ padding: "0 12px" }}>
            <Card
              hoverable
              cover={
                <img
                  src={p.images?.[0]?.productImg || "/default-product.png"}
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
              <p style={{ fontSize: 13, color: "#666" }}>
                Đã bán: {p.totalSold || 0}
              </p>
            </Card>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
