import React from 'react';
import { Badge } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import styled from 'styled-components';

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
  return (
    <HeaderContainer>
      <Logo to="/guest/home">
        <img src="/Images/logo.jpg" alt="SmokeFree" />
        <span>SmokeFree</span>
      </Logo>

      <NavIcons>
        <Link to="/guest/premium-notice">
          <Badge count={2} style={{ backgroundColor: '#5FB8B3' }}>
            <BellOutlined />
          </Badge>
        </Link>
        <Link to="/guest/profile">
          <UserOutlined />
        </Link>
      </NavIcons>
    </HeaderContainer>
  );
};

export default Header; 