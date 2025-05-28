import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
// import '../../CSS/Coach/CoachLayout.css'; // Remove CSS file import
import { HomeOutlined, TeamOutlined, CalendarOutlined, MessageOutlined, BarChartOutlined, UserOutlined, LogoutOutlined, EditOutlined, WarningOutlined, ContainerOutlined } from '@ant-design/icons';
import CoachHeader from './CoachHeader';
import { Menu } from 'antd';

const CoachLayout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Dummy logout function
  const handleLogout = () => {
    console.log('Logging out...');
    // Implement actual logout logic here (e.g., clearing token, redirecting to login)
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
              isActive('/coach/home') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <HomeOutlined className="text-lg" />
              <span className="text-base">Bảng điều khiển</span>
            </Link>
          </li>
          */}
          <li>
            <Link to="/coach/members" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/members') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <TeamOutlined className="text-lg" />
              <span className="text-base">Khách hàng</span>
            </Link>
          </li>
           <li>
            <Link to="/coach/consultation" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/consultation') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <CalendarOutlined className="text-lg" />
              <span className="text-base">Lịch tư vấn</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/messages" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/messages') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <MessageOutlined className="text-lg" />
              <span className="text-base">Tin nhắn</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/statistics" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/statistics') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <BarChartOutlined className="text-lg" />
              <span className="text-base">Thống kê</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/blog" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/blog') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <EditOutlined className="text-lg" />
              <span className="text-base">Quản lý Blog</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/profile" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/profile') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <UserOutlined className="text-lg" />
              <span className="text-base">Hồ sơ</span>
            </Link>
          </li>
          <li>
            <Link to="/coach/report" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/report') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <WarningOutlined className="text-lg" />
              <span className="text-base">Báo cáo</span>
            </Link>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
           <button onClick={handleLogout} className="flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
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
    </div>
  );
};

export default CoachLayout; 