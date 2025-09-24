import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Sidebar from './components/Sidebar/Sidebar';
import News from './pages/News';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="App">
      {!(isLoginPage || isRegisterPage) && <Sidebar />}
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/news" element={<News />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />}></Route>
          </Routes>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}

export default App;
