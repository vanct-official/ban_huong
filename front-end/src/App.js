import { Routes, Route } from "react-router-dom";
import MainHeader from "./components/MainHeader";
import Footer from "./components/Footer";

import HomePage from "./pages/public/HomePage";
import ProvincesList from "./pages/ProvinceList";
import TextArea from "./pages/TextArea";
import UsersList from "./pages/UserList";
import LoginPage from "./pages/authentication/LoginPage";
import AdminPage from "./pages/private/admin/AdminPage";
import UserProfile from "./pages/private/UserProfile";
import EditUserProfile from "./pages/private/EditUserProfile";
import ProductList from "./pages/public/ProductList";
import ProductDetail from "./pages/public/ProductDetail";
import WishlistPage from "./pages/public/WishlistPage";

import AdminProductList from "./pages/private/admin/AdminProductList";
import Cart from "./pages/public/Cart";

function App() {
  return (
    <>
      {/* Nội dung thay đổi theo route */}
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/provinces" element={<ProvincesList />} />
          <Route path="/text" element={<TextArea />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditUserProfile />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="/admin/products" element={<AdminProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
