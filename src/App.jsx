import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Sidebar from './components/Sidebar/Sidebar';
import News from './pages/News';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginSuccess from './pages/LoginSuccess/LoginSuccess';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicOnlyRoute from './routes/PublicOnlyRoute';

function App() {
  // Xác định trang hiện tại để ẩn/hiện Sidebar
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';      
  const isRegisterPage = location.pathname === '/register'; 
  const isLoginSuccessPage = location.pathname === '/login-success'; 

  return (
    // Giao diện chính của ứng dụng
    <div className="App">
      {!(isLoginPage || isRegisterPage || isLoginSuccessPage) && <Sidebar />}
      <main className="main-content">
        <div className="container">
          <Routes>
            {/* Chỉ vào khi CHƯA đăng nhập */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Các trang yêu cầu đăng nhập */}
            <Route element={<ProtectedRoute />}>
              <Route path="/login-success" element={<LoginSuccess />} />
              <Route path="/news" element={<News />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>
          </Routes>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}

export default App;


