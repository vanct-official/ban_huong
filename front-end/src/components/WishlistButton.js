import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Button, message } from "antd";
import { useState, useEffect } from "react";

// Giả sử có productId và user đã đăng nhập
function WishlistButton({ productId }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kiểm tra sản phẩm có trong wishlist không
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("google_token");
        const res = await fetch("http://localhost:5000/api/wishlists/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setInWishlist(Array.isArray(data) && data.some(p => p.id === productId));
      } catch (err) {
        setInWishlist(false);
      }
    };
    fetchWishlist();
  }, [productId]);

  // Thêm vào wishlist
  const handleAdd = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("google_token");
      const res = await fetch("http://localhost:5000/api/wishlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Thêm vào wishlist thất bại");
      setInWishlist(true);
      message.success("Đã thêm vào wishlist!");
    } catch (err) {
      message.error("Lỗi khi thêm vào wishlist!");
    }
    setLoading(false);
  };

  // Xóa khỏi wishlist
  const handleRemove = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("google_token");
      const res = await fetch(`http://localhost:5000/api/wishlists/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa khỏi wishlist thất bại");
      setInWishlist(false);
      message.success("Đã xóa khỏi wishlist!");
    } catch (err) {
      message.error("Lỗi khi xóa khỏi wishlist!");
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