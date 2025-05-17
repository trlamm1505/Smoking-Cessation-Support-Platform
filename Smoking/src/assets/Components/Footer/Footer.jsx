import React, { useEffect, useState } from 'react';

const Footer = () => {
   // State để kiểm soát hiển thị nút back-to-top
  const [showButton, setShowButton] = useState(false);

  // Effect xử lý sự kiện scroll
  useEffect(() => {
    // Hàm xử lý khi scroll
    const handleScroll = () => {
      // Nếu scroll xuống quá 300px thì hiển thị nút back-to-top
      setShowButton(window.scrollY > 300);
    };

    // Thêm event listener khi component mount
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup: gỡ bỏ event listener khi component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Dependency array rỗng nghĩa là chỉ chạy 1 lần khi mount

  // Hàm xử lý scroll lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, // Vị trí đầu trang
      behavior: 'smooth' // Hiệu ứng cuộn mượt
    });
  };


  return (
    <footer className="bg-[#63c3c3] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="animate__animated animate__fadeInUp">
            <div className="flex items-center mb-6">
              <img
                src="/public/Images/logo.jpg"
                alt="Logo"
                width={120}
                height={120}
                className="rounded-full object-cover w-20 h-20"
              />
              <span className="ml-4 text-2xl font-bold text-white">Quit Smoking</span>
            </div>
            <p className="text-white font-medium mb-6">
             Quit Strong. Live Long!
            </p>
          </div>

          {/* Pages Column */}
          <div className="animate__animated animate__fadeInUp">
            <h3 className="text-xl font-semibold mb-4 border-b border-orange-300 pb-2 text-white">Pages</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white hover:text-orange-200 transition font-medium">About Us</a></li>
              <li><a href="#" className="text-white hover:text-orange-200 transition font-medium">How It Works</a></li>
              <li><a href="#" className="text-white hover:text-orange-200 transition font-medium">Blog</a></li>
              <li><a href="#" className="text-white hover:text-orange-200 transition font-medium">FAQ</a></li>
              <li><a href="#" className="text-white hover:text-orange-200 transition font-medium">Our Team</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="animate__animated animate__fadeInUp">
            <h3 className="text-xl font-semibold mb-4 border-b border-orange-300 pb-2 text-white">Contact</h3>
            <address className="not-italic space-y-2 text-white font-medium">
              <p>123 Smoke-Free St, Ho Chi Minh, Vietnam</p>
              <p>support@quitsmoking.com</p>
              <p className="flex items-center">
                <span className="mr-2">📞</span> 0123 456 789
              </p>
            </address>
          </div>

          {/* Newsletter Column */}
          <div className="animate__animated animate__fadeInUp">
            <h3 className="text-xl font-semibold mb-4 border-b border-orange-300 pb-2 text-white">Newsletter</h3>
            <p className="text-white font-medium mb-4">
              Stay smoke-free with our weekly tips and motivation.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 flex-grow"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full whitespace-nowrap transition">
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-orange-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white font-medium mb-4 md:mb-0">
              © Quit Smoking 2025 | All Rights Reserved
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-orange-200 transition font-medium">Terms</a>
              <a href="#" className="text-white hover:text-orange-200 transition font-medium">Privacy</a>
              <a href="#" className="text-white hover:text-orange-200 transition font-medium">Contact</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center w-12 h-12"
          aria-label="Back to top"
        >
          <span className="text-xl font-bold">↑</span>
        </button>
      )}
    </footer>
  );
};

export default Footer;