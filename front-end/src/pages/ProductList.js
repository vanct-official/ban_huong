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
  Badge,
} from "antd";
import { ShoppingCartOutlined, FireOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // --- Lấy dữ liệu từ API ---
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

  // --- Debounce để tránh gọi API quá nhiều ---
  const debouncedSearch = useCallback(
    debounce((q) => fetchProducts(q), 500),
    []
  );

  // --- Khi gõ trong ô search ---
  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // --- Khi nhấn Enter hoặc bấm nút Tìm kiếm ---
  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchProducts(value);
  };

  // --- Lần đầu load toàn bộ sản phẩm ---
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Lọc + sắp xếp dữ liệu ---
  useEffect(() => {
    let data = [...products];

    // lọc theo khoảng giá
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

  return (
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
          {/* Ô tìm kiếm */}
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton="Tìm kiếm"
            value={searchTerm}
            onChange={handleChangeSearch}
            onSearch={handleSearch}
            style={{ maxWidth: 340, flex: 1 }}
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
            <Option value="latest">Mới nhất</Option>
            <Option value="priceAsc">Giá: Thấp → Cao</Option>
            <Option value="priceDesc">Giá: Cao → Thấp</Option>
            <Option value="nameAsc">Tên: A → Z</Option>
            <Option value="nameDesc">Tên: Z → A</Option>
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
                    }}
                    cover={
                      <div style={{ position: "relative" }}>
                        <img
                          alt={p.productName}
                          src={p.productImg || "/default-product.png"}
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
                      </div>
                    }
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
              />
            </div>
          </>
        )}
      </div>
      {/* Hiệu ứng hover cho ảnh sản phẩm */}
      <style>{`
        .product-card:hover .product-img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
}

export default ProductList;
