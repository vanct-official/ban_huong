import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, message, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy giỏ hàng từ server
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lấy giỏ hàng thất bại");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      message.success("Đã xóa khỏi giỏ hàng");
      fetchCart();
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );

  // Tính tổng tiền
  const total = cart.reduce(
    (sum, item) => sum + item.quantity * Number(item.product?.unitPrice || 0),
    0
  );

  return (
    <>
      <MainHeader />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <Row gutter={[16, 16]}>
          {cart.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  item.product?.productImg ? (
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
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={item.product?.productName}
                  description={
                    <>
                      <div>
                        Price:{" "}
                        {Number(item.product?.unitPrice).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        đ
                      </div>
                      <div>Quantity: {item.quantity}</div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Tổng tiền */}
        <div
          style={{
            marginTop: 30,
            padding: 20,
            background: "#fafafa",
            borderRadius: 8,
            textAlign: "right",
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          Tổng tiền: {Number(total).toLocaleString("vi-VN")} đ
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <Button
              onClick={() => (window.location.href = "/products")}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              Tiếp tục mua hàng
            </Button>
            <Button
              type="primary"
              onClick={() => (window.location.href = "/checkout")}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                border: "none",
                marginTop: 10,
              }}
            >
              Đặt hàng ngay
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
