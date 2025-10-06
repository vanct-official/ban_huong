import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";

const API_URL = process.env.REACT_APP_API_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPromo, setSelectedPromo] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const shippingFee = 30000;
  const [paymentMethod, setPaymentMethod] = useState("PayOS");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Lấy giỏ hàng
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy giỏ hàng:", err);
      }
    };
    if (token) fetchCart();
  }, [token]);

  // ✅ Lấy địa chỉ giao hàng
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/addresses/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setAddresses(data);

        // Chọn địa chỉ mặc định nếu có
        const defaultAddr =
          Array.isArray(data) && data.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr.id.toString());
        } else if (Array.isArray(data) && data.length > 0) {
          setSelectedAddress(data[0].id.toString());
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy địa chỉ:", err);
      }
    };
    if (token) fetchAddresses();
  }, [token]);

  // ✅ Lấy danh sách khuyến mãi
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/promotions/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPromotions(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách mã giảm giá:", err);
      }
    };
    fetchPromotions();
  }, [token]);

  // ✅ Tính tổng tiền giỏ hàng
  const calculateSubtotal = () =>
    cartItems.reduce(
      (sum, item) => sum + Number(item.product?.unitPrice || 0) * item.quantity,
      0
    );

  // ✅ Khi chọn mã giảm giá
  const handleSelectPromo = (e) => {
    const promoId = e.target.value;
    setSelectedPromo(promoId);
    const promo = promotions.find((p) => p.id === Number(promoId));
    if (promo) {
      const subtotal = calculateSubtotal();
      // Nếu chưa đủ điều kiện thì không giảm giá
      if (subtotal < promo.minOrderValue) {
        setDiscountAmount(0);
      } else {
        const discount = (subtotal * parseFloat(promo.discountPercent)) / 100;
        setDiscountAmount(discount);
      }
    } else {
      setDiscountAmount(0);
    }
  };

  // ✅ Xử lý khi ấn nút thanh toán
  const handleCheckout = async () => {
    try {
      if (!addresses.length) {
        alert(
          "Bạn chưa có địa chỉ giao hàng. Vui lòng vào 'Cập nhật thông tin' để thêm địa chỉ trước khi thanh toán!"
        );
        navigate("/profile/edit");
        return;
      }

      if (!selectedAddress) {
        alert("Vui lòng chọn địa chỉ giao hàng!");
        return;
      }

      setLoading(true);

      const subtotal = calculateSubtotal();
      const totalAmount = subtotal + shippingFee - discountAmount;

      const payload = {
        addressId: selectedAddress,
        promotionId: selectedPromo || null,
        discountAmount,
        shippingAmount: shippingFee,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.product?.id || item.productId,
          name: item.product?.productName || item.name,
          quantity: item.quantity,
          price: Number(item.product?.unitPrice || item.price),
        })),
      };

      if (paymentMethod === "PayOS") {
        const res = await axios.post(`${API_URL}/api/orders`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.payos?.checkoutUrl) {
          // Redirect sang PayOS
          window.location.href = res.data.payos.checkoutUrl;
        } else {
          alert("Không nhận được link thanh toán PayOS!");
        }
      } else {
        // COD → đơn hàng tạo xong, redirect thành công luôn
        const res = await axios.post(`${API_URL}/api/orders`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate("/checkout-success", { state: { orderId: res.data.orderId } });
      }
    } catch (err) {
      console.error("❌ Lỗi khi thanh toán:", err);
      alert("Thanh toán thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const finalTotal =
    calculateSubtotal() + Number(shippingFee) - Number(discountAmount);

  return (
    <>
      <MainHeader />
      <div
        className="checkout-container"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(60,60,120,0.10)",
          padding: "32px 24px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 32,
            fontWeight: 700,
            color: "#166534",
          }}
        >
          Thanh toán đơn hàng
        </h2>

        {/* ✅ Sản phẩm */}
        <div className="checkout-items" style={{ marginBottom: 24 }}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>
              Giỏ hàng trống.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="checkout-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f9fafb",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 12,
                  boxShadow: "0 2px 8px rgba(60,60,120,0.06)",
                }}
              >
                <img
                  src={item.product?.productImg}
                  alt={item.product?.productName}
                  width="80"
                  style={{
                    borderRadius: 8,
                    marginRight: 16,
                    background: "#fff",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      color: "#111",
                      fontSize: 18,
                    }}
                  >
                    {item.product?.productName}
                  </h4>
                  <p style={{ margin: "4px 0", color: "#666" }}>
                    Số lượng: <b>{item.quantity}</b>
                  </p>
                  <p
                    style={{
                      margin: "4px 0",
                      color: "#ea580c",
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    Giá: {Number(item.product?.unitPrice || 0).toLocaleString()}
                    ₫
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Địa chỉ */}
        <div className="checkout-section" style={{ marginBottom: 24 }}>
          <label
            style={{
              fontWeight: 600,
              marginBottom: 6,
              display: "block",
              color: "#111",
            }}
          >
            Chọn địa chỉ giao hàng:
          </label>
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 16,
              background: "#f3f4f6",
            }}
          >
            <option value="">-- Chọn địa chỉ --</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.street}, {addr.ward}, {addr.province}
                {addr.isDefault ? " (Mặc định)" : ""}
              </option>
            ))}
          </select>

          {addresses.length === 0 && (
            <div style={{ marginTop: 8, color: "red", fontWeight: 500 }}>
              Bạn chưa có địa chỉ giao hàng.{" "}
              <span
                onClick={() => navigate("/profile/edit")}
                style={{
                  color: "#166534",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Cập nhật thông tin
              </span>{" "}
              để thêm địa chỉ mới.
            </div>
          )}
        </div>

        {/* ✅ Mã giảm giá */}
        <div className="checkout-section" style={{ marginBottom: 24 }}>
          <label
            style={{
              fontWeight: 600,
              marginBottom: 6,
              display: "block",
              color: "#111",
            }}
          >
            Chọn mã giảm giá:
          </label>
          <select
            value={selectedPromo}
            onChange={handleSelectPromo}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 16,
              background: "#f3f4f6",
            }}
          >
            <option value="">-- Không áp dụng --</option>
            {promotions.map((promo) => (
              <option key={promo.id} value={promo.id}>
                {promo.promotionName} - Giảm {promo.discountPercent}%
                {promo.minOrderValue > 0
                  ? ` (Đơn từ ${promo.minOrderValue.toLocaleString()}₫)`
                  : ""}
              </option>
            ))}
          </select>
          {selectedPromo && (
            <div
              style={{
                color: "#16a34a",
                fontWeight: 600,
                marginTop: 6,
                fontSize: 16,
              }}
            >
              Giảm giá: -{discountAmount.toLocaleString()}₫
            </div>
          )}
        </div>

        {/* ✅ Phương thức thanh toán */}
        <div className="checkout-section" style={{ marginBottom: 24 }}>
          <label
            style={{
              fontWeight: 600,
              marginBottom: 6,
              display: "block",
              color: "#111",
            }}
          >
            Phương thức thanh toán:
          </label>
          <div style={{ display: "flex", gap: 24 }}>
            <label style={{ fontWeight: 500, color: "#111" }}>
              <input
                type="radio"
                value="PayOS"
                checked={paymentMethod === "PayOS"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ marginRight: 8 }}
              />
              PayOS (Online)
            </label>
            <label style={{ fontWeight: 500, color: "#111" }}>
              <input
                type="radio"
                value="Cash"
                checked={paymentMethod === "Cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ marginRight: 8 }}
              />
              Tiền mặt (Khi nhận hàng)
            </label>
          </div>
        </div>

        {/* ✅ Tổng kết đơn hàng */}
        <div
          className="checkout-summary"
          style={{
            background: "#f9fafb",
            borderRadius: 12,
            padding: "18px 16px",
            marginBottom: 24,
            boxShadow: "0 2px 8px rgba(60,60,120,0.06)",
          }}
        >
          <p style={{ fontWeight: 500, marginBottom: 6 }}>
            Tổng hàng:{" "}
            <span
              style={{
                textDecoration: discountAmount > 0 ? "line-through" : "none",
                color: "#444",
              }}
            >
              {calculateSubtotal().toLocaleString()}₫
            </span>
            {discountAmount > 0 && (
              <span
                style={{
                  color: "#16a34a",
                  fontWeight: 700,
                  marginLeft: 8,
                  fontSize: 16,
                }}
              >
                {(calculateSubtotal() - discountAmount).toLocaleString()}₫
              </span>
            )}
          </p>
          <p style={{ fontWeight: 500, marginBottom: 6 }}>
            Phí vận chuyển:{" "}
            <span style={{ color: "#166534" }}>
              {shippingFee.toLocaleString()}₫
            </span>
          </p>
          <p style={{ fontWeight: 500, marginBottom: 6 }}>
            Giảm giá:{" "}
            <span style={{ color: "#e11d48" }}>
              -{discountAmount.toLocaleString()}₫
            </span>
          </p>
          <h3
            style={{
              fontWeight: 700,
              color: "#ea580c",
              marginTop: 12,
              fontSize: 22,
            }}
          >
            Thành tiền: {finalTotal.toLocaleString()}₫
          </h3>
        </div>

        {/* ✅ Nút thanh toán */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="checkout-btn"
          style={{
            width: "100%",
            padding: "14px 0",
            fontSize: 18,
            fontWeight: 700,
            borderRadius: 10,
            background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
            color: "#fff",
            border: "none",
            boxShadow: "0 2px 12px rgba(22,101,52,0.15)",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Đang xử lý..."
            : paymentMethod === "PayOS"
            ? "Thanh toán qua PayOS"
            : "Đặt hàng (Tiền mặt)"}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
