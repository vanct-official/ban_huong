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
import {
  ShoppingCartOutlined,
  FireOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
<<<<<<< HEAD
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../services/api";
import { message } from "antd";
=======
import WishlistButton from "../../components/WishlistButton";
>>>>>>> main

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

function ProductList() {
  const [wishlist, setWishlist] = useState([]); // ✅ chỉ dùng wishlist

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

<<<<<<< HEAD
  // --- Lấy dữ liệu sản phẩm ---
=======
  // --- Hàm định dạng giá tiền ---
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(Number(price));
  };

  // --- Lấy dữ liệu từ API ---
>>>>>>> main
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

  // --- Debounce search ---
  const debouncedSearch = useCallback(
    debounce((q) => fetchProducts(q), 500),
    []
  );

  // --- Toggle Wishlist ---
  const handleToggleWishlist = async (id) => {
    // Đổi màu ngay lập tức, không rollback nếu lỗi
    if (wishlist.includes(id)) {
      setWishlist((prev) => prev.filter((pid) => pid !== id));
      try {
        await removeFromWishlist(id);
        message.success("Đã xóa khỏi yêu thích");
      } catch (err) {
        message.error("Vui lòng đăng nhập Google để sử dụng tính năng này");
      }
    } else {
      setWishlist((prev) => [...prev, id]);
      try {
        await addToWishlist(id);
        message.success("Đã thêm vào yêu thích");
      } catch (err) {
        message.error("Vui lòng đăng nhập Google để sử dụng tính năng này");
      }
    }
  };

  // --- Khi gõ search ---
  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // --- Khi Enter search ---
  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchProducts(value);
  };

  // --- Lấy sản phẩm & wishlist ban đầu ---
  useEffect(() => {
    document.title = t("productList") + " - Bản Hương";
    fetchProducts();

    const token = localStorage.getItem("token");
    if (token) {
      getWishlist()
        .then((res) => {
          const favIds = res.data.map((item) => item.productId);
          setWishlist(favIds);
        })
        .catch(() => {
          console.warn("Không thể tải wishlist (chưa login Google?)");
        });
    }
  }, []);

  // --- Lọc + sắp xếp ---
  useEffect(() => {
    let data = [...products];

    // lọc theo giá
    data = data.filter(
      (p) => p.unitPrice >= priceRange[0] && p.unitPrice <= priceRange[1]
    );

    // sắp xếp
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

  // --- Phân trang ---
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <>
      <MainHeader />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0fdf4 0%, #fef9c3 100%)",
          padding: "32px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          {/* Thanh công cụ */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              marginBottom: 32,
              background: "rgba(255,255,255,0.85)",
              borderRadius: 16,
              boxShadow: "0 2px 16px rgba(22,101,52,0.07)",
              padding: 20,
            }}
          >
<<<<<<< HEAD
            {/* Search */}
=======
            {/* Ô tìm kiếm */}
>>>>>>> main
            <Search
              placeholder={t("searchPlaceholder")}
              allowClear
              enterButton={t("searchButton")}
              value={searchTerm}
              onChange={handleChangeSearch}
              onSearch={handleSearch}
<<<<<<< HEAD
              style={{ maxWidth: 340, flex: 1 }}
              className="custom-search"
              size="large"
            />

            {/* Bộ lọc giá */}
            <div style={{ width: 260, minWidth: 200 }}>
              <div
                style={{ fontWeight: 500, color: "#166534", marginBottom: 4 }}
              >
                Khoảng giá:{" "}
                <span style={{ color: "#ea580c" }}>
                  {priceRange[0].toLocaleString()} đ -{" "}
                  {priceRange[1].toLocaleString()} đ
                </span>
              </div>
              <Slider
                range
                min={0}
                max={1000000}
                step={5000}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
                tooltip={{ formatter: (v) => `${v.toLocaleString()} đ` }}
=======
              style={{
                maxWidth: 340,
                flex: 1,
                borderRadius: 16,
                background: "rgba(255,255,255,0.97)",
                boxShadow: "0 2px 12px rgba(22,101,52,0.10)",
                padding: "2px 8px",
                border: "1.5px solid #a7f3d0",
                fontSize: 17,
                fontWeight: 500,
              }}
              className="custom-search"
              size="large"
            />

          {/* Bộ lọc giá */}
          <div style={{ width: 260, minWidth: 200 }}>
            <div style={{ fontWeight: 500, color: "#166534", marginBottom: 4 }}>
              Khoảng giá:{" "}
              <span style={{ color: "#ea580c" }}>
                {priceRange[0].toLocaleString()} đ -{" "}
                {priceRange[1].toLocaleString()} đ
              </span>
            </div>
            <Slider
              range
              min={0}
              max={100000}
              step={5000}
              value={priceRange}
              onChange={(value) => setPriceRange(value)}
              tooltip={{ formatter: (v) => `${v.toLocaleString()} đ` }}
            />
          </div>

            {/* Bộ lọc sắp xếp */}
            <Select
              value={sortOption}
              onChange={(value) => setSortOption(value)}
              style={{ width: 200 }}
              size="large"
            >
              <Option value="latest">{t("sortLatest")}</Option>
              <Option value="priceAsc">{t("sortPriceAsc")}</Option>
              <Option value="priceDesc">{t("sortPriceDesc")}</Option>
              <Option value="nameAsc">{t("sortNameAsc")}</Option>
              <Option value="nameDesc">{t("sortNameDesc")}</Option>
            </Select>
          </div>

        {/* Danh sách sản phẩm */}
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
                    style={{
                      borderRadius: 18,
                      boxShadow: "0 4px 24px rgba(22,101,52,0.08)",
                      overflow: "hidden",
                      background: "#fff",
                      transition: "box-shadow 0.2s",
                      cursor: "pointer",
                    }}
                    cover={
                      <div style={{ position: "relative" }}>
                        <img
                          alt={p.productName}
                          // Lấy ảnh đầu tiên trong mảng productImgs nếu có, nếu không thì dùng productImg hoặc ảnh mặc định
                          src={
                            Array.isArray(p.productImgs) && p.productImgs.length > 0
                              ? p.productImgs[0]
                              : p.productImg || "/default-product.png"
                          }
                          style={{
                            height: 210,
                            objectFit: "cover",
                            width: "100%",
                            borderTopLeftRadius: 18,
                            borderTopRightRadius: 18,
                            transition: "transform 0.3s",
                          }}
                          className="product-img"
                        />
                        {p.isHot && (
                          <Tag
                            color="red"
                            style={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              fontWeight: 700,
                              fontSize: 13,
                              borderRadius: 8,
                              padding: "2px 10px",
                              background: "#dc2626",
                              color: "#fff",
                              border: "none",
                              boxShadow: "0 2px 8px rgba(220,38,38,0.12)",
                            }}
                            icon={<FireOutlined />}
                          >
                            HOT
                          </Tag>
                        )}
                        {p.oldPrice && p.unitPrice < p.oldPrice && (
                          <Tag
                            color="orange"
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              fontWeight: 700,
                              fontSize: 13,
                              borderRadius: 8,
                              padding: "2px 10px",
                              background: "#f59e42",
                              color: "#fff",
                              border: "none",
                              boxShadow: "0 2px 8px rgba(245,158,66,0.12)",
                            }}
                          >
                            Giảm giá
                          </Tag>
                        )}

                        {/* Nút wishlist */}
      <div style={{ position: "absolute", top: 12, right: 12 }}>
        <WishlistButton productId={p.id} />
      </div>
                      </div>
                    }
                    onClick={() => handleProductClick(p.id)}
                  >
                    <Title
                      level={5}
                      style={{
                        marginBottom: 6,
                        fontWeight: 700,
                        color: "#166534",
                      }}
                    >
                      <Tooltip title={p.productName}>{p.productName}</Tooltip>
                    </Title>
                    {p.oldPrice && p.unitPrice < p.oldPrice && (
                      <div style={{ marginBottom: 2 }}>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "#b91c1c",
                            fontSize: 14,
                          }}
                        >
                          {p.oldPrice.toLocaleString()} đ
                        </span>
                        <span
                          style={{
                            background: "#fee2e2",
                            color: "#dc2626",
                            fontWeight: 600,
                            fontSize: 13,
                            borderRadius: 6,
                            padding: "2px 8px",
                            marginLeft: 8,
                          }}
                        >
                          -
                          {Math.round(
                            100 - (p.unitPrice / p.oldPrice) * 100
                          )}
                          %
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        color: "#ea580c",
                        fontWeight: 700,
                        fontSize: 18,
                        marginBottom: 8,
                      }}
                    >
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
                        style={{ borderRadius: 8 }}
                      />
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        style={{
                          borderRadius: 8,
                          fontWeight: 600,
                          background:
                            "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                          border: "none",
                          boxShadow: "0 2px 8px rgba(22,101,52,0.10)",
                        }}
                      >
                        Thêm
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Phân trang */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 40,
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredProducts.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                style={{
                  borderRadius: 12,
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(22,101,52,0.07)",
                  padding: "8px 24px",
                }}
>>>>>>> main
              />
            </div>

            {/* Bộ lọc sắp xếp */}
            <Select
              value={sortOption}
              onChange={(value) => setSortOption(value)}
              style={{ width: 200 }}
              size="large"
            >
              <Option value="latest">{t("sortLatest")}</Option>
              <Option value="priceAsc">{t("sortPriceAsc")}</Option>
              <Option value="priceDesc">{t("sortPriceDesc")}</Option>
              <Option value="nameAsc">{t("sortNameAsc")}</Option>
              <Option value="nameDesc">{t("sortNameDesc")}</Option>
            </Select>
          </div>

          {/* Danh sách sản phẩm */}
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
                      style={{
                        borderRadius: 18,
                        boxShadow: "0 4px 24px rgba(22,101,52,0.08)",
                        overflow: "hidden",
                        background: "#fff",
                      }}
                      cover={
                        <div style={{ position: "relative" }}>
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
                            className="product-img"
                          />
                          {p.isHot && (
                            <Tag
                              color="red"
                              style={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                              }}
                              icon={<FireOutlined />}
                            >
                              HOT
                            </Tag>
                          )}
                          {p.oldPrice && p.unitPrice < p.oldPrice && (
                            <Tag
                              color="orange"
                              style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                              }}
                            >
                              Giảm giá
                            </Tag>
                          )}
                        </div>
                      }
                      onClick={() => handleProductClick(p.id)}
                    >
                      <Title level={5} style={{ marginBottom: 6 }}>
                        <Tooltip title={p.productName}>{p.productName}</Tooltip>
                      </Title>

                      {/* Giá */}
                      {p.oldPrice && p.unitPrice < p.oldPrice && (
                        <div style={{ marginBottom: 2 }}>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#b91c1c",
                            }}
                          >
                            {p.oldPrice.toLocaleString()} đ
                          </span>
                          <span
                            style={{
                              background: "#fee2e2",
                              color: "#dc2626",
                              fontWeight: 600,
                              fontSize: 13,
                              borderRadius: 6,
                              padding: "2px 8px",
                              marginLeft: 8,
                            }}
                          >
                            -
                            {Math.round(100 - (p.unitPrice / p.oldPrice) * 100)}
                            %
                          </span>
                        </div>
                      )}
                      <div style={{ color: "#ea580c", fontWeight: 700 }}>
                        {p.unitPrice.toLocaleString()} đ
                      </div>

                      {/* Nút chức năng */}
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
                        />
                        {/* Nút yêu thích */}
                        <Button
                          type="text"
                          icon={
                            wishlist.includes(p.id) ? (
                              <HeartFilled
                                style={{ color: "red", fontSize: 20 }}
                              />
                            ) : (
                              <HeartOutlined
                                style={{ color: "gray", fontSize: 20 }}
                              />
                            )
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWishlist(p.id);
                          }}
                        />
                        {/* Nút giỏ hàng */}
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          style={{ borderRadius: 8 }}
                        >
                          Thêm
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Phân trang */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 40,
                }}
              >
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredProducts.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </div>

        <style>{`
          .product-card:hover .product-img {
            transform: scale(1.06);
            transition: transform 0.3s;
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}

export default ProductList;
