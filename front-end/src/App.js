import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/public/HomePage";
import ProvincesList from "./pages/ProvinceList";
import TextArea from "./pages/TextArea";
import UsersList from "./pages/UserList";
import LoginPage from "./pages/authentication/LoginPage";
import AdminPage from "./pages/private/admin/AdminPage";
import UserProfile from "./pages/private/UserProfile";
import EditUserProfile from "./pages/private/EditUserProfile";
import AddProduct from "./pages/private/admin/AddProduct";
import ProductList from "./pages/public/ProductList";
import ProductDetail from "./pages/public/ProductDetail";
import WishlistPage from "./pages/public/WishlistPage";

import AdminProductList from "./pages/private/admin/AdminProductList";
import Cart from "./pages/public/Cart";
import UpdateProduct from "./pages/private/admin/UpdateProduct";
import UserManagement from "./pages/private/admin/UserManagement";
import AdminAnalytics from "./pages/private/admin/AdminAnalytics";
import AdminOrders from "./pages/private/admin/AdminOrders";
import AdminMarketing from "./pages/private/admin/AdminMarketing";
import AdminSettings from "./pages/private/admin/AdminSettings";

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
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route
            path="/admin/products/update/:id"
            element={<UpdateProduct />}
          />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/analytics" element={<AdminAnalytics />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/marketing" element={<AdminMarketing />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="admin/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
