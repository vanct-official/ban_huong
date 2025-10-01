import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message, Card } from "antd";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
const API_URL = process.env.REACT_APP_API_URL;
export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val) => `${Number(val).toLocaleString("vi-VN")} đ`,
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
          minHeight: "380px",
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
