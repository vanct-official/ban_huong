import React, { useEffect, useState } from "react";
import { List, Avatar, Rate, Button, Spin } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function HomeFeedback() {
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/feedback/recent`)
      .then((res) => setRecentFeedbacks(res.data))
      .catch((err) => console.error("Lỗi load feedback:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "60px auto",
        padding: "0 16px",
      }}
    >
      {/* Tiêu đề + nút Xem tất cả */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0, color: "#166534" }}>Đánh giá từ khách hàng</h2>
        <Button type="link" onClick={() => navigate("/all-feedbacks")}>
          Xem tất cả →
        </Button>
      </div>

      {/* Danh sách feedback */}
      <List
        itemLayout="horizontal"
        dataSource={recentFeedbacks}
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
          </List.Item>
        )}
      />
    </div>
  );
}
