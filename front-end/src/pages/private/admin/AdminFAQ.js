import React, { useEffect, useState } from "react";
import { Card, List, Button, Input, message, Tag, Spin, Drawer } from "antd";
import axios from "axios";
import { MenuOutlined } from "@ant-design/icons";
import AdminSidebar from "../../../components/Sidebar";

const { TextArea } = Input;
const API_URL = process.env.REACT_APP_API_URL;

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/faqs/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaqs(res.data);
    } catch (err) {
      console.error("❌ Lỗi load FAQs:", err);
      message.error("Không thể tải danh sách câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  const approveFaq = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/faqs/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("✅ Câu hỏi đã được duyệt");
      fetchFaqs();
    } catch (err) {
      message.error("❌ Không thể duyệt câu hỏi");
    }
  };

  const submitAnswer = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/faqs/${id}/answer`,
        { answer: answer[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("💬 Đã trả lời câu hỏi");
      setAnswer((prev) => ({ ...prev, [id]: "" }));
      fetchFaqs();
    } catch (err) {
      message.error("❌ Không thể trả lời câu hỏi");
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
      {/* Sidebar desktop */}
      {!isMobile && (
        <div
          style={{
            minWidth: 220,
            background: "#fff",
            borderRight: "1px solid #eee",
          }}
        >
          <AdminSidebar collapsed={false} selectedKey="faq" />
        </div>
      )}

      {/* Sidebar mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          bodyStyle={{ padding: 0 }}
          width={220}
        >
          <AdminSidebar collapsed={false} selectedKey="faq" />
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
            <h2 style={{ margin: 0, color: "#166534" }}>🛠️ Quản lý FAQ</h2>
          </div>
        </div>

        {/* FAQ List */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={faqs}
            renderItem={(faq) => (
              <Card
                key={faq.id}
                style={{
                  marginBottom: 16,
                  borderLeft: faq.isApproved
                    ? "5px solid #16a34a"
                    : "5px solid #f97316",
                }}
              >
                <p>
                  <strong>❓ Q:</strong> {faq.question}
                  <Tag
                    color={faq.isApproved ? "green" : "orange"}
                    style={{ marginLeft: 8 }}
                  >
                    {faq.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                  </Tag>
                </p>

                {faq.answer ? (
                  <p>
                    <strong>💬 A:</strong> {faq.answer}
                  </p>
                ) : (
                  <div style={{ marginTop: 10 }}>
                    <TextArea
                      rows={2}
                      placeholder="Nhập câu trả lời..."
                      value={answer[faq.id] || ""}
                      onChange={(e) =>
                        setAnswer((prev) => ({
                          ...prev,
                          [faq.id]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      type="primary"
                      style={{ marginTop: 8 }}
                      onClick={() => submitAnswer(faq.id)}
                      disabled={!answer[faq.id]}
                    >
                      Trả lời
                    </Button>
                  </div>
                )}

                {!faq.isApproved && (
                  <Button
                    style={{ marginTop: 8 }}
                    onClick={() => approveFaq(faq.id)}
                    type="dashed"
                  >
                    ✅ Duyệt
                  </Button>
                )}
              </Card>
            )}
          />
        )}
      </div>
    </div>
  );
}
