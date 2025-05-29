import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowHeader(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 830;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setIsOverlayOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { label: 'Trang chủ', id: 'home' },
    { label: 'Dịch vụ', id: 'services' },
    { label: 'Gói dịch vụ', id: 'package' },
    { label: 'Giới thiệu', id: 'about' },
    { label: 'Liên hệ', id: 'contact' },
  ];

  // Hàm để đóng menu mobile khi click vào link
  const handleNavClick = () => {
    setIsOverlayOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <nav className="bg-white border-gray-200">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
            {/* Logo */}
            <a href="#home" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img
                src="/Images/logo.jpg"
                alt="Logo"
                className="w-25 h-25 mt-4 rounded-full object-cover"
              />
            </a>

            {/* Hamburger Button */}
            {isMobile && (
              <button
                onClick={() => setIsOverlayOpen(true)}
                className="items-center p-2 w-16 h-16 justify-center text-sm text-gray-500 rounded-lg hover:bg-white"
                aria-label="Open menu"
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {/* Mobile Overlay Menu */}
            {isMobile && isOverlayOpen && (
              <div className="fixed top-0 left-0 w-1/2 h-screen bg-white z-50 p-10 overflow-y-auto shadow-lg">
                <button
                  onClick={() => setIsOverlayOpen(false)}
                  className="absolute top-5 right-5 text-4xl font-bold text-black"
                  aria-label="Close menu"
                >
                  ×
                </button>
                <div className="flex flex-col mt-10 space-y-6">
                  {navItems.map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.id}`}
                      onClick={handleNavClick}
                      className="font-bold text-gray-900 text-lg hover:text-red-500 cursor-pointer"
                    >
                      {item.label}
                    </a>
                  ))}
                  <a
                    href="/login"
                    className="relative overflow-hidden font-bold text-white rounded-full text-base px-5 py-2 w-full bg-[#5FB8B3] group flex justify-center items-center text-center"
                  >
                    <span className="absolute top-0 left-0 w-full h-0 bg-[#85BB47] transition-all duration-500 ease-in-out group-hover:h-full z-0"></span>
                    <span className="relative z-10">Đăng nhập</span>
                  </a>
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <div className="hidden md:block md:w-auto" id="navbar">
                  <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 border rounded-lg md:border-0 bg-white">
                    {navItems.map((item, idx) => (
                      <li key={idx}>
                        <a
                          href={`#${item.id}`}
                          className="font-bold block py-2 px-3 text-gray-900 md:p-0 hover:text-red-500 cursor-pointer"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden md:flex space-x-5 mt-5 md:mt-0">
                  <a
                    href="/login"
                    className="relative overflow-hidden font-bold mt-3 text-white rounded-full text-2xl px-10 py-3 bg-[#5FB8B3] group flex justify-center items-center"
                  >
                    <span className="absolute top-0 left-0 w-full h-0 bg-[#85BB47] transition-all duration-500 ease-in-out group-hover:h-full z-0"></span>
                    <span className="relative z-10">Đăng nhập</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Global CSS for smooth scroll */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default Header;
