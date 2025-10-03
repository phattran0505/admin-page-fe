import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'

// Route chỉ cho phép truy cập khi chưa đăng nhập
// Khi đã có user: chuyển hướng về /login-success
export default function PublicOnlyRoute() {
  const { auth, hydrated } = useContext(AuthContext)
  
  if (!hydrated) return <Outlet />

  if (auth?.user) return <Navigate to="/login-success" replace />
  
  return <Outlet />
}


