import React, { useEffect, useState } from "react";
import { Card, Carousel, Spin, Typography, Rate } from "antd"; // 👈 thêm Rate
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

  if (loading) {
    return (
      <Spin
        tip="Đang tải sản phẩm bán chạy..."
        style={{ display: "block", margin: "20px auto" }}
      />
    );
  }

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

      <Carousel
        dots
        autoplay
        autoplaySpeed={4000}
        slidesToShow={3}
        responsive={[
          { breakpoint: 1024, settings: { slidesToShow: 2 } },
          { breakpoint: 768, settings: { slidesToShow: 1 } },
        ]}
      >
        {products.map((p) => (
          <div key={p.id} style={{ padding: "0 10px" }}>
            <Card
              hoverable
              cover={
                <img
                  src={p.productImg || "/default-product.png"}
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

              {/* ✅ Hiển thị rating hoặc "Không có sao" */}
              <div style={{ textAlign: "center", marginTop: 8 }}>
                {p.avgRating && p.avgRating > 0 ? (
                  <>
                    <Rate disabled value={p.avgRating} allowHalf />
                    <p style={{ fontSize: 13, color: "#666" }}>
                      {p.avgRating.toFixed(1)} / 5
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: "#999" }}>Không có sao</p>
                )}
              </div>

              <div style={{ textAlign: "center", marginTop: 8 }}>
                <p style={{ fontSize: 13, color: "#666" }}>
                  Đã bán: {p.totalSold || 0}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
