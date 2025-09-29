import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Button, message } from "antd";
import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function WishlistButton({ productId }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Kiểm tra sản phẩm có trong wishlist không ---
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/wishlists/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        // Kiểm tra productId (số) hoặc string
        setInWishlist(
          Array.isArray(data) &&
            data.some((item) => item.product?.id === productId)
        );
      } catch (err) {
        setInWishlist(false);
      }
    };
    fetchWishlist();
  }, [productId]);

  // --- Thêm vào wishlist ---
  const handleAdd = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Bạn cần đăng nhập");

      const res = await fetch(`${API_URL}/api/wishlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Thêm vào wishlist thất bại");

      setInWishlist(true);
      message.success(result.message);
    } catch (err) {
      message.error(err.message);
    }
    setLoading(false);
  };

  // --- Xóa khỏi wishlist ---
  const handleRemove = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Bạn cần đăng nhập");

      const res = await fetch(
        `${API_URL}/api/wishlists/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Xóa khỏi wishlist thất bại");

      setInWishlist(false);
      message.success(result.message);
    } catch (err) {
      message.error(err.message);
    }
    setLoading(false);
  };

  return (
    <Button
      type="text"
      icon={
        inWishlist ? (
          <HeartFilled style={{ color: "#e11d48", fontSize: 24 }} />
        ) : (
          <HeartOutlined style={{ color: "#e11d48", fontSize: 24 }} />
        )
      }
      loading={loading}
      onClick={inWishlist ? handleRemove : handleAdd}
      style={{ padding: 0 }}
      aria-label={inWishlist ? "Bỏ khỏi wishlist" : "Thêm vào wishlist"}
    />
  );
}

export default WishlistButton;
