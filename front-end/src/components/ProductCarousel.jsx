import React from "react";
import { Carousel } from "antd";

export default function ProductCarousel({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <Carousel autoplay dots style={{ width: "100%", maxWidth: 350 }}>
      {images.map((img, idx) => (
        <div key={idx} style={{ textAlign: "center" }}>
          <img
            src={img}
            alt={`Ảnh sản phẩm ${idx + 1}`}
            style={{
              width: "100%",
              maxWidth: 320,
              height: 320,
              objectFit: "contain",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(22,101,52,0.08)",
              background: "#fff"
            }}
          />
        </div>
      ))}
    </Carousel>
  );
}
