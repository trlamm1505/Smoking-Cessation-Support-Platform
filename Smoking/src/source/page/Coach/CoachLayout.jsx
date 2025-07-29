

// Import các hook và component cần thiết từ React và các thư viện
import React, { useState } from 'react'; // useState để quản lý trạng thái modal
import { Outlet, Link, useLocation, useNavigate } from 'react-router'; // Outlet để render các route con, Link để chuyển trang, useLocation để lấy đường dẫn hiện tại, useNavigate để chuyển trang bằng code
// import '../../CSS/Coach/CoachLayout.css'; // Đã bỏ import CSS cũ
import { HomeOutlined, TeamOutlined, CalendarOutlined, BarChartOutlined, UserOutlined, LogoutOutlined, EditOutlined, WarningOutlined, ContainerOutlined, ReadOutlined } from '@ant-design/icons'; // Import các icon dùng cho sidebar
import CoachHeader from './CoachHeader'; // Header của coach
import { Menu, Modal, Button } from 'antd'; // Các component UI của Ant Design



// Component layout chính cho Coach Portal
const CoachLayout = () => {
  // Lấy thông tin đường dẫn hiện tại để xác định menu đang active
  const location = useLocation(); // Hook lấy đường dẫn hiện tại
  // Dùng để chuyển trang khi logout hoặc click menu
  const navigate = useNavigate(); // Hook chuyển trang
  // Quản lý trạng thái hiển thị modal xác nhận logout
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); // Modal xác nhận đăng xuất

  // Hàm kiểm tra menu nào đang active (được highlight)
  const isActive = (path) => {
    // Nếu đường dẫn hiện tại chứa path thì menu đó active
    return location.pathname.includes(path);
  };

  // Khi bấm nút Đăng xuất, mở modal xác nhận
  const handleLogoutClick = () => {
    setIsLogoutModalVisible(true);
  };

  // Khi xác nhận đăng xuất, chuyển về trang chủ và đóng modal
  const handleConfirmLogout = () => {
    console.log('Logging out...'); // Log ra console
    navigate('/'); // Chuyển về trang chủ
    setIsLogoutModalVisible(false); // Đóng modal
  };

  // Khi hủy đăng xuất, đóng modal
  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  // Xử lý khi click menu (có thể mở rộng sau)
  const handleMenuClick = (e) => {
    // Handle menu item click
  };

  // Render giao diện layout
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar bên trái - menu chức năng cho coach */}
      <nav
        className="w-64 bg-white shadow-md flex flex-col"
        style={{
          position: 'fixed', // Cố định bên trái
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 100,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        {/* Logo và tên portal */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/coach" className="flex items-center space-x-2">
             <img src="/Images/logo.jpg" alt="SmokeFree Logo" className="w-14 h-14 rounded-full"/>
             <span className="text-xl font-semibold text-[#5FB8B3]">Coach Portal</span>
          </Link>
        </div>
        {/* Menu sidebar các chức năng chính */}
        <ul className="flex flex-col p-2 flex-grow">
         {/* Trang chủ coach */}
         <li>
         <Link to="/coach" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/consultation') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <HomeOutlined className="text-lg" />
              <span className="text-base">Trang Chủ</span>
            </Link>
         </li>
         {/* Quản lý khách hàng */}
          <li>
            <Link to="/coach/members" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/members') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <TeamOutlined className="text-lg" />
              <span className="text-base">Khách hàng</span>
            </Link>
          </li>
          {/* Lịch tư vấn */}
           <li>
            <Link to="/coach/consultation" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/consultation') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <CalendarOutlined className="text-lg" />
              <span className="text-base">Lịch tư vấn</span>
            </Link>
          </li>
          {/* Thống kê */}
          <li>
            <Link to="/coach/statistics" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/statistics') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <BarChartOutlined className="text-lg" />
              <span className="text-base">Thống kê</span>
            </Link>
          </li>
          {/* Cộng đồng */}
          <li>
            <Link to="/coach/community" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/community') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <TeamOutlined className="text-lg" />
              <span className="text-base">Cộng đồng</span>
            </Link>
          </li>
          {/* Blog */}
          <li>
            <Link to="/coach/blog" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/blog') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <ReadOutlined className="text-lg" />
              <span className="text-base">Blog</span>
            </Link>
          </li>
          {/* Hồ sơ coach */}
          <li>
            <Link to="/coach/profile" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/profile') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <UserOutlined className="text-lg" />
              <span className="text-base">Hồ sơ</span>
            </Link>
          </li>
          {/* Báo cáo */}
          <li>
            <Link to="/coach/report" className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive('/coach/report') ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]'
            }`}>
              <WarningOutlined className="text-lg" />
              <span className="text-base">Báo cáo</span>
            </Link>
          </li>
        </ul>

        {/* Nút đăng xuất ở cuối sidebar */}
           <button 
              onClick={handleLogoutClick}
          className="flex items-center space-x-3 p-2 mx-2 mb-4 rounded-md text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3] w-full text-left transition-colors border-t border-gray-200"
            >
             <LogoutOutlined className="text-lg" />
             <span className="text-base">Đăng xuất</span>
           </button>

      </nav>

      {/* Khu vực nội dung chính bên phải */}
      <main className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}>
        {/* Header coach cố định trên cùng */}
        <CoachHeader className="sticky top-0 w-full z-10" />
        {/* Nội dung động của từng trang con */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>

      {/* Modal xác nhận đăng xuất */}
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