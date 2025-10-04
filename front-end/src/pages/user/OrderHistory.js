import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message, Card, Button } from "antd"; // 👈 thêm Button
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/orders/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không lấy được lịch sử mua hàng");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Mua lại đơn hàng
  const handleReorder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/orders/${orderId}/reorder`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể mua lại đơn này");

      message.success("🎉 Sản phẩm từ đơn cũ đã được thêm vào giỏ hàng!");

      // ✅ Sau khi thêm xong chuyển sang giỏ hàng
      navigate("/cart");
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (val) =>
        val === "PayOS" || val === "payos"
          ? <Tag color="blue">PayOS</Tag>
          : <Tag color="gold">Tiền mặt</Tag>,
    },
    {
      title: "Tình trạng thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (val) => {
        const colors = {
          pending: "orange",
          paid: "green",
          failed: "red",
          canceled: "red",
        };
        let text = "";
        switch (val) {
          case "paid":
            text = "Đã thanh toán";
            break;
          case "pending":
            text = "Chờ thanh toán";
            break;
          case "failed":
            text = "Thất bại";
            break;
          case "canceled":
            text = "Đã hủy";
            break;
          default:
            text = val;
        }
        return <Tag color={colors[val] || "default"}>{text}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          pending: "orange",
          paid: "blue",
          shipped: "purple",
          completed: "green",
          cancelled: "red",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "finalAmount",
      key: "finalAmount",
      render: (val) => (
        <span style={{ fontWeight: 600, color: "#ea580c" }}>
          {Number(val).toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleReorder(record.id)}>
          Mua lại
        </Button>
      ),
    },
  ];

  return (
    <>
      <MainHeader />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 20,
          minHeight: "100vh",
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>
          Lịch sử mua hàng
        </h2>
        {loading ? (
          <Spin size="large" tip="Đang tải lịch sử mua hàng..." />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={orders}
            expandable={{
              expandedRowRender: (record) => (
                <div>
                  {/* Danh sách sản phẩm */}
                  {record.items.map((item) => (
                    <Card
                      key={item.id}
                      style={{
                        marginBottom: 12,
                        borderRadius: 10,
                        border: "1px solid #eee",
                      }}
                    >
                      <div style={{ display: "flex", gap: 16 }}>
                        <img
                          src={
                            item.product?.images?.[0]?.productImg
                              ? `http://localhost:5000/${item.product.images[0].productImg}`
                              : "/default-product.png"
                          }
                          alt={item.product?.productName}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {item.product?.productName}
                          </div>
                          <div>
                            Giá:{" "}
                            {Number(item.unitPrice).toLocaleString("vi-VN")} đ
                          </div>
                          <div>Số lượng: {item.quantity}</div>
                          <div>
                            Thành tiền:{" "}
                            {Number(
                              item.unitPrice * item.quantity
                            ).toLocaleString("vi-VN")}{" "}
                            đ
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {/* Thông tin tổng kết đơn hàng */}
                  <div
                    style={{
                      marginTop: 16,
                      padding: "16px 18px",
                      background: "#f9fafb",
                      borderRadius: 10,
                      boxShadow: "0 2px 8px rgba(60,60,120,0.06)",
                      maxWidth: 500,
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>
                      Tổng tiền sản phẩm:{" "}
                      <span>
                        {Number(record.totalAmount).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      Mã giảm giá:{" "}
                      {record.promotionId ? (
                        <Tag color="green">{record.promotionId}</Tag>
                      ) : (
                        <Tag color="default">Không áp dụng</Tag>
                      )}
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      Số tiền giảm giá:{" "}
                      <span style={{ color: "#e11d48" }}>
                        -
                        {Number(record.discountAmount).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      Phí vận chuyển:{" "}
                      <span>{Number(record.shippingAmount).toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#ea580c",
                        fontSize: 18,
                        marginTop: 8,
                      }}
                    >
                      Thành tiền:{" "}
                      {Number(record.finalAmount).toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                </div>
              ),
            }}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
