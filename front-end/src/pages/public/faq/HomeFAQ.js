// src/pages/home/HomeFAQ.js
import React, { useEffect, useState } from "react";
import { Card, List, Button, Spin, Input, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { TextArea } = Input;
const API_URL = process.env.REACT_APP_API_URL;

export default function HomeFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/faqs/approved`);
      setFaqs(res.data);
    } catch (err) {
      console.error("❌ Lỗi load FAQ:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async () => {
    if (!question.trim()) {
      message.warning("❗ Vui lòng nhập câu hỏi");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/faqs/ask`, { question });
      message.success("🎉 Câu hỏi của bạn đã được gửi, chờ admin duyệt!");
      setQuestion("");
    } catch (err) {
      console.error("❌ Lỗi gửi câu hỏi:", err);
      message.error("Không thể gửi câu hỏi");
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto" }}>
      <Card
        title="❓ Câu hỏi thường gặp"
        style={{ marginTop: 40, borderRadius: 12 }}
        extra={
          <Link to="/faq">
            <Button type="link">Xem tất cả →</Button>
          </Link>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", margin: 20 }}>
            <Spin />
          </div>
        ) : (
          <>
            <List
              dataSource={faqs}
              renderItem={(faq) => (
                <List.Item>
                  <div>
                    <p>
                      <strong>Q:</strong> {faq.question}
                    </p>
                    {faq.answer && (
                      <p style={{ marginLeft: 10, color: "#166534" }}>
                        <strong>A:</strong> {faq.answer}
                      </p>
                    )}
                  </div>
                </List.Item>
              )}
            />

            {/* Form đặt câu hỏi */}
            <div style={{ marginTop: 20 }}>
              <h4>✍️ Gửi câu hỏi của bạn</h4>
              <TextArea
                rows={3}
                placeholder="Nhập câu hỏi..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Button
                type="primary"
                style={{ marginTop: 10 }}
                onClick={submitQuestion}
              >
                Gửi câu hỏi
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
