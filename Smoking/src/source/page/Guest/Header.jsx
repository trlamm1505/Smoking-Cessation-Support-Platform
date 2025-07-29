import React from 'react';
import { Badge } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import styled from 'styled-components';
import Notification from './../Users/Notification';
import axiosClient from '../Axios/AxiosCLients';

const HeaderContainer = styled.header`
  background: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1100;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  
  span {
    font-size: 1.8rem;
    font-weight: bold;
    color: #5FB8B3;
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  a {
    color: #666;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    
    &:hover {
      color: #5FB8B3;
    }
  }

  .anticon {
    font-size: 1.8rem;
  }
`;

const Header = () => {
  const [notiOpen, setNotiOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const userId = localStorage.getItem('userId');

  React.useEffect(() => {
    if (!userId) return;
    axiosClient.get(`/api/notifications/unread-count/${userId}`)
      .then(res => setUnreadCount(res.data.unreadCount));

    const interval = setInterval(() => {
      axiosClient.get(`/api/notifications/unread-count/${userId}`)
        .then(res => setUnreadCount(res.data.unreadCount));
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  const updateUnreadCount = () => {
    axiosClient.get(`/api/notifications/unread-count/${userId}`)
      .then(res => setUnreadCount(res.data.unreadCount));
  };

  return (
    <HeaderContainer>
      <Logo to="/guest/home">
        <img src="/Images/logo.jpg" alt="SmokeFree" />
        <span>SmokeFree</span>
      </Logo>

      <NavIcons>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => setNotiOpen((open) => !open)}
          aria-label="Thông báo"
        >
          <Badge count={Number(unreadCount)} showZero style={{ backgroundColor: '#5FB8B3' }}>
            <BellOutlined style={{ color: notiOpen ? '#5FB8B3' : '#666' }} />
          </Badge>
        </button>
        <Link to="/guest/profile">
          <UserOutlined />
        </Link>
      </NavIcons>
      <Notification
        visible={notiOpen}
        onClose={() => setNotiOpen(false)}
        userId={userId}
        onUpdateUnreadCount={updateUnreadCount}
      />
    </HeaderContainer>
  );
};

export default Header; 