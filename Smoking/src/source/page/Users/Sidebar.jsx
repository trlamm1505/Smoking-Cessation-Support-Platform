import React from 'react'
import { NavLink } from 'react-router-dom'
import { HomeOutlined, LineChartOutlined, CalendarOutlined, TrophyOutlined, TeamOutlined, MessageOutlined, FileTextOutlined, CrownOutlined, SmileOutlined, ScheduleOutlined, StarOutlined, LogoutOutlined, ReadOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const SidebarContainer = styled.div`
    width: 250px;
    min-height: calc(100vh - 64px); // Trừ đi chiều cao của header
    background: white;
    padding: 20px 0;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
`;

const MenuList = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const MenuItem = styled(NavLink)`
    display: flex;
    align-items: center;
    padding: 12px 24px;
    color: #666;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover, &.active {
        color: #5FB8B3;
        background: #e6f7f6;
        font-weight: 600;
    }

    .anticon {
        font-size: 20px;
        margin-right: 12px;
        transition: color 0.3s;
    }

    span {
        font-size: 16px;
    }
`;

const LogoutWrapper = styled.div`
    border-top: 1px solid #f0f0f0;
    padding-top: 8px;
    padding-bottom: 8px;
    background: #fff;
`;

const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    padding: 12px 24px;
    color: #666;
    background: none;
    border: none;
    width: 100%;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    outline: none;
    border-radius: 8px;
    &:hover {
        color: #ff4d4f;
        background: #fff1f0;
    }
    .anticon {
        font-size: 20px;
        margin-right: 12px;
    }
`;

const Sidebar = () => {
    const menuItems = [
        {
            path: '/users/home',
            name: 'Trang Chủ',
            icon: <HomeOutlined />
        },
        {
            path: '/users/plan',
            name: 'Kế Hoạch Cai Thuốc',
            icon: <CalendarOutlined />
        },
        {
            path: '/users/schedule',
            name: 'Lịch Trình Chi Tiết',
            icon: <ScheduleOutlined />
        },
        {
            path: '/users/smoking-tracker',
            name: 'Ghi Nhận Thói Quen',
            icon: <SmileOutlined />
        },
        
        {
            path: '/users/achievements',
            name: 'Thành Tích',
            icon: <TrophyOutlined />
        },
        {
            path: '/users/community',
            name: 'Cộng Đồng',
            icon: <TeamOutlined />
        },
        {
            path: '/users/consultation',
            name: 'Tư Vấn',
            icon: <MessageOutlined />
        },
        {
            path: '/users/blog',
            name: 'Blog',
            icon: <ReadOutlined />
        },
        {
            path: '/users/reviews',
            name: 'Đánh Giá',
            icon: <StarOutlined />
        },
        {
            path: '/users/premium',
            name: 'Gói Thành Viên',
            icon: <CrownOutlined />
        }
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <SidebarContainer>
            <MenuList>
                {menuItems.map((item, index) => (
                    <MenuItem to={item.path} key={index} className={({ isActive }) => isActive ? 'active' : ''}>
                        {item.icon}
                        <span>{item.name}</span>
                    </MenuItem>
                ))}
            </MenuList>
            <LogoutWrapper>
                <LogoutButton onClick={handleLogout}>
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                </LogoutButton>
            </LogoutWrapper>
        </SidebarContainer>
    );
};

export default Sidebar; 