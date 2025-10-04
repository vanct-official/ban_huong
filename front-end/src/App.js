import { Routes, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
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
import AdminSettings from "./pages/private/admin/AdminSettings";
import AdminFeedback from "./pages/private/admin/AdminFeedback";
import AdminPromotion from "./pages/private/admin/AdminPromotion";
import OrderHistory from "./pages/user/OrderHistory";
import PostDetail from "./pages/public/post/PostDetail";
import AdminPosts from "./pages/private/admin/AdminPosts";
import AdminPostAdd from "./pages/private/admin/AdminPostAdd";
import AdminPostEdit from "./pages/private/admin/AdminPostEdit";
import AllPosts from "./pages/public/post/AllPosts";
import ManageSubscribers from "./pages/private/admin/ManageSubscribers";
import AllFeedbacks from "./pages/public/homefeedback/AllFeedbacks";
import Checkout from "./pages/public/Checkout";
import Footer from "./components/Footer";
import MainHeader from "./components/MainHeader";
import AdminFAQ from "./pages/private/admin/AdminFAQ";
import FAQPage from "./pages/public/faq/FAQPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";

function App() {
  return (
    <main style={{ minHeight: "80vh" }}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/provinces" element={<ProvincesList />} />
        <Route path="/text" element={<TextArea />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<Cart />} />

        {/* User profile routes */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/edit" element={<EditUserProfile />} />
        <Route path="/orders/history" element={<OrderHistory />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/posts" element={<AllPosts />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/add"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/update/:id"
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/marketing"
          element={
            <AdminRoute>
              <AdminPromotion />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <AdminRoute>
              <AdminFeedback />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/faqs"
          element={
            <AdminRoute>
              <AdminFAQ />
            </AdminRoute>
          }
        />
        <Route path="/admin/posts" element={<AdminPosts />} />
        <Route path="/admin/posts/add" element={<AdminPostAdd />} />
        <Route path="/admin/posts/edit/:id" element={<AdminPostEdit />} />
        <Route
          path="/admin/email-subscribers"
          element={<ManageSubscribers />}
        />
        <Route path="/all-feedbacks" element={<AllFeedbacks />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </main>
  );
}

export default App;
