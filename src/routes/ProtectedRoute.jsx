import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'

// Route bảo vệ: chỉ cho phép truy cập khi đã đăng nhập
// Khi chưa có user: chuyển hướng về /login và lưu lại vị trí cũ (state.from)
export default function ProtectedRoute() {
  const location = useLocation()
  const { auth, hydrated } = useContext(AuthContext)

  // Chưa "hydrated" thì không biết trạng thái => tạm không render gì
  if (!hydrated) return <Outlet />

  // Chưa đăng nhập thì chuyển về trang /login
  if (!auth?.user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
