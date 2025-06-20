import React, { useState, useEffect } from 'react';
import '../../CSS/Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../Axios/AxiosCLients';
import axios from 'axios';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Đăng ký
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [registerStep, setRegisterStep] = useState(1); // 1: Nhập info, 2: Nhập OTP
  const [registerOtp, setRegisterOtp] = useState('');
  const [registeringEmail, setRegisteringEmail] = useState('');

  // Đăng nhập
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Thông báo
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: ''
  });

  // Quên mật khẩu
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: nhập info, 2: nhập OTP
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/guest/home';



  // Thông báo
  const showNotification = (message, type) => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 3000);
  };

  useEffect(() => {
    if (window.location.hash === '#signup') setIsSignUp(true);
  }, []);

  // ======= Đăng nhập =======
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('loginData:', loginData);
    try {
      const response = await axiosClient.post('/api/auth/login', loginData);
      const data = response.data;
      console.log('Login response:', data);

      if (data.success) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('token', data.user.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);

        showNotification(data.message || 'Đăng nhập thành công!', 'success');

        // Kiểm tra role và điều hướng
        const userRole = data.user.role?.toUpperCase();
        
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
          return;
        }
        
        if (userRole === 'COACH') {
          navigate('/coach/home', { replace: true });
          return;
        }

        // Nếu là user thường, kiểm tra membership
        try {
          const userRes = await axiosClient8080.get(`/api/user/${data.user.id}`, {
            headers: { 'Authorization': `Bearer ${data.user.token}` }
          });
          
          const userInfo = userRes.data;
          console.log('User Info:', userInfo);

          const today = new Date().toISOString().split('T')[0];
          const hasMembership = userInfo.currentMembershipPackage && 
                              userInfo.subscriptionEndDate && 
                              userInfo.subscriptionEndDate >= today;

          if (hasMembership) {
            console.log('Redirecting to user home');
            navigate('/users/home', { replace: true });
          } else {
            console.log('Redirecting to guest home');
            navigate('/guest/home', { replace: true });
          }
        } catch (userError) {
          console.error('Error fetching user info:', userError);
          navigate('/guest/home', { replace: true });
        }
      } else {
        showNotification(data.message || 'Đăng nhập thất bại!', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
      }
    } catch (error) {
      console.log('Login error:', error?.response?.data || error.message || error);
      showNotification(error?.response?.data?.message || error?.response?.data || 'Lỗi kết nối server!', 'error');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
    }
  };

  // ======= Đăng ký 2 bước =======
  // Bước 1: Gửi info -> gửi OTP về email
  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      showNotification('Mật khẩu xác nhận không khớp.', 'error');
      return;
    }
    try {
      const res = await axiosClient.post('/api/auth/register-request', {
        fullName: registerData.name,
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword
      });
      const data = res.data;
      if (data.success) {
        showNotification(data.message || 'OTP đã gửi về email. Vui lòng nhập mã xác nhận.', 'success');
        setRegisteringEmail(registerData.email);
        setRegisterStep(2);
      } else {
        showNotification(data.message || 'Đăng ký thất bại!', 'error');
      }
    } catch (error) {
      showNotification('Lỗi kết nối server!', 'error');
    }
  };

  // Bước 2: Xác thực OTP
  const handleRegisterOtp = async (e) => {
    e.preventDefault();
    if (!registerOtp || registerOtp.length !== 4) {
      showNotification('Vui lòng nhập đủ mã OTP 4 số.', 'error');
      return;
    }
    try {
      const res = await axiosClient.post('/api/auth/register-verify-otp', {
        email: registeringEmail,
        otp: registerOtp
      });
      const data = res.data;
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user?.role || 'member');
        localStorage.setItem('userId', data.user?.id);
        localStorage.setItem('userName', data.user?.fullName || '');
        showNotification(data.message || 'Đăng ký thành công!', 'success');
        switch (data.user?.role) {
          case 'admin':
            navigate('/admin/dashboard', { replace: true });
            break;
          case 'coach':
            navigate('/coach/home', { replace: true });
            break;
          case 'member':
            navigate('/users/home', { replace: true });
            break;
          default:
            navigate('/guest/home', { replace: true });
        }
        setRegisterStep(1);
        setIsSignUp(false);
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
        setRegisterOtp('');
        setRegisteringEmail('');
      } else {
        showNotification(data.message || 'OTP không đúng hoặc đã hết hạn!', 'error');
      }
    } catch (error) {
      showNotification('Lỗi kết nối server!', 'error');
    }
  };

  // ======= Quên mật khẩu 2 bước =======
  // Bước 1: Gửi OTP về email
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotNewPassword || !forgotConfirmPassword) {
      showNotification('Vui lòng nhập đủ thông tin.', 'error');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      showNotification('Mật khẩu xác nhận không khớp.', 'error');
      return;
    }
    try {
      const res = await axiosClient.post('/api/auth/forgot-password', {
        email: forgotEmail,
        newPassword: forgotNewPassword
      });
      const data = res.data;
      if (data.success) {
        setForgotStep(2);
        showNotification(data.message || 'OTP đã gửi về email. Nhập mã để xác nhận.', 'success');
      } else {
        showNotification(data.message || 'Gửi OTP thất bại!', 'error');
      }
    } catch (err) {
      showNotification('Lỗi kết nối server!', 'error');
    }
  };

  // Bước 2: Nhập OTP xác thực đổi mật khẩu
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.length !== 4) {
      showNotification('Vui lòng nhập đủ mã OTP 4 số.', 'error');
      return;
    }
    try {
      const res = await axiosClient.post('/api/auth/reset-password-otp', {
        email: forgotEmail,
        otp: forgotOtp
      });
      const data = res.data;
      if (data.success) {
        showNotification(data.message || 'Đổi mật khẩu thành công!', 'success');
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotStep(1);
          setForgotEmail('');
          setForgotNewPassword('');
          setForgotConfirmPassword('');
          setForgotOtp('');
        }, 1500);
      } else {
        showNotification(data.message || 'OTP không đúng hoặc đã hết hạn!', 'error');
      }
    } catch (err) {
      showNotification('Lỗi kết nối server!', 'error');
    }
  };

  // ======= Giao diện =======
  return (
    <div className="auth-container">
      {/* Notification */}
      {notification.visible && (
        <div className={`notification ${notification.type}`} style={{
          position: 'fixed', top: '20px', left: '20px', zIndex: 1000,
          padding: '15px 20px', borderRadius: '8px',
          backgroundColor: notification.type === 'success' ? '#e9ffe9' : '#ffe9e9',
          border: `1px solid ${notification.type === 'success' ? '#a3e9a3' : '#e9a3a3'}`,
          color: '#333', display: 'flex', alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}>
          <div className="notification-content" style={{ display: 'flex', alignItems: 'center' }}>
            {notification.type === 'success' && <span style={{ marginRight: '10px', color: 'green', fontSize: '1.2em' }}>✅</span>}
            {notification.type === 'error' && <span style={{ marginRight: '10px', color: 'red', fontSize: '1.2em' }}>❌</span>}
            <span style={{ fontSize: '1em' }}>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
            style={{ background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', marginLeft: '20px', color: '#aaa' }}>
            ×
          </button>
        </div>
      )}

      {/* Quên mật khẩu 2 bước */}
      {showForgotPassword && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.3)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => {
            setShowForgotPassword(false);
            setForgotStep(1);
            setForgotEmail('');
            setForgotNewPassword('');
            setForgotConfirmPassword('');
            setForgotOtp('');
          }}
        >
          <div
            style={{
              background: '#fff', padding: 32, borderRadius: 16, minWidth: 350,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">Quên mật khẩu</h3>
            {forgotStep === 1 ? (
              <form onSubmit={handleForgotSubmit}>
                <input
                  type="email"
                  className="w-full h-[50px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none mb-4"
                  placeholder="Nhập email đăng ký"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="w-full h-[50px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none mb-4"
                  placeholder="Nhập mật khẩu mới"
                  value={forgotNewPassword}
                  onChange={e => setForgotNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="w-full h-[50px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none mb-4"
                  placeholder="Xác nhận mật khẩu mới"
                  value={forgotConfirmPassword}
                  onChange={e => setForgotConfirmPassword(e.target.value)}
                  required
                />
                <button type="submit" className="w-full bg-[#4fd1c5] text-white font-semibold rounded-full px-8 py-3">
                  Gửi OTP xác nhận
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-4">
                  <label htmlFor="otp" className="font-bold">Nhập mã OTP (4 số):</label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={4}
                    className="w-full h-[50px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none mt-2"
                    placeholder="Nhập mã OTP"
                    value={forgotOtp}
                    onChange={e => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-[#4fd1c5] text-white font-semibold rounded-full px-8 py-3">
                  Xác nhận OTP & Đổi mật khẩu
                </button>
              </form>
            )}
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotStep(1);
                setForgotEmail('');
                setForgotNewPassword('');
                setForgotConfirmPassword('');
                setForgotOtp('');
              }}
              style={{ position: 'absolute', top: 8, right: 16, fontSize: 24, color: '#aaa', border: 'none', background: 'none', cursor: 'pointer' }}
              aria-label="Đóng"
            >×</button>
          </div>
        </div>
      )}

      {/* Đăng ký 2 bước */}
      <div className={`auth-box ${isSignUp ? 'right-panel-active' : ''}`} id="authBox">
        {/* Đăng ký step 1 */}
        {isSignUp && registerStep === 1 && (
          <div className="form-container sign-up-container ">
            <form className="form" onSubmit={handleRegister}>
              <h2 className="text-7xl font-bold text-[#4fd1c5] mb-[50px]">Đăng ký</h2>
              <div className="mt-10 flex flex-col items-center space-y-5">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
                  value={registerData.name}
                  onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
                  value={registerData.email}
                  onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
                  value={registerData.password}
                  onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Xác nhận lại mật khẩu"
                  className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
                  value={registerData.confirmPassword}
                  onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                />
                <button type="submit" className="bg-[#4fd1c5] text-white text-xl font-semibold rounded-full px-20 py-5 mt-6">
                  GỬI OTP XÁC NHẬN
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Đăng ký step 2 */}
        {isSignUp && registerStep === 2 && (
          <div className="form-container sign-up-container">
            <form className="form" onSubmit={handleRegisterOtp}>
              <h2 className="text-4xl font-bold text-[#4fd1c5] mb-[20px]">Nhập mã OTP đã gửi về email</h2>
              <input
                type="text"
                maxLength={4}
                className="w-[250px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none mb-4 text-center text-2xl tracking-widest"
                placeholder="OTP (4 số)"
                value={registerOtp}
                onChange={e => setRegisterOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                required
              />
              <button type="submit" className="bg-[#4fd1c5] text-white text-xl font-semibold rounded-full px-20 py-4 mt-3">
                XÁC NHẬN ĐĂNG KÝ
              </button>
              <button
                type="button"
                onClick={() => { setRegisterStep(1); setRegisterOtp(''); }}
                className="mt-3 text-gray-500 underline text-base"
              >
                Nhập lại thông tin đăng ký
              </button>
            </form>
          </div>
        )}
        {/* Đăng nhập */}
        {!isSignUp && (
          <div className="form-container sign-in-container ">
            <form className="form" onSubmit={handleLogin}>
              <h2 className="text-7xl font-bold text-[#4fd1c5] mb-10">Đăng nhập </h2>
              <div className="mt-15 flex flex-col items-center space-y-5">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <a
                  href="#"
                  className="text-xl text-black-500 underline block"
                  onClick={e => { e.preventDefault(); setShowForgotPassword(true); }}
                >
                  Quên mật khẩu?
                </a>
                <button type="submit" className="bg-[#4fd1c5] text-white text-xl font-semibold rounded-full px-20 py-5 mt-6 ">
                  ĐĂNG NHẬP
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2 className="text-5xl font-bold mb-3">Chào mừng trở lại!</h2>
              <p className="mb-5 text-center px-6 text-xl mt-5">
                Để tiếp tục kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân
              </p>
              <button
                onClick={() => { setIsSignUp(false); setRegisterStep(1); setRegisterOtp(''); }}
                className="border border-white text-white text-xl font-semibold rounded-full px-20 py-5 mt-6 bg-transparent hover:bg-white hover:text-[#4fd1c5] transition"
              >
                ĐĂNG NHẬP
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2 className="text-5xl font-bold mb-3">Xin chào bạn mới!</h2>
              <p className="mb-5 text-center px-6 text-xl mt-5">
                Hãy nhập thông tin cá nhân để bắt đầu hành trình cùng chúng tôi
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="border border-white text-white text-xl font-semibold rounded-full px-20 py-5 mt-6 bg-transparent hover:bg-white hover:text-[#4fd1c5] transition"
              >
                ĐĂNG KÝ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Login;
