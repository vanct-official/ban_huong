import React from "react";
import { Carousel } from "antd";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function ProductCarousel({ images = [] }) {
  if (!images.length) return null;

  return (
    <Carousel autoplay dots style={{ width: "100%", maxWidth: 350 }}>
      {images.map((img, idx) => {
        // 🔍 Xử lý URL chuẩn
        let src = "/default-product.png";

        if (typeof img === "string") {
          // Nếu là URL tuyệt đối (http://, https://)
          if (img.startsWith("http")) src = img;
          // Nếu là đường dẫn tương đối (uploads/abc.png)
          else src = `${API_URL}/${img.replace(/^\/+/, "")}`;
        } else if (img?.imageUrl) {
          src = img.imageUrl.startsWith("http")
            ? img.imageUrl
            : `${API_URL}/${img.imageUrl.replace(/^\/+/, "")}`;
        }

        return (
          <div key={idx} style={{ textAlign: "center" }}>
            <img
              src={src}
              alt={`Ảnh sản phẩm ${idx + 1}`}
              style={{
                width: "100%",
                maxWidth: 320,
                height: 320,
                objectFit: "contain",
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(22,101,52,0.08)",
                background: "#fff",
              }}
              onError={(e) => {
                e.target.src = "/default-product.png";
              }}
            />
          </div>
        );
      })}
    </Carousel>
  );
}
