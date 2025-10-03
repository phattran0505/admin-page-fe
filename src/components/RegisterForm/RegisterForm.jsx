import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineMail, MdLockOutline } from 'react-icons/md'
import { FaRegUserCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../api'
import { toast } from 'react-toastify'

import './RegisterForm.scss'

const REGISTER_URL = '/api/v1/auth/register'
const TOAST_ID_SUCCESS = 'register-success'
const TOAST_ID_ERROR = 'register-error'

const RegisterForm = () => {
  const navigate = useNavigate()
  const userRef = useRef(null)
  const errRef = useRef(null)

  const [username, setUsername] = useState('')          // username 
  const [email, setEmail] = useState('')                // email  
  const [pwd, setPwd] = useState('')                    // password 
  const [confirmPwd, setConfirmPwd] = useState('')      // confirm password
  const [errMsg, setErrMsg] = useState('')              // error message
  const [isSubmitting, setIsSubmitting] = useState(false) // submission state

  useEffect(() => { userRef.current?.focus() }, [])
  useEffect(() => { setErrMsg('') }, [username, email, pwd, confirmPwd])

  const validate = () => {
    // Client-side validation
    const normalizedEmail = email.trim().toLowerCase()
    // Trim and normalize email để validation
    if (!username.trim() || !normalizedEmail || !pwd.trim() || !confirmPwd.trim()) {
      setErrMsg('Vui lòng nhập đầy đủ thông tin')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
       setErrMsg('Email không hợp lệ'); 
       return false 
    }
    if (pwd.length < 6) { 
      setErrMsg('Mật khẩu tối thiểu 6 ký tự'); 
      return false 
    }
    if (pwd !== confirmPwd) { 
      setErrMsg('Mật khẩu nhập lại không khớp'); 
      return false 
    }
    return true
  }

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrMsg('')
    // Validate trước khi gửi
    if (!validate()) { errRef.current?.focus(); return }
    setIsSubmitting(true)

    try {
      // Gửi request đăng ký
      const normalizedEmail = email.trim().toLowerCase()
      await axios.post(
        REGISTER_URL,
        JSON.stringify({ username, email: normalizedEmail, password: pwd }),
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true },
      )
      // Hiện thông báo thành công và chuyển đến trang đăng nhập
      toast.success('Đăng ký thành công', { toastId: TOAST_ID_SUCCESS })
      setTimeout(() => navigate('/login'), 600)
    } catch (err) {
      const apiMsg = err?.response?.data?.message

      // Hiện thông báo lỗi
      if (apiMsg) toast.error(apiMsg, { toastId: TOAST_ID_ERROR })
      else if (!err?.response) 
        toast.error('Không có phản hồi từ máy chủ', { toastId: TOAST_ID_ERROR })
      else if (err.response?.status === 409) 
        toast.error('Email đã tồn tại', { toastId: TOAST_ID_ERROR })
      else if (err.response?.status === 400) 
        toast.error('Thiếu thông tin hoặc dữ liệu không hợp lệ', { toastId: TOAST_ID_ERROR })
      else 
        toast.error('Đăng ký thất bại', { toastId: TOAST_ID_ERROR })

      errRef.current?.focus()
    } finally { setIsSubmitting(false) }
  }

  return (
    // Form đăng ký
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Đăng ký</h2>
        <form className="login-form" noValidate onSubmit={handleSubmit}>
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>

          <div className="input-group">
            <span className="icon"><FaRegUserCircle /></span>
            <input type="text" id="username" ref={userRef} autoComplete="username"
                   onChange={(e) => setUsername(e.target.value)} value={username}
                   placeholder="Tên đăng nhập" required />
          </div>

          <div className="input-group">
            <span className="icon"><MdOutlineMail /></span>
            <input type="email" id="email" autoComplete="email"
                   onChange={(e) => setEmail(e.target.value)} value={email}
                   placeholder="Email" required />
          </div>

          <div className="input-group">
            <span className="icon"><MdLockOutline /></span>
            <input type="password" id="password" autoComplete="new-password"
                   onChange={(e) => setPwd(e.target.value)} value={pwd}
                   placeholder="Mật khẩu" required />
          </div>

          <div className="input-group">
            <span className="icon"><MdLockOutline /></span>
            <input type="password" id="confirmPassword" autoComplete="new-password"
                   onChange={(e) => setConfirmPwd(e.target.value)} value={confirmPwd}
                   placeholder="Nhập lại mật khẩu" required />
          </div>

          <button className="login-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <div className="login-footer">
          <span>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></span>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
