import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import { QRCodeSVG } from "qrcode.react";
import { Card, Button, Input, Spin, Alert, Divider, message, Radio, Select } from "antd";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import "./Checkout.css";

const API_URL = process.env.REACT_APP_API_URL;

const Checkout = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("payos"); // "payos" | "cod"
  const shippingFee = 30000; // Phí vận chuyển cố định

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.href,
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: null,
    embedded: true,
    onSuccess: () => {
      setIsOpen(false);
      setSuccessMsg("🎉 Thanh toán thành công! Đơn hàng của bạn đã được xử lý.");
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.warning("Vui lòng đăng nhập để thanh toán");
          window.location.href = "/login";
          return;
        }

        // Fetch user info
        const userRes = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUserInfo(userData.user);

        setShippingInfo({
          fullName: `${userData.user.firstname || ""} ${userData.user.middlename || ""} ${userData.user.lastname || ""}`.trim(),
          phone: userData.user.phone || "",
          address: "",
        });

        // Fetch cart items
        const cartRes = await fetch(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = await cartRes.json();
        setCartItems(Array.isArray(cartData) ? cartData : []);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/addresses/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          // Ưu tiên địa chỉ mặc định lên đầu
          const sorted = [...data].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
          setAddresses(sorted);
          // Chọn mặc định nếu có
          const defaultAddr = sorted.find(addr => addr.isDefault) || sorted[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setShippingInfo({
              fullName: userInfo
                ? `${userInfo.firstname || ""} ${userInfo.middlename || ""} ${userInfo.lastname || ""}`.trim()
                : "",
              phone: userInfo?.phone || "",
              address: `${defaultAddr.street}, ${defaultAddr.ward}, ${defaultAddr.province}`,
            });
          }
        }
      } catch (err) {
        setAddresses([]);
      }
    };

    fetchAddresses();
  }, [userInfo]);

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/promotions/available`);
        if (!res.ok) throw new Error("Không tải được mã khuyến mãi");
        const data = await res.json();
        setPromotions(data);
      } catch (err) {
        console.error(err);
        message.error(err.message);
      }
    };
    fetchPromotions();
  }, []);

  // Chuyển unitPrice thành integer
  const formatPrice = (unitPrice) => {
    if (!unitPrice) return 0;
    return Math.floor(Number(unitPrice));
  };

  const calculateSubtotal = () =>
    cartItems.reduce((sum, item) => {
      return sum + formatPrice(item.product.unitPrice) * parseInt(item.quantity);
    }, 0);

  // Tính giảm giá
  const getPromotionDiscount = () => {
    if (!selectedPromotionId) return 0;
    const promo = promotions.find(p => p.id === selectedPromotionId);
    if (!promo) return 0;
    const subtotal = calculateSubtotal();
    if (subtotal < promo.minOrderValue) return 0;
    // discountPercent là chuỗi, cần chuyển về số
    return Math.floor(subtotal * (parseFloat(promo.discountPercent) / 100));
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = getPromotionDiscount();
    return subtotal + shippingFee - discount;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Khi chọn địa chỉ mới
  const handleAddressChange = (id) => {
    setSelectedAddressId(id);
    const addr = addresses.find(a => a.id === id);
    if (addr) {
      setShippingInfo(prev => ({
        ...prev,
        address: `${addr.street}, ${addr.ward}, ${addr.province}`,
      }));
    }
  };

  // Tạo đơn hàng tiền mặt
  const handleCashOrder = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      message.warning("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }
    setIsCreatingLink(true);
    try {
      const token = localStorage.getItem("token");
      const formattedItems = cartItems.map((item) => ({
        name: item.product.productName,
        quantity: parseInt(item.quantity),
        price: formatPrice(item.product.unitPrice),
      }));

      const payload = {
        amount: calculateTotal(),
        description: `Đơn hàng ${cartItems.length} sản phẩm`,
        items: formattedItems,
        shippingInfo,
        paymentMethod: "cod",
        promotionCode: selectedPromotionId, // truyền mã khuyến mại
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Không nhận được phản hồi từ server");

      setSuccessMsg("🎉 Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt hàng!");
    } finally {
      setIsCreatingLink(false);
    }
  };

  // Tạo link thanh toán PayOS
  const handleGetPaymentLink = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      message.warning("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    setIsCreatingLink(true);
    exit();

    try {
      const token = localStorage.getItem("token");
      const formattedItems = cartItems.map((item) => ({
        name: item.product.productName,
        quantity: parseInt(item.quantity),
        price: formatPrice(item.product.unitPrice),
      }));

      const payload = {
        amount: calculateTotal(),
        description: `Đơn hàng ${cartItems.length} sản phẩm`,
        items: formattedItems,
        shippingInfo,
        paymentMethod: "payos",
        promotionCode: selectedPromotionId, // truyền mã khuyến mại
      };
      console.log("Payload gửi lên PayOS:", payload);

      const response = await fetch(`${API_URL}/api/create-embedded-payment-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Không nhận được phản hồi từ server");

      const result = await response.json();
      setPaymentInfo(result);
      setPayOSConfig((old) => ({ ...old, CHECKOUT_URL: result.checkoutUrl }));
      setIsOpen(true);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo link thanh toán!");
    } finally {
      setIsCreatingLink(false);
    }
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL && paymentMethod === "payos") open();
    // eslint-disable-next-line
  }, [payOSConfig, paymentMethod]);

  if (loading) {
    return (
      <div className="checkout-container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin tip="Đang tải..." size="large" />
      </div>
    );
  }

  if (successMsg) {
    return (
      <div className="checkout-container" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Alert type="success" message={successMsg} showIcon style={{ marginBottom: 24 }} />
        <Button type="primary" href="/">Quay về trang chủ</Button>
      </div>
    );
  }

  return (
    <>
      <MainHeader />
      <div
        className="checkout-container"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "32px 8px",
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        {/* Left: Thông tin đơn hàng */}
        <div style={{ flex: 1, minWidth: 340 }}>
          <Card
            title="Thanh toán đơn hàng"
            style={{
              borderRadius: 18,
              boxShadow: "0 8px 32px rgba(60,60,120,0.10)",
              border: "none",
              background: "rgba(255,255,255,0.98)",
              marginBottom: 24,
            }}
            bodyStyle={{ padding: "24px 18px" }}
          >
            {/* User Info */}
            {userInfo && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
                <img
                  src={userInfo.avatarImg}
                  alt={userInfo.username}
                  style={{ width: 54, height: 54, borderRadius: "50%", marginRight: 16, objectFit: "cover", background: "#f3f4f6" }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>{`${userInfo.firstname || ""} ${userInfo.middlename || ""} ${userInfo.lastname || ""}`.trim()}</div>
                  <div style={{ color: "#666" }}>{userInfo.email}</div>
                  <div style={{ color: "#666" }}>{userInfo.phone}</div>
                </div>
              </div>
            )}
            {/* Shipping Info */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Địa chỉ giao hàng</div>
              {/* Dropdown chọn địa chỉ */}
              <Select
                style={{ width: "100%", marginBottom: 8 }}
                placeholder="Chọn địa chỉ giao hàng"
                value={selectedAddressId}
                onChange={handleAddressChange}
              >
                {addresses.map(addr => (
                  <Select.Option key={addr.id} value={addr.id}>
                    {addr.street}, {addr.ward}, {addr.province}
                    {addr.isDefault && " (Mặc định)"}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <Divider />

            {/* Cart Items */}
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Sản phẩm trong giỏ hàng</div>
              {cartItems.length === 0 ? (
                <Alert type="info" message="Giỏ hàng của bạn đang trống." showIcon />
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: 14, background: "#f9fafb", borderRadius: 10, padding: 8 }}>
                    <img
                      src={item.product.productImg}
                      alt={item.product.productName}
                      style={{ width: 70, height: 70, objectFit: "cover", marginRight: 12, borderRadius: 8, background: "#fff" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{item.product.productName}</div>
                      <div style={{ color: "#ea580c", fontWeight: 600 }}>
                        {formatPrice(item.product.unitPrice).toLocaleString()} VNĐ x {item.quantity}
                      </div>
                      <div style={{ color: "#444" }}>
                        Tổng: {(formatPrice(item.product.unitPrice) * item.quantity).toLocaleString()} VNĐ
                      </div>
                    </div>
                  </div>
                ))
                )}
            </div>

            {/* Promotion Code - đặt ở giữa sản phẩm và tổng tiền */}
            <div style={{ margin: "24px 0" }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Mã khuyến mãi</div>
              <Select
                style={{ width: "100%", marginBottom: 8 }}
                placeholder="Chọn mã khuyến mãi"
                value={selectedPromotionId}
                onChange={setSelectedPromotionId}
                allowClear
              >
                {promotions.map(promo => (
                  <Select.Option key={promo.id} value={promo.id}>
                    {promo.promotionName} {promo.description ? `- ${promo.description}` : ""}
                    {promo.minOrderValue > 0 ? ` (Đơn từ ${promo.minOrderValue.toLocaleString()} VNĐ)` : ""}
                    {` - Giảm ${promo.discountPercent}%`}
                  </Select.Option>
                ))}
              </Select>
              {/* Hiển thị thông tin giảm giá nếu có */}
              {selectedPromotionId && (
                <div style={{ color: "#16a34a", fontWeight: 600 }}>
                  Giảm giá: {getPromotionDiscount().toLocaleString()} VNĐ
                </div>
              )}
              {/* Nếu không đủ điều kiện, báo cho người dùng */}
              {selectedPromotionId && (() => {
                const promo = promotions.find(p => p.id === selectedPromotionId);
                if (promo && calculateSubtotal() < promo.minOrderValue) {
                  return (
                    <div style={{ color: "#e11d48", fontWeight: 500 }}>
                      Đơn hàng chưa đủ điều kiện áp dụng mã này!
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <Divider />

            {/* Totals */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 500 }}>
                Tạm tính:{" "}
                <span style={{ color: "#166534", textDecoration: getPromotionDiscount() > 0 ? "line-through" : "none" }}>
                  {calculateSubtotal().toLocaleString()} VNĐ
                </span>
                {getPromotionDiscount() > 0 && (
                  <span style={{ color: "#16a34a", marginLeft: 8, fontWeight: 700 }}>
                    {(calculateSubtotal() - getPromotionDiscount()).toLocaleString()} VNĐ
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 500 }}>
                Phí vận chuyển: <span style={{ color: "#166534" }}>{shippingFee.toLocaleString()} VNĐ</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 4 }}>
                Tổng cộng: <span style={{ color: "#ea580c" }}>{calculateTotal().toLocaleString()} VNĐ</span>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Phương thức thanh toán</div>
              <Radio.Group
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                style={{ marginBottom: 8 }}
              >
                <Radio value="payos">Thanh toán qua PayOS (QR/online)</Radio>
                <Radio value="cod">Tiền mặt (Thanh toán khi nhận hàng)</Radio>
              </Radio.Group>
            </div>

            {/* Payment Button */}
            {!isOpen ? (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                {paymentMethod === "payos" ? (
                  <Button
                    type="primary"
                    size="large"
                    loading={isCreatingLink}
                    onClick={handleGetPaymentLink}
                    style={{
                      borderRadius: 10,
                      fontWeight: 700,
                      minWidth: 220,
                      background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                      border: "none",
                      boxShadow: "0 2px 12px rgba(22,101,52,0.15)",
                    }}
                  >
                    Thanh toán với PayOS
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    loading={isCreatingLink}
                    onClick={handleCashOrder}
                    style={{
                      borderRadius: 10,
                      fontWeight: 700,
                      minWidth: 220,
                      background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                      border: "none",
                      boxShadow: "0 2px 12px rgba(22,101,52,0.15)",
                    }}
                  >
                    Đặt hàng & Thanh toán khi nhận hàng
                  </Button>
                )}
              </div>
            ) : (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Button
                  danger
                  size="large"
                  onClick={() => { setIsOpen(false); exit(); }}
                  style={{ borderRadius: 10, minWidth: 220 }}
                >
                  Đóng Link Thanh Toán
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Embedded PayOS & QR */}
        {paymentMethod === "payos" && (
          <div style={{
            minWidth: 340,
            maxWidth: 400,
            flex: "0 0 400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 24,
          }}>
            <Card
              title="Thanh toán PayOS"
              style={{
                borderRadius: 18,
                boxShadow: "0 8px 32px rgba(60,60,120,0.10)",
                border: "none",
                background: "rgba(255,255,255,0.98)",
                width: "100%",
                minHeight: 420,
                marginBottom: 24,
              }}
              bodyStyle={{ padding: "24px 18px" }}
            >
              <div id="embedded-payment-container" style={{ height: 350, width: "100%" }}></div>
              {isOpen && paymentInfo?.qrCode && (
                <div style={{ marginTop: 20, textAlign: "center" }}>
                  <h3 style={{ fontWeight: 600 }}>Hoặc quét mã QR:</h3>
                  <QRCodeSVG value={paymentInfo.qrCode} size={180} level="H" includeMargin={true} />
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
