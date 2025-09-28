import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") return <Navigate to="/" />;
  } catch (err) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminRoute;
