// middleware/role.middleware.js
export default function authorize(role) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Bạn chưa đăng nhập" });
      }

      if (req.user.role !== role) {
        return res.status(403).json({ error: "Bạn không có quyền truy cập" });
      }

      next();
    } catch (err) {
      console.error("❌ Lỗi middleware authorize:", err);
      res.status(500).json({ error: "Lỗi xác thực quyền" });
    }
  };
}
