import React, { useState, useEffect } from 'react'
import '../../CSS/Login.css';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    if (window.location.hash === '#signup') {
      setIsSignUp(true);
    }
  }, []);

  return (
    <div className="auth-container">
      <div
        className={`auth-box ${isSignUp ? 'right-panel-active' : ''}`}
        id="authBox"
      >
        {/* Form Đăng ký */}
        <div className="form-container sign-up-container ">
          <form className="form">
            <h2 className="text-7xl font-bold text-[#4fd1c5] mb-[50px]">Đăng ký</h2>

            {/* Mạng xã hội */}
            <div className="flex justify-center gap-4 my-5">
              <a
                href="#"
                className="w-[80px] h-[80px] flex items-center justify-center border border-gray-300 rounded-full text-[35px] font-bold hover:bg-gray-100 transition"
              >
                f
              </a>
              <a
                href="#"
                className="w-[80px] h-[80px] flex items-center justify-center border border-gray-300 rounded-full text-[35px] font-bold hover:bg-gray-100 transition"
              >
                G+
              </a>
              <a
                href="#"
                className="w-[80px] h-[80px] flex items-center justify-center border border-gray-300 rounded-full text-[35px] font-bold hover:bg-gray-100 transition"
              >
                in
              </a>
            </div>

            {/* Các trường nhập */}
            <div className="mt-10 flex flex-col items-center space-y-5">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
              />

              {/* Nút đăng ký */}
              <button className="bg-[#4fd1c5] text-white text-xl font-semibold rounded-full px-20 py-5 mt-6">
                ĐĂNG KÝ
              </button>
            </div>
          </form>
        </div>


        {/* Form Đăng nhập */}
        <div className="form-container sign-in-container ">
          <form className="form">
            <h2 className="text-7xl font-bold text-[#4fd1c5] mb-10">Đăng nhập </h2>
            <div className="flex justify-center gap-5 ">
              <a
                href="#"
                className="w-[80px] h-[80px] flex items-center justify-center border border-gray-300 rounded-full text-[30px] font-bold hover:bg-gray-100 transition"
              >
                f
              </a>
              <a
                href="#"
                className="w-[80px] h-[80px] flex items-center justify-center border border-gray-300 rounded-full text-[30px] font-bold hover:bg-gray-100 transition"
              >
                G+
              </a>
              <a
                href="#"
                className="w-[80px] h-[80px] flex items-center justify-center border border-gray-300 rounded-full text-[30px] font-bold hover:bg-gray-100 transition"
              >
                in
              </a>
            </div>

            <div className="mt-15 flex flex-col items-center space-y-5">
              <input
                type="email"
                placeholder="Email"
                className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-[450px] h-[60px] px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none"
              />
              <a
                href="#"
                className="text-xl text-black-500 underline block"
              >
                Quên mật khẩu?
              </a>
              <button className="bg-[#4fd1c5] text-white text-xl font-semibold rounded-full px-20 py-5 mt-6 ">
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
