// src/pages/admin/analytics/AdminAnalytics.js
import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  message,
  Drawer,
  Button,
  Table,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DollarOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import AdminSidebar from "../../../components/Sidebar";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminAnalytics() {
  const [topCustomers, setTopCustomers] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("⚠️ Bạn cần đăng nhập để xem thống kê");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);
    } catch (err) {
      console.error("❌ Lỗi fetchStats:", err);
      if (err.response?.status === 401) {
        message.error("⚠️ Phiên đăng nhập hết hạn hoặc không hợp lệ");
      } else if (err.response?.status === 403) {
        message.error("🚫 Bạn không có quyền xem thống kê");
      } else {
        message.error("Không thể tải thống kê!");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExtraStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [customersRes, revenueRes, bestRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/top-customers`, { headers }),
        axios.get(`${API_URL}/api/admin/revenue/month`, { headers }),
        axios.get(`${API_URL}/api/admin/best-sellers`, { headers }),
      ]);

      setTopCustomers(customersRes.data);
      setRevenueByMonth(revenueRes.data);
      setBestSellers(bestRes.data);
    } catch (err) {
      console.error("❌ fetchExtraStats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchExtraStats();
  }, []);

  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Products", value: stats.products },
    { name: "Orders", value: stats.orders },
  ];

  const COLORS = ["#166534", "#f97316", "#3b82f6"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
      {/* Sidebar */}
      {!isMobile && (
        <div
          style={{
            minWidth: 220,
            background: "#fff",
            borderRight: "1px solid #eee",
          }}
        >
          <AdminSidebar collapsed={false} selectedKey="analytics" />
        </div>
      )}
      {/* Drawer Sidebar (Mobile) */}
      {isMobile && (
        <Drawer
          placement="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          bodyStyle={{ padding: 0 }}
          width={220}
        >
          <AdminSidebar collapsed={false} selectedKey="analytics" />
        </Drawer>
      )}

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: isMobile ? 8 : 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? 12 : 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setSidebarOpen(true)}
                style={{ borderRadius: 8 }}
              />
            )}
            <h2 style={{ margin: 0, color: "#166534" }}>📊 Thống kê</h2>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Statistic Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="Người dùng"
                    value={stats.users}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="Sản phẩm"
                    value={stats.products}
                    prefix={<AppstoreOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="Đơn hàng"
                    value={stats.orders}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="Doanh thu"
                    value={stats.revenue}
                    prefix={<DollarOutlined />}
                    formatter={(value) =>
                      `${Number(value).toLocaleString("vi-VN")} đ`
                    }
                  />
                </Card>
              </Col>
            </Row>

            {/* Pie Chart */}
            <Card style={{ marginTop: 24 }}>
              <h3 style={{ textAlign: "center", marginBottom: 20 }}>
                Phân bổ dữ liệu
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card style={{ marginTop: 24 }}>
              <h3>Top khách hàng chi tiêu nhiều nhất</h3>
              <Table
                dataSource={topCustomers}
                rowKey={(r) => r.Order.userId}
                columns={[
                  {
                    title: "Khách hàng",
                    dataIndex: ["Order", "User", "username"],
                  },
                  { title: "Email", dataIndex: ["Order", "User", "email"] },
                  {
                    title: "Tổng chi tiêu",
                    dataIndex: "totalSpent",
                    render: (val) => `${Number(val).toLocaleString()} đ`,
                  },
                ]}
                pagination={false}
              />
            </Card>
            <Card style={{ marginTop: 24 }}>
              <h3>Doanh thu theo tháng</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#166534"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card style={{ marginTop: 24 }}>
              <h3>Sản phẩm bán chạy</h3>
              <Table
                dataSource={bestSellers}
                rowKey={(r) => r.productId}
                columns={[
                  {
                    title: "Ảnh",
                    dataIndex: ["Product", "productImg"],
                    render: (img) => (
                      <img
                        src={img || "/default-product.png"}
                        alt="product"
                        style={{ width: 50 }}
                      />
                    ),
                  },
                  {
                    title: "Tên sản phẩm",
                    dataIndex: ["Product", "productName"],
                  },
                  { title: "Số lượng bán", dataIndex: "totalSold" },
                ]}
                pagination={false}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
