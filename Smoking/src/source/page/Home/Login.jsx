import React, { useState, useEffect } from 'react'
import '../../CSS/Login.css';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === '#signup') {
      setIsSignUp(true);
    }
  }, []);

  const handleRegister = async (e) => {
  e.preventDefault();
  const password = registerData.password.trim();
  const confirmPassword = registerData.confirmPassword.trim();

  // Lưu ý: Đã kiểm tra confirm ở frontend, vẫn cần gửi cho backend.
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: registerData.name,          // Đổi name -> fullName
        email: registerData.email,
        password: password,
        confirmPassword: confirmPassword      // Thêm trường này!
      })
    });
    const data = await response.json();
    if (response.ok) {
      navigate('/guest/home');
    } else {
      alert(data.message || 'Đăng ký thất bại!');
    }
  } catch (error) {
    alert('Lỗi kết nối server!');
  }
};

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (!data.user?.isPremium) {
          navigate('/guest/home');
        } else {
          // Nếu đã mua gói, chuyển hướng sang trang khác nếu muốn
          // navigate('/premium/home');
        }
      } else {
        alert('Đăng nhập thất bại!');
      }
    } catch (error) {
      alert('Lỗi kết nối server!');
    }
  };

  return (
    <div className="auth-container">
      <div
        className={`auth-box ${isSignUp ? 'right-panel-active' : ''}`}
        id="authBox"
      >
        {/* Form Đăng ký */}
        <div className="form-container sign-up-container ">
          <form className="form" onSubmit={handleRegister}>
            <h2 className="text-7xl font-bold text-[#4fd1c5] mb-[50px]">Đăng ký</h2>

            {/* Các trường nhập */}
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

              {/* Nút đăng ký */}
              <button type="submit" className="bg-[#4fd1c5] text-white text-xl font-semibold rounded-full px-20 py-5 mt-6">
                ĐĂNG KÝ
              </button>
            </div>
          </form>
        </div>


        {/* Form Đăng nhập */}
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
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              />
              <a
                href="#"
                className="text-xl text-black-500 underline block"
              >
                Quên mật khẩu?
              </a>
              <button type="submit" className="bg-[#4fd1c5] text-white text-xl font-semibold rounded-full px-20 py-5 mt-6 ">
                ĐĂNG NHẬP
              </button>

            </div>


          </form>
        </div>

        {/* Phần Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left  ">
              <h2 className="text-5xl font-bold mb-3">Chào mừng trở lại!</h2>
              <p className="mb-5 text-center px-6 text-xl mt-5">
                Để tiếp tục kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân
              </p>
              <button
                onClick={() => setIsSignUp(false)}
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
}

export default AuthForm
