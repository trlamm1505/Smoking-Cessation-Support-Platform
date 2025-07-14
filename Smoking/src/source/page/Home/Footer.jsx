import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Footer = () => {
  const [showButton, setShowButton] = useState(false);

  // Quan sát vị trí hiển thị của Footer
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact"
      ref={ref}
      className={`bg-[#2c7a87] text-white py-12 mt-20 transition-all duration-700 ${inView ? 'animate__animated animate__zoomIn' : 'opacity-0'
        }`}
    >
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Slogan */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/Images/logo.jpg"
                alt="Logo"
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20"
              />
              <span className="ml-4 text-2xl font-bold">Quit Smoking</span>
            </div>
            <p className="text-white text-sm">Cai mạnh mẽ. Sống lâu hơn!</p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b border-orange-300 inline-block">Các trang</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-200 transition">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-orange-200 transition">Cách hoạt động</a></li>
              <li><a href="#" className="hover:text-orange-200 transition">Blog</a></li>
              <li><a href="#" className="hover:text-orange-200 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-orange-200 transition">Đội ngũ của chúng tôi</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b border-orange-300 inline-block">Liên hệ</h3>
            <address className="not-italic space-y-2 text-sm">
              <p>support@quitsmoking.com</p>
              <p>📞 0123 456 789</p>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b border-orange-300 inline-block">Bản tin</h3>
            <p className="text-sm mb-3">Luôn sống không khói thuốc với các mẹo và động lực hàng tuần của chúng tôi.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
              <button
                onClick={() => { window.location.href = '/login#signup'; }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition text-xl">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
          <p className="mb-3 md:mb-0">© Cai thuốc lá 2025 | Bảo lưu mọi quyền</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-orange-300">Điều khoản</a>
            <a href="#" className="hover:text-orange-300">Quyền riêng tư</a>
            <a href="#" className="hover:text-orange-300">Liên hệ</a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg w-12 h-12 flex items-center justify-center"
          aria-label="Trở về đầu trang"
        >
          ↑
        </button>
      )}
    </footer>
  );
};

export default Footer;
