import React, { useEffect, useState } from "react";
import { Card, Spin, Typography, Rate, Carousel } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

console.log("API_URL:", API_URL);

const { Title } = Typography;

export default function TopRatedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/top-rated`);
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
        Sản phẩm được đánh giá cao
      </Title>

      <Carousel
        dots
        autoplay
        autoplaySpeed={4000}
        slidesToShow={3} // số sản phẩm hiển thị cùng lúc
        responsive={[
          {
            breakpoint: 1024,
            settings: { slidesToShow: 2 },
          },
          {
            breakpoint: 768,
            settings: { slidesToShow: 1 },
          },
        ]}
      >
        {products.map((p) => {
          const rating = parseFloat(p.avgRating);
          const safeRating = isNaN(rating) ? 0 : rating; // 👈 nếu NaN thì về 0
          const feedbackCount = p.feedbackCount || 0;

          return (
            <div key={p.id} style={{ padding: "0 10px" }}>
              <Card
                hoverable
                cover={
                  <img
                    src={
                      p.productImg
                        ? p.productImg
                        : p.images && p.images.length > 0
                        ? `http://localhost:5000/${p.images[0].productImg}`
                        : "/default-product.png"
                    }
                    alt={p.productName}
                    style={{
                      height: 220,
                      objectFit: "cover",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                  />
                }
                onClick={() => navigate(`/products/${p.id}`)}
                style={{ maxWidth: 300, margin: "0 auto" }}
              >
                <h3 style={{ fontWeight: 600, textAlign: "center" }}>
                  {p.productName}
                </h3>
                <p
                  style={{
                    color: "#ea580c",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {Number(p.unitPrice).toLocaleString()} đ
                </p>
                <div style={{ textAlign: "center" }}>
                  <Rate disabled value={safeRating} allowHalf />
                  <p style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                    {safeRating.toFixed(1)} ★ ({feedbackCount} nhận xét)
                  </p>
                </div>
              </Card>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}
