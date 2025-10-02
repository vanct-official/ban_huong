// src/pages/faq/FAQPage.js
import React, { useEffect, useState } from "react";
import { List, Spin, Card } from "antd";
import axios from "axios";
import MainHeader from "../../../components/MainHeader";
import Footer from "../../../components/Footer";

const API_URL = process.env.REACT_APP_API_URL;

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/faqs`);
        setFaqs(res.data);
      } catch (err) {
        console.error("❌ Lỗi load FAQ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <>
      <MainHeader />
      <div
        style={{
          width: "900px",
          margin: "0 auto",
          padding: 20,
          minHeight: "100vh",
        }}
      >
        <div>
          <h2 style={{ color: "#166534", marginBottom: 20 }}>
            ❓ Tất cả câu hỏi thường gặp
          </h2>

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
                  style={{ marginBottom: 16, borderRadius: 10 }}
                >
                  <p>
                    <strong>Q:</strong> {faq.question}
                  </p>
                  {faq.answer && (
                    <p style={{ marginLeft: 10, color: "#166534" }}>
                      <strong>A:</strong> {faq.answer}
                    </p>
                  )}
                </Card>
              )}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
