import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 830;
      setIsMobile(isNowMobile);

      // Tự động đóng menu khi lên desktop
      if (!isNowMobile) {
        setIsOverlayOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header>
      <nav className="bg-white border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/public/Images/logo.jpg" className="w-24 mt-4" alt="Logo" />
          </a>

          {/* Hamburger Button */}
          {isMobile && (
            <button
              onClick={() => setIsOverlayOpen(true)}
              className="items-center p-2 w-16 h-16 justify-center text-sm text-gray-500 rounded-lg hover:bg-white"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Mobile Overlay Menu */}
          {isMobile && isOverlayOpen && (
            <div className="fixed inset-y-0 left-0 w-2/3 sm:w-1/2 bg-white z-50 p-10 transition-transform duration-300 ease-in-out transform translate-x-0">
              <button
                onClick={() => setIsOverlayOpen(false)}
                className="absolute top-5 right-5 text-4xl font-bold text-black"
              >
                ×
              </button>

              <div className="flex flex-col mt-10 space-y-6">
                {[{ title: 'Demo', items: ['Home 01', 'Home 02', 'Home 03', 'Home 04'] },
                  { title: 'Services', items: ['Services', 'Service Details'] },
                  { title: 'Pages', items: ['Blogs', 'Teams', 'FAQ', 'Portfolio', 'Pricing', 'Utilities'] }
                ].map((menu, idx) => (
                  <div className="relative group" key={idx}>
                    <div className="flex justify-between items-center w-full font-bold text-gray-900 cursor-pointer">
                      {menu.title}
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="absolute left-full top-0 ml-2 w-44 bg-white rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out">
                      <ul className="py-2 text-sm text-gray-700">
                        {menu.items.map((item, i) => (
                          <li key={i}>
                            <a href="#" className="font-bold block px-4 py-2 hover:text-red-500">{item}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                <a href="#" className="font-bold text-gray-900">About</a>
                <a href="#" className="font-bold text-gray-900">Contact</a>

                {["Login", "Sign up free"].map((text, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="relative overflow-hidden font-bold text-white rounded-full text-base px-5 py-2 w-full bg-[#5FB8B3] group"
                  >
                    <span className="absolute top-0 left-0 w-full h-0 bg-[#85BB47] transition-all duration-500 ease-in-out group-hover:h-full z-0"></span>
                    <span className="relative z-10">{text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <div className="hidden md:block md:w-auto" id="navbar-multi-level">
                <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 border rounded-lg md:border-0 bg-white">
                  {[{ title: 'Demo', items: ['Home 01', 'Home 02', 'Home 03', 'Home 04'] },
                    { title: 'Services', items: ['Services', 'Service Details'] },
                    { title: 'Pages', items: ['Blogs', 'Teams', 'FAQ', 'Portfolio', 'Pricing', 'Utilities'] }
                  ].map((menu, idx) => (
                    <li className="relative group" key={idx}>
                      <div className="font-bold flex items-center w-full py-2 px-3 text-gray-900 md:p-0 cursor-pointer">
                        {menu.title}
                        <svg className="ml-2 w-3 h-3 transition-transform duration-300 group-hover:-rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="absolute left-0 z-10 w-44 rounded-lg bg-white shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out">
                        <ul className="py-2 text-sm text-gray-700">
                          {menu.items.map((item, i) => (
                            <li key={i}>
                              <a href="#" className="font-bold block px-4 py-2 hover:text-red-500">{item}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                  <li><a href="#" className="font-bold block py-2 px-3 text-gray-700 md:p-0">About</a></li>
                  <li><a href="#" className="font-bold block py-2 px-3 text-gray-900 md:p-0">Contact</a></li>
                </ul>
              </div>

              <div className="hidden md:flex space-x-5 mt-5 md:mt-0">
                {["Login", "Sign up free"].map((text, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="relative overflow-hidden font-bold mt-3 text-white rounded-full text-base px-7 py-3 bg-[#5FB8B3] group"
                  >
                    <span className="absolute top-0 left-0 w-full h-0 bg-[#85BB47] transition-all duration-500 ease-in-out group-hover:h-full z-0"></span>
                    <span className="relative z-10">{text}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
