import React, { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../services/api";
import { Card, Button, Row, Col, Typography, Spin, message } from "antd";
import { HeartFilled } from "@ant-design/icons";
import MainHeader from "../components/MainHeader";
import Footer from "../components/Footer";

const { Title } = Typography;

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await getWishlist();
      setItems(data);
    } catch (err) {
      console.error("❌ Lỗi khi tải wishlist:", err);
      message.error("Không thể tải wishlist. Vui lòng đăng nhập Google!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setItems(items.filter((i) => i.productId !== productId));
      message.success("Đã xóa khỏi wishlist");
    } catch (err) {
      message.error("Không thể xóa sản phẩm này");
    }
  };

  return (
    <>
      <MainHeader />
      <div
        style={{ padding: "32px", minHeight: "80vh", background: "#f9fafb" }}
      >
        <Title level={2} style={{ marginBottom: 24 }}>
          Danh sách Yêu thích ❤️
        </Title>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : items.length === 0 ? (
          <p>Bạn chưa có sản phẩm nào trong wishlist.</p>
        ) : (
          <Row gutter={[24, 24]}>
            {items.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item.Product?.productName}
                      src={item.Product?.productImg || "/default-product.png"}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                  actions={[
                    <Button
                      type="text"
                      icon={<HeartFilled style={{ color: "red" }} />}
                      onClick={() => handleRemove(item.productId)}
                    >
                      Bỏ thích
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={item.Product?.productName}
                    description={`${item.Product?.unitPrice.toLocaleString()} đ`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Wishlist;
