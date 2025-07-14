import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Menu, Modal, Button } from 'antd';
import AdminHeader from './AdminHeader';
import {
    HomeOutlined,
    TeamOutlined,
    BookOutlined,
    DollarOutlined,
    LogoutOutlined,
    ReadOutlined,
    MessageOutlined,
    UserOutlined
} from '@ant-design/icons';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const isActive = (path) => {
        return location.pathname === path || (path.includes('-manage') && location.pathname.startsWith(path.replace('-manage', '')));
    };

    const handleLogoutClick = () => {
        setIsLogoutModalVisible(true);
    };

    const handleConfirmLogout = () => {
        console.log('Logging out admin...');
        navigate('/');
        setIsLogoutModalVisible(false);
    };

    const handleCancelLogout = () => {
        setIsLogoutModalVisible(false);
    };

    const menuItems = [
        {
            key: 'dashboard',
            icon: <HomeOutlined/>,
            label: 'Trang Chủ',
        },
        {
            key: 'community-manage',
            icon: <TeamOutlined />,
            label: 'Quản lý bài viết cộng đồng',
        },
        {
            key: 'revenue',
            icon: <DollarOutlined />,
            label: 'Thống kê doanh thu',
        },
        {
            key: 'package-manage',
            icon: <DollarOutlined />,
            label: 'Quản lý gói Premium',
        },
        {
            key: 'blog',
            icon: <ReadOutlined />,
            label: 'Quản lý Blog',
        },
        {
            key: 'reports',
            icon: <MessageOutlined />,
            label: 'Quản lý Báo cáo & Phản hồi',
        },
        {
            key: 'user-coach',
            icon: <UserOutlined />,
            label: 'Quản lý Người dùng & Coach',
        },
        {
            key: 'calls',
            icon: <MessageOutlined />,
            label: 'Quản lý cuộc gọi',
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
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
                    <Link to="/admin/dashboard" className="flex items-center space-x-2 flex-shrink-0 no-underline">
                       <img src="/Images/logo.jpg" alt="SmokeFree Logo" className="w-14 h-14 rounded-full"/>
                       <span className="text-xl font-semibold text-[#5FB8B3]">Admin Portal</span>
                    </Link>
                </div>

                <ul className="flex flex-col p-2 flex-grow">
                    {menuItems.map(item => (
                        <li key={item.key}>
                            <Link to={`/admin/${item.key}`} className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${ 
                                isActive(`/admin/${item.key}`) ? 'bg-[#f0f9f8] text-[#5FB8B3] font-semibold' : 'text-gray-700 hover:bg-[#f0f9f8] hover:text-[#5FB8B3]' 
                            }`}>
                                {React.cloneElement(item.icon, { className: 'text-lg' })}
                                <span className="text-base">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

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

            <main className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}>
                <AdminHeader className="sticky top-0 w-full z-10" />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <Outlet />
                    </div>
                </div>
            </main>

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
                <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?</p>
            </Modal>
        </div>
    );
};

export default AdminLayout; 