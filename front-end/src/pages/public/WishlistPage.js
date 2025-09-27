import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, message, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/wishlists/me", {
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

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/wishlists/${id}`, {
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <Row gutter={[16, 16]}>
          {wishlist.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
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
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={item.product.productName}
                  description={
                    <>
                      <div>Price: {item.product.unitPrice} VND</div>
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
