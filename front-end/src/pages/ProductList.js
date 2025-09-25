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
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

function ProductList() {
  const [products, setProducts] = useState([]); // toàn bộ dữ liệu từ server
  const [filteredProducts, setFilteredProducts] = useState([]); // sau khi lọc & sort
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
    debouncedSearch(value); // gọi API realtime
  };

  // --- Khi nhấn Enter hoặc bấm nút Tìm kiếm ---
  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchProducts(value); // gọi API ngay
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
    setCurrentPage(1); // reset về trang 1 khi filter/sort thay đổi
  }, [products, sortOption, priceRange]);

  // --- Phân trang ---
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      {/* Thanh công cụ */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Ô tìm kiếm */}
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          allowClear
          enterButton="Tìm kiếm"
          value={searchTerm}
          onChange={handleChangeSearch} // realtime
          onSearch={handleSearch} // enter / nút
          style={{ maxWidth: 400 }}
        />

        {/* Bộ lọc giá */}
        <div style={{ width: 300 }}>
          <p>
            Khoảng giá: {priceRange[0].toLocaleString()} đ -{" "}
            {priceRange[1].toLocaleString()} đ
          </p>
          <Slider
            range
            min={0}
            max={1000000}
            step={50000}
            value={priceRange}
            onChange={(value) => setPriceRange(value)}
          />
        </div>

        {/* Bộ lọc sắp xếp */}
        <Select
          value={sortOption}
          onChange={(value) => setSortOption(value)}
          style={{ width: 200 }}
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
        <Spin tip="Đang tải sản phẩm..." />
      ) : (
        <>
          <Row gutter={[20, 20]}>
            {currentProducts.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={p.productName}
                      src={p.productImg || "/default-product.png"}
                      style={{ height: 220, objectFit: "cover" }}
                    />
                  }
                >
                  <Title level={5}>{p.productName}</Title>
                  {p.oldPrice && (
                    <p
                      style={{ textDecoration: "line-through", color: "gray" }}
                    >
                      {p.oldPrice.toLocaleString()} đ
                    </p>
                  )}
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    {p.unitPrice.toLocaleString()} đ
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <InputNumber min={1} max={99} defaultValue={1} />
                    <Button type="primary" icon={<ShoppingCartOutlined />}>
                      Thêm
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Phân trang */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
