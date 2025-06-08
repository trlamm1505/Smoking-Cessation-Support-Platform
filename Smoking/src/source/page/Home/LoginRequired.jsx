import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginRequired = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-[#6ecacb]/30">
                <div className="bg-[#e0f7f7] rounded-full p-3 mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#6ecacb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#5bb3b4] text-center">Bạn cần đăng nhập</h2>
                <p className="text-base text-gray-500 mb-8 text-center">Vui lòng đăng nhập để sử dụng các chức năng đặc biệt của nền tảng.</p>
                <button
                    className="w-full py-3 px-6 bg-gradient-to-r from-[#6ecacb] to-[#5bb3b4] text-white text-lg font-semibold rounded-xl shadow-md hover:from-[#5bb3b4] hover:to-[#6ecacb] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6ecacb]"
                    onClick={() => navigate('/login')}
                >
                    <span className="inline-flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                        Đăng nhập ngay
                    </span>
                </button>
            </div>
        </div>
    )
}

export default LoginRequired 