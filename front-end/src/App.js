import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import ProvincesList from './pages/ProvinceList';
import TextArea from './pages/TextArea';
import UsersList from './pages/UserList';
import LoginPage from './pages/authentication/LoginPage';
import AdminPage from './pages/private/admin/AdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/provinces" element={<ProvincesList />} />
      <Route path="/text" element={<TextArea/>}/>
      <Route path="/users" element={<UsersList />} />
      {/* Thêm route cho trang đăng nhập */}
      <Route path="/login" element={<LoginPage />} />
      {/* Thêm các route khác nếu cần */}

      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
