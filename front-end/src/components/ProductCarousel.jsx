import React, { useMemo } from "react";
import { Carousel } from "antd";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function ProductCarousel({ images = [] }) {
  // ✅ Chuẩn hoá danh sách ảnh (luôn là URL tuyệt đối)
  const imageList = useMemo(() => {
    return images.map((img) => {
      if (!img) return "/default-product.png";
      if (typeof img === "string") {
        if (img.startsWith("http")) return img;
        return `${API_URL}/${img.replace(/^\/+/, "")}`;
      }
      if (img.imageUrl) return img.imageUrl;
      return "/default-product.png";
    });
  }, [images]);

  if (!imageList.length) return null;

  return (
    <div style={{ width: "100%", maxWidth: 350 }}>
      <Carousel
        autoplay
        dots
        key={imageList.join(",")} // 👈 ép re-render khi danh sách ảnh đổi
        style={{ width: "100%", height: 320 }}
      >
        {imageList.map((src, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
            <img
              src={src}
              alt={`Ảnh sản phẩm ${idx + 1}`}
              style={{
                width: "100%",
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
        ))}
      </Carousel>
    </div>
  );
}
