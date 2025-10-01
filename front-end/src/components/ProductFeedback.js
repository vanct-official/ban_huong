import React, { useState, useEffect } from "react";
import { List, Avatar, Rate, Input, Button, message } from "antd";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const { TextArea } = Input;

export default function ProductFeedback({ productId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [rate, setRate] = useState(5);

  // Lấy danh sách feedback
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/feedback/product/${productId}`
      );
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy feedback:", err);
      message.error("Không thể tải danh sách nhận xét");
    }
  };

  useEffect(() => {
    if (productId) fetchFeedbacks();
  }, [productId]);

  // Gửi feedback
  const handleSubmit = async () => {
    if (!content.trim()) {
      return message.warning("⚠️ Vui lòng nhập nội dung nhận xét");
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return message.warning("⚠️ Bạn cần đăng nhập để gửi nhận xét");
      }

      setLoading(true);
      await axios.post(
        `${API_URL}/api/feedback`,
        {
          productId,
          rate,
          feedbackContent: content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("🎉 Gửi nhận xét thành công!");
      setContent("");
      setRate(5);
      fetchFeedbacks();
    } catch (err) {
      console.error("Lỗi gửi feedback:", err);

      // ✅ Hiển thị message cụ thể từ backend (nếu có)
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message);
        // Ví dụ: "Bạn đã feedback sản phẩm này rồi." hoặc "Bạn chỉ có thể feedback cho sản phẩm đã mua."
      } else {
        message.error("❌ Không thể gửi nhận xét, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      {/* Form nhập feedback */}
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 8,
          background: "#fafafa",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Gửi nhận xét của bạn</h3>
        <Rate value={rate} onChange={setRate} />
        <TextArea
          rows={3}
          placeholder="Nhập nhận xét..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ marginTop: 12 }}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          style={{ marginTop: 12 }}
        >
          Gửi
        </Button>
      </div>

      {/* Danh sách feedback */}
      <List
        itemLayout="horizontal"
        dataSource={feedbacks}
        renderItem={(fb) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src={fb.user?.avatarImg || "/default-avatar.png"} />
              }
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{fb.user?.username}</span>
                  <Rate disabled value={fb.rate} style={{ fontSize: 14 }} />
                </div>
              }
              description={fb.feedbackContent}
            />
            <div style={{ fontSize: 12, color: "#999" }}>
              {new Date(fb.createdAt).toLocaleString()}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
