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
  List,
  Avatar,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DollarOutlined,
  MenuOutlined,
  FireOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import AdminSidebar from "../../../components/Sidebar";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [reports, setReports] = useState({
    revenueByMonth: [],
    topProducts: [],
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("⚠️ Bạn cần đăng nhập để xem thống kê");
        setLoading(false);
        return;
      }

      // Thống kê cơ bản
      const statsRes = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsRes.data);

      // Báo cáo chi tiết (doanh thu & top sản phẩm)
      const reportsRes = await axios.get(`${API_URL}/api/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(reportsRes.data);
    } catch (err) {
      console.error("❌ Lỗi fetchData:", err);
      if (err.response?.status === 401) {
        message.error("⚠️ Phiên đăng nhập hết hạn hoặc không hợp lệ");
      } else if (err.response?.status === 403) {
        message.error("🚫 Bạn không có quyền xem thống kê");
      } else {
        message.error("Không thể tải dữ liệu!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

            {/* Doanh thu theo tháng */}
            <Card style={{ marginTop: 24 }}>
              <h3 style={{ textAlign: "center", marginBottom: 20 }}>
                📈 Doanh thu theo tháng
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reports.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      `${Number(value).toLocaleString("vi-VN")} đ`
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#166534"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Top sản phẩm bán chạy */}
            <Card style={{ marginTop: 24 }}>
              <h3 style={{ textAlign: "center", marginBottom: 20 }}>
                🔥 Top sản phẩm bán chạy
              </h3>

              <List
                itemLayout="horizontal"
                dataSource={reports.topProducts}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={64}
                          src={
                            item.productImg
                              ? `${API_URL}/${item.productImg}`
                              : "/default-product.png"
                          }
                        />
                      }
                      title={
                        <span>
                          {index + 1}. {item.productName}
                        </span>
                      }
                      description={
                        <span>
                          Đã bán:{" "}
                          <strong style={{ color: "#d97706" }}>
                            {item.totalSold}
                          </strong>
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
