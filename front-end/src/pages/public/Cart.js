import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  message,
  Button,
  InputNumber,
  Input,
  Tag,
  Space,
  Empty,
  Alert,
} from "antd";
import { DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import { Navigate, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState(""); // State để hiện lỗi trực tiếp trên UI

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
      console.log("Cart data:", data); // Debug
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật số lượng
  const handleUpdateQty = async (productId, qty) => {
    if (qty < 1) {
      message.warning("Số lượng phải lớn hơn 0");
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: qty } : item
      )
    );

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: qty }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");
      message.success("Đã cập nhật số lượng");
    } catch (err) {
      message.error(err.message);
      fetchCart();
    }
  };

  // Xóa sản phẩm
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

  // Áp dụng mã khuyến mãi
  const handleApplyPromo = async () => {
    // Reset error trước
    setPromoError("");

    // Validation
    if (!promoCode.trim()) {
      setPromoError("⚠️ Vui lòng nhập mã khuyến mãi");
      message.warning("Vui lòng nhập mã khuyến mãi");
      return;
    }

    // Kiểm tra nếu mã đã được áp dụng
    if (appliedPromoCode === promoCode.trim()) {
      setPromoError("ℹ️ Mã này đã được áp dụng rồi!");
      message.info("Mã này đã được áp dụng rồi!");
      return;
    }

    setPromoLoading(true);

    try {
      console.log("Applying promo code:", promoCode.trim()); // Debug

      const res = await fetch("http://localhost:5000/api/promotions/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      });

      console.log("Response status:", res.status); // Debug

      const data = await res.json();
      console.log("Response data:", data); // Debug

      if (!res.ok) {
        // Xử lý các trường hợp lỗi
        let errorMsg = "";

        if (res.status === 404) {
          errorMsg = "❌ Mã khuyến mãi không tồn tại";
        } else if (res.status === 400) {
          errorMsg = "❌ " + (data.message || "Mã khuyến mãi không hợp lệ");
        } else if (res.status === 410) {
          errorMsg = "❌ Mã khuyến mãi đã hết hạn";
        } else {
          errorMsg = "❌ " + (data.message || "Mã khuyến mãi không hợp lệ");
        }

        // Hiển thị lỗi trên UI
        setPromoError(errorMsg);

        // Hiển thị message notification
        message.error({
          content: errorMsg,
          duration: 4,
          style: {
            marginTop: "20vh",
          },
        });

        // Reset discount
        setDiscountPercent(0);
        setAppliedPromoCode("");
        return;
      }

      // Áp dụng thành công
      setDiscountPercent(data.discountPercent || 0);
      setAppliedPromoCode(promoCode.trim());
      setPromoError(""); // Clear error

      message.success({
        content: `✅ ${data.message || "Áp dụng mã thành công!"} - Giảm ${
          data.discountPercent
        }%`,
        duration: 4,
        style: {
          marginTop: "20vh",
        },
      });
    } catch (err) {
      console.error("Error applying promo:", err);
      const errorMsg = "❌ Có lỗi xảy ra khi áp dụng mã khuyến mãi";
      setPromoError(errorMsg);
      message.error({
        content: errorMsg,
        duration: 4,
        style: {
          marginTop: "20vh",
        },
      });
      setDiscountPercent(0);
      setAppliedPromoCode("");
    } finally {
      setPromoLoading(false);
    }
  };

  // Xóa mã khuyến mãi
  const handleRemovePromo = () => {
    setPromoCode("");
    setAppliedPromoCode("");
    setDiscountPercent(0);
    setPromoError("");
    message.info("Đã xóa mã khuyến mãi");
  };

  // Helper function để lấy đường dẫn ảnh đúng
  const getImageUrl = (productImg) => {
    if (!productImg) return "/default-product.png";

    // Nếu đã có http/https thì return luôn
    if (productImg.startsWith("http")) return productImg;

    // Nếu bắt đầu bằng /uploads thì thêm domain
    if (productImg.startsWith("/uploads")) {
      return `http://localhost:5000${productImg}`;
    }

    // Nếu chỉ có tên file
    return `http://localhost:5000/uploads/${productImg}`;
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <>
        <MainHeader />
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" tip="Đang tải giỏ hàng..." />
        </div>
        <Footer />
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <MainHeader />
        <div style={{ maxWidth: 1200, margin: "50px auto", padding: 20 }}>
          <Empty
            description="Giỏ hàng của bạn đang trống"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              onClick={() => (window.location.href = "/products")}
            >
              Tiếp tục mua sắm
            </Button>
          </Empty>
        </div>
        <Footer />
      </>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * Number(item.product?.unitPrice || 0),
    0
  );

  const discountAmount = Math.round((total * discountPercent) / 100);
  const finalTotal = total - discountAmount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <MainHeader />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <h2 style={{ marginBottom: 20, fontSize: 24, fontWeight: 600 }}>
          Giỏ hàng của bạn ({totalItems} sản phẩm)
        </h2>

        <Row gutter={[16, 16]}>
          {cart.map((item) => {
            console.log("Product image path:", item.product?.productImg); // Debug

            return (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <div
                      style={{
                        height: 200,
                        overflow: "hidden",
                        background: "#f5f5f5",
                      }}
                    >
                      <img
                        alt={item.product?.productName || "Product"}
                        src={getImageUrl(item.product?.productImg)}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          console.error(
                            "Image load error for:",
                            item.product?.productImg
                          );
                          e.target.onerror = null;
                          e.target.src = "/default-product.png";
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(item.productId)}
                      size="small"
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {item.product?.productName || "Sản phẩm"}
                      </div>
                    }
                    description={
                      <>
                        <div style={{ color: "#ff4d4f", fontWeight: 600 }}>
                          {Number(item.product?.unitPrice || 0).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          đ
                        </div>
                        <div
                          style={{
                            marginTop: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 12 }}>Số lượng:</span>
                          <InputNumber
                            min={1}
                            max={item.product?.quantity || 99}
                            value={item.quantity}
                            onChange={(val) =>
                              handleUpdateQty(item.productId, val)
                            }
                            size="small"
                          />
                        </div>
                        <div
                          style={{ marginTop: 4, fontSize: 12, color: "#666" }}
                        >
                          Tổng:{" "}
                          {(
                            item.quantity * Number(item.product?.unitPrice || 0)
                          ).toLocaleString("vi-VN")}{" "}
                          đ
                        </div>
                      </>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Tổng tiền + Khuyến mãi */}
        <div
          style={{
            marginTop: 30,
            padding: 24,
            background: "#fafafa",
            borderRadius: 12,
            border: "1px solid #e8e8e8",
          }}
        >
          {/* Hiển thị mã đã áp dụng */}
          {appliedPromoCode && (
            <div style={{ marginBottom: 16 }}>
              <Tag
                color="success"
                icon={<CheckCircleOutlined />}
                closable
                onClose={handleRemovePromo}
                style={{ fontSize: 14, padding: "4px 12px" }}
              >
                Mã khuyến mãi: <strong>{appliedPromoCode}</strong> (-
                {discountPercent}%)
              </Tag>
            </div>
          )}

          {/* Thống kê giá */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontWeight: 400,
                fontSize: 16,
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Tạm tính:</span>
              <span>{total.toLocaleString("vi-VN")} đ</span>
            </div>

            {discountPercent > 0 && (
              <div
                style={{
                  fontWeight: 400,
                  fontSize: 16,
                  color: "#ff4d4f",
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Giảm giá ({discountPercent}%):</span>
                <span>-{discountAmount.toLocaleString("vi-VN")} đ</span>
              </div>
            )}

            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: "#166534",
                marginTop: 12,
                paddingTop: 12,
                borderTop: "2px solid #d9d9d9",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Tổng cộng:</span>
              <span>{finalTotal.toLocaleString("vi-VN")} đ</span>
            </div>

            <div
              style={{
                fontWeight: 400,
                fontSize: 14,
                marginTop: 4,
                color: "#666",
              }}
            >
              ({totalItems} sản phẩm)
            </div>
          </div>

          {/* Ô nhập mã khuyến mãi */}
          {!appliedPromoCode && (
            <div
              style={{
                marginTop: 20,
                paddingTop: 20,
                borderTop: "1px solid #e8e8e8",
              }}
            >
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                Mã khuyến mãi:
              </div>

              {/* Hiển thị lỗi trực tiếp trên UI */}
              {promoError && (
                <Alert
                  message={promoError}
                  type={promoError.includes("✅") ? "success" : "error"}
                  showIcon
                  closable
                  onClose={() => setPromoError("")}
                  style={{ marginBottom: 12 }}
                />
              )}

              <Space.Compact style={{ width: "100%" }}>
                <Input
                  placeholder="Nhập mã khuyến mãi (VD: SALE20)"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError(""); // Clear error khi user gõ
                  }}
                  onPressEnter={handleApplyPromo}
                  disabled={promoLoading}
                  maxLength={20}
                  size="large"
                />
                <Button
                  type="primary"
                  onClick={handleApplyPromo}
                  loading={promoLoading}
                  disabled={!promoCode.trim()}
                  size="large"
                >
                  {promoLoading ? "Đang kiểm tra..." : "Áp dụng"}
                </Button>
              </Space.Compact>
            </div>
          )}

          {/* Nút hành động */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={() => (window.location.href = "/products")}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                height: 44,
                flex: 1,
                minWidth: 150,
              }}
            >
              Tiếp tục mua hàng
            </Button>
            <Button
              type="primary"
              onClick={() => (window.location.href = "/checkout")}
              disabled={cart.length === 0}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                height: 44,
                flex: 1,
                minWidth: 150,
                background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                border: "none",
              }}
            >
              Đặt hàng ngay ({finalTotal.toLocaleString("vi-VN")} đ)
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
