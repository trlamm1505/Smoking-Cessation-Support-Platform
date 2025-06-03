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
    // Use Tailwind classes for layout
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b border-gray-200">
          {/* Logo area - Make clickable */}
          <Link to="/coach" className="flex items-center space-x-2">
             {/* Replace with actual logo image */}
             <img src="/Images/logo.jpg" alt="SmokeFree Logo" className="w-8 h-8 rounded-full"/>
             <span className="text-xl font-semibold text-[#5FB8B3]">Coach Portal</span> {/* Updated text */}
          </Link>
        </div>
        <ul className="flex flex-col p-2 flex-grow">
          {/* Removed 'Bảng điều khiển' link */}
          {/*
          <li>
            <Link to="/coach/home" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/home') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <HomeOutlined className="text-lg" />
              <span className="text-base">Bảng điều khiển</span>
            </Link>
          </li>
          */}
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
            <Link to="/coach/blog-view" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/blog-view') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <ReadOutlined className="text-lg" /> {/* Icon for Blog View */}
              <span className="text-base">Xem Blog</span> {/* Link text */}
            </Link>
          </li>
          <li>
            <Link to="/coach/blog" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/blog') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <EditOutlined className="text-lg" />
              <span className="text-base">Quản lý Blog</span>
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

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
           <button 
              onClick={handleLogoutClick}
              className="flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3] w-full text-left transition-colors"
            >
             <LogoutOutlined className="text-lg" />
             <span className="text-base">Đăng xuất</span>
           </button>
        </div>

      </nav>

      {/* Main content area */}
      <main className="flex-1 flex flex-col">
        <CoachHeader /> {/* Include the CoachHeader component */}
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