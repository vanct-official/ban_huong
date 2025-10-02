import React, { useEffect, useState } from "react";
import { List, Avatar, Rate, Spin } from "antd";
import axios from "axios";
import MainHeader from "../../../components/MainHeader";
import Footer from "../../../components/Footer";

const API_URL = process.env.REACT_APP_API_URL;

export default function AllFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/feedback`)
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Lỗi load all feedback:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );

  return (
    <>
      <MainHeader />
      <div
        style={{
          maxWidth: 800,
          margin: "40px auto",
          minHeight: "100vh",
        }}
      >
        <h2>Tất cả nhận xét từ khách hàng</h2>
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
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
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
      <Footer />
    </>
  );
}
