import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Tự động gắn token vào header (sau khi login Google bạn lưu token vào localStorage)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Wishlist API
export const addToWishlist = (productId) =>
  API.post("/wishlist", { productId });

export const removeFromWishlist = (productId) =>
  API.delete(`/wishlist/${productId}`);

export const getWishlist = () => API.get("/wishlist");
