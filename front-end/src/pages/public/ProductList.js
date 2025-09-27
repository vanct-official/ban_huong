import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Card,
  Button,
  InputNumber,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Slider,
  Pagination,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import { ShoppingCartOutlined, FireOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
import WishlistButton from "../../components/WishlistButton";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(Number(price));

  const fetchProducts = (q = "") => {
    setLoading(true);
    const url = q
      ? `http://localhost:5000/api/products/search?q=${q}`
      : "http://localhost:5000/api/products";

    axios
      .get(url)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
        setLoading(false);
      });
  };

  const debouncedSearch = useCallback(
    debounce((q) => fetchProducts(q), 500),
    []
  );

  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchProducts(value);
  };

  useEffect(() => {
    document.title = t("productList") + " - Bản Hương";
    fetchProducts();
  }, []);

  useEffect(() => {
    let data = [...products];
    data = data.filter(
      (p) => p.unitPrice >= priceRange[0] && p.unitPrice <= priceRange[1]
    );

    if (sortOption === "priceAsc") {
      data.sort((a, b) => a.unitPrice - b.unitPrice);
    } else if (sortOption === "priceDesc") {
      data.sort((a, b) => b.unitPrice - a.unitPrice);
    } else if (sortOption === "nameAsc") {
      data.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (sortOption === "nameDesc") {
      data.sort((a, b) => b.productName.localeCompare(a.productName));
    }

    setFilteredProducts(data);
    setCurrentPage(1);
  }, [products, sortOption, priceRange]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  // === Thêm sản phẩm vào Cart ===
  const handleAddToCart = async (productId, qty) => {
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: qty || 1 }),
      });

      if (!res.ok) {
        throw new Error("Không thể thêm vào giỏ hàng");
      }

      alert("🎉 Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (err) {
      console.error("❌ Lỗi:", err);
      alert("❌ " + (err.message || "Có lỗi xảy ra"));
    }
  };

  return (
    <>
      <MainHeader />
      <div style={{ minHeight: "100vh", padding: "32px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          {loading ? (
            <div style={{ textAlign: "center", marginTop: 80 }}>
              <Spin tip="Đang tải sản phẩm..." size="large" />
            </div>
          ) : (
            <>
              <Row gutter={[24, 32]}>
                {currentProducts.map((p) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                    <Card
                      hoverable
                      className="product-card"
                      cover={
                        <img
                          alt={p.productName}
                          src={
                            Array.isArray(p.productImgs) &&
                            p.productImgs.length > 0
                              ? p.productImgs[0]
                              : p.productImg || "/default-product.png"
                          }
                          style={{
                            height: 210,
                            objectFit: "cover",
                            width: "100%",
                          }}
                        />
                      }
                      onClick={() => handleProductClick(p.id)}
                    >
                      <Title level={5}>
                        <Tooltip title={p.productName}>{p.productName}</Tooltip>
                      </Title>

                      <div style={{ color: "#ea580c", fontWeight: 700 }}>
                        {p.unitPrice.toLocaleString()} đ
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 10,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <InputNumber
                          min={1}
                          max={99}
                          defaultValue={1}
                          size="small"
                          onChange={(val) => (p._qty = val)}
                        />

                        <WishlistButton productId={p.id} />

                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => handleAddToCart(p.id, p._qty || 1)}
                        >
                          Thêm
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductList;
