import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
// import '../../CSS/Coach/CoachLayout.css'; // Remove CSS file import
import { HomeOutlined, TeamOutlined, CalendarOutlined, BarChartOutlined, UserOutlined, LogoutOutlined, EditOutlined, WarningOutlined, ContainerOutlined, ReadOutlined } from '@ant-design/icons';
import CoachHeader from './CoachHeader';
import { Menu, Modal, Button } from 'antd';

const CoachLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Handle logout button click (opens modal)
  const handleLogoutClick = () => {
    setIsLogoutModalVisible(true);
  };

  // Handle actual logout after confirmation
  const handleConfirmLogout = () => {
    console.log('Logging out...');
    navigate('/');
    setIsLogoutModalVisible(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  const handleMenuClick = (e) => {
    // Handle menu item click
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav
        className="w-64 bg-white shadow-md flex flex-col"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 100,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div className="p-4 border-b border-gray-200">
          {/* Logo area - Make clickable */}
          <Link to="/coach" className="flex items-center space-x-2">
             <img src="/Images/logo.jpg" alt="SmokeFree Logo" className="w-14 h-14 rounded-full"/>
             <span className="text-xl font-semibold text-[#5FB8B3]">Coach Portal</span>
          </Link>
        </div>
        <ul className="flex flex-col p-2 flex-grow">
         <li>
         <Link to="/coach" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/consultation') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <HomeOutlined className="text-lg" />
              <span className="text-base">Trang Chủ</span>
            </Link>
         </li>
          <li>
            <Link to="/coach/members" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/members') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <TeamOutlined className="text-lg" />
              <span className="text-base">Khách hàng</span>
            </Link>
          </li>
           <li>
            <Link to="/coach/consultation" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/consultation') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <CalendarOutlined className="text-lg" />
              <span className="text-base">Lịch tư vấn</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/statistics" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/statistics') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <BarChartOutlined className="text-lg" />
              <span className="text-base">Thống kê</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/community" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/community') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <TeamOutlined className="text-lg" />
              <span className="text-base">Cộng đồng</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/blog" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/blog') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <ReadOutlined className="text-lg" />
              <span className="text-base">Blog</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/profile" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/profile') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <UserOutlined className="text-lg" />
              <span className="text-base">Hồ sơ</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/report" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/report') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <WarningOutlined className="text-lg" />
              <span className="text-base">Báo cáo</span>
            </Link>
          </li>
        </ul>

        {/* Logout Button - moved up */}
           <button 
              onClick={handleLogoutClick}
          className="flex items-center space-x-3 p-2 mx-2 mb-4 rounded-md text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3] w-full text-left transition-colors border-t border-gray-200"
            >
             <LogoutOutlined className="text-lg" />
             <span className="text-base">Đăng xuất</span>
           </button>

      </nav>

      {/* Main content area */}
      <main className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}>
        <CoachHeader className="sticky top-0 w-full z-10" /> {/* Include the CoachHeader component */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Xác nhận đăng xuất"
        open={isLogoutModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
        okButtonProps={{ 
            danger: true,
            icon: <LogoutOutlined />
        }}
      >
          <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
      </Modal>

    </div>
  );
};

export default CoachLayout; 