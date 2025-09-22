import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './components/Sidebar/Sidebar';
import News from './pages/News';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <div className="App">
      <Sidebar />
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/news" element={<News />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}

export default App;
