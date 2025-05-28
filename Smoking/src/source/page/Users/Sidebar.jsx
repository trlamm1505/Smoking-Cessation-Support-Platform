import React from 'react'
import { Link } from 'react-router'
import { HomeOutlined, LineChartOutlined, CalendarOutlined, TrophyOutlined, TeamOutlined, MessageOutlined, FileTextOutlined, CrownOutlined, SmileOutlined, ScheduleOutlined, StarOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const SidebarContainer = styled.div`
    width: 250px;
    min-height: calc(100vh - 64px); // Trừ đi chiều cao của header
    background: white;
    padding: 20px 0;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
`;

const MenuItem = styled(Link)`
    display: flex;
    align-items: center;
    padding: 12px 24px;
    color: #666;
    text-decoration: none;
    transition: all 0.3s;

    &:hover, &.active {
        color: #5FB8B3;
        background: #f0f9f8;
    }

    .anticon {
        font-size: 20px;
        margin-right: 12px;
    }

    span {
        font-size: 16px;
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
            path: '/users/progress',
            name: 'Tiến Trình Cai Thuốc',
            icon: <LineChartOutlined />
        },
        {
            path: '/users/plan',
            name: 'Kế Hoạch Cai Thuốc',
            icon: <CalendarOutlined />
        },
        {
            path: '/users/smoking-tracker',
            name: 'Ghi Nhận Thói Quen',
            icon: <SmileOutlined />
        },
        {
            path: '/users/schedule',
            name: 'Lịch Trình Chi Tiết',
            icon: <ScheduleOutlined />
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
            path: '/users/reviews',
            name: 'Đánh Giá',
            icon: <StarOutlined />
        },
        {
            path: '/users/blog',
            name: 'Blog',
            icon: <FileTextOutlined />
        },
        {
            path: '/users/premium',
            name: 'Gói Thành Viên',
            icon: <CrownOutlined />
        }
    ];

    return (
        <SidebarContainer>
            {menuItems.map((item, index) => (
                <MenuItem to={item.path} key={index} activeClassName="active">
                    {item.icon}
                    <span>{item.name}</span>
                </MenuItem>
            ))}
        </SidebarContainer>
    );
};

export default Sidebar; 