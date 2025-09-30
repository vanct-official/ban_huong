import React, { useState } from "react";
import { Card, Input, Button, Tag } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Sản phẩm mới",
    "Bài viết",
    "Thống kê",
    "So sánh sản phẩm",
    "AI hỗ trợ",
  ];

  const sendMessage = async (msg) => {
    if (!msg) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, { message: msg });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Xin lỗi, tôi không trả lời được." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>
      {open ? (
        <Card
          title="Vinsaky Shop AI"
          extra={
            <Button type="text" onClick={() => setOpen(false)}>
              ✖
            </Button>
          }
          style={{
            width: 350,
            height: 450,
            display: "flex",
            flexDirection: "column",
          }}
          bodyStyle={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Chat content */}
          <div style={{ flex: 1, overflowY: "auto", marginBottom: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.role === "user" ? "right" : "left",
                  margin: "6px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 12,
                    background: m.role === "user" ? "#166534" : "#eee",
                    color: m.role === "user" ? "#fff" : "#000",
                    maxWidth: "80%",
                  }}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <p>⏳ Đang trả lời...</p>}
          </div>

          {/* Quick suggestions */}
          <div style={{ marginBottom: 8 }}>
            {suggestions.map((s) => (
              <Tag
                key={s}
                color="green"
                style={{ cursor: "pointer", marginBottom: 4 }}
                onClick={() => sendMessage(s)}
              >
                {s}
              </Tag>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex" }}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={() => sendMessage(input)}
              placeholder="Nhập tin nhắn..."
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => sendMessage(input)}
              disabled={loading}
            />
          </div>
        </Card>
      ) : (
        <Button
          type="primary"
          shape="circle"
          size="large"
          onClick={() => setOpen(true)}
        >
          💬
        </Button>
      )}
    </div>
  );
}
