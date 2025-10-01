import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, message, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // <-- import
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";

const API_URL = process.env.REACT_APP_API_URL;

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- tạo navigate

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wishlists/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lấy wishlist thất bại");
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error(err);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wishlists/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      message.success("Đã xóa khỏi wishlist");
      fetchWishlist();
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`); // <-- chuyển hướng
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <>
      <MainHeader />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 20,
          minHeight: "380px",
        }}
      >
        <Row gutter={[16, 16]}>
          {wishlist.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                onClick={() => handleCardClick(item.product.id)} // <-- thêm
                cover={
                  item.product.productImg ? (
                    <img
                      alt={item.product.productName}
                      src={item.product.productImg}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 200,
                        background: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                      }}
                    >
                      No Image
                    </div>
                  )
                }
                actions={[
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation(); // <-- quan trọng: ngăn click Card
                      handleRemove(item.product.id);
                    }}
                  >
                    Remove
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={item.product.productName}
                  description={
                    <>
                      <div>
                        Price:{" "}
                        {Number(item.product.unitPrice).toLocaleString("vi-VN")}{" "}
                        đ
                      </div>
                      <div>Quantity: {item.product.quantity}</div>
                      {item.product.description && (
                        <div>{item.product.description}</div>
                      )}
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
