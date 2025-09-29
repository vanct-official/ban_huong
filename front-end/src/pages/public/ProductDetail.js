import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Spin,
  Alert,
  Button,
  InputNumber,
  Row,
  Col,
  Tag,
  Divider,
  message,
  Tabs,
  Rate,
} from "antd";
import {
  ShoppingCartOutlined,
  FireOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ProductCarousel from "../../components/ProductCarousel";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import ProductFeedback from "../../components/ProductFeedback";

const API_URL = process.env.REACT_APP_API_URL;

const { Title, Paragraph, Text } = Typography;

export default function ProductDetail() {
  const [avgRating, setAvgRating] = useState(0);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("productDetail") + " - Bản Hương";
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(res.data);
        if (
          Array.isArray(res.data.productImgs) &&
          res.data.productImgs.length > 0
        ) {
          setImages(res.data.productImgs);
        } else {
          setImages(["/default-product.png"]);
        }
      } catch (err) {
        setError(t("productNotFoundOrError"));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    // eslint-disable-next-line
  }, [id, t]);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/feedback/avg/${id}`)
        .then((res) => setAvgRating(res.data.avgRating || 0))
        .catch(() => setAvgRating(0));
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
        return;
      }

      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 JWT token
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: qty, // 👈 số lượng đã chọn từ InputNumber
        }),
      });

      if (!res.ok) {
        throw new Error("❌ Không thể thêm sản phẩm vào giỏ hàng");
      }

      alert("🎉 Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi:", err);
      alert("❌ " + (err.message || "Có lỗi xảy ra"));
    }
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip={t("loading")} />
      </div>
    );

  if (error)
    return (
      <div style={{ maxWidth: 500, margin: "40px auto" }}>
        <Alert type="error" message={error} />
      </div>
    );

  if (!product) return null;

  return (
    <>
      <MainHeader />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0fdf4 0%, #fef9c3 100%)",
          padding: "40px 0",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
          {/* Nút chuyển ngôn ngữ */}
          <div style={{ textAlign: "right", marginBottom: 12 }}>
            {/* ...nếu có nút chuyển ngôn ngữ... */}
          </div>
          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(60,60,120,0.10)",
              border: "none",
              background: "rgba(255,255,255,0.98)",
              minHeight: 320,
            }}
            bodyStyle={{ padding: 0 }}
          >
            <Row gutter={[0, 0]} wrap align="middle">
              {/* Left: Ảnh sản phẩm dạng slider */}
              <Col
                xs={24}
                md={10}
                style={{
                  background:
                    "linear-gradient(135deg, #fef9c3 0%, #f0fdf4 100%)",
                  borderRadius: "20px 0 0 20px",
                  minHeight: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 32,
                }}
              >
                <ProductCarousel images={images} />
              </Col>

              {/* Right: Thông tin sản phẩm */}

              <Col xs={24} md={14} style={{ padding: 32 }}>
                <Title level={2} style={{ marginBottom: 8, color: "#166534" }}>
                  {product.productName}
                  {product.isHot && (
                    <Tag
                      color="red"
                      style={{ marginLeft: 12 }}
                      icon={<FireOutlined />}
                    >
                      {t("hot")}
                    </Tag>
                  )}
                </Title>

                {/* ✅ Hiển thị số sao trung bình */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontWeight: 500, marginRight: 8 }}>
                    Đánh giá:
                  </span>
                  <Rate disabled value={avgRating} allowHalf />
                  <span style={{ marginLeft: 8, color: "#666" }}>
                    {avgRating.toFixed(1)} / 5
                  </span>
                </div>

                <div style={{ marginBottom: 12 }}>
                  {product.oldPrice && product.unitPrice < product.oldPrice && (
                    <>
                      <Text
                        delete
                        style={{
                          color: "#b91c1c",
                          fontSize: 18,
                          marginRight: 12,
                        }}
                      >
                        {Number(product.oldPrice).toLocaleString()} đ
                      </Text>
                      <Tag color="orange" style={{ fontWeight: 700 }}>
                        -
                        {Math.round(
                          100 - (product.unitPrice / product.oldPrice) * 100
                        )}
                        %
                      </Tag>
                    </>
                  )}
                  <span
                    style={{ color: "#ea580c", fontWeight: 700, fontSize: 28 }}
                  >
                    {Number(product.unitPrice).toLocaleString()} đ
                  </span>
                </div>

                <Divider style={{ margin: "16px 0" }} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 24,
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#166534" }}>
                    {t("quantity")}:
                  </span>
                  <InputNumber
                    min={1}
                    max={product.quantity || 99}
                    value={qty}
                    onChange={setQty}
                    style={{ borderRadius: 8, width: 80 }}
                  />
                  <span style={{ color: "#888" }}>
                    ({t("inStock")}: {product.quantity})
                  </span>
                </div>

                {/* ✅ Nút thêm vào giỏ */}
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  style={{
                    borderRadius: 10,
                    fontWeight: 700,
                    minWidth: 180,
                    background:
                      "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                    border: "none",
                    boxShadow: "0 2px 12px rgba(22,101,52,0.15)",
                  }}
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? t("outOfStock") : t("addToCart")}
                </Button>
              </Col>
            </Row>
          </Card>
          {/* Tabs cho mô tả và nhận xét đặt bên dưới Card */}
          <div
            style={{
              marginTop: 32,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(22,101,52,0.07)",
              padding: 24,
            }}
          >
            <Tabs
              defaultActiveKey="description"
              items={[
                {
                  key: "description",
                  label: t("description") || "Mô tả",
                  children: (
                    <div
                      style={{
                        fontSize: 16,
                        color: "#444",
                        marginBottom: 18,
                        lineHeight: 1.6,
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          product.description ||
                          `<span style="color:#999">${t(
                            "noDescription"
                          )}</span>`,
                      }}
                    />
                  ),
                },
                {
                  key: "reviews",
                  label: t("reviews") || "Nhận xét",
                  children: <ProductFeedback productId={product.id} />,
                },
              ]}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
