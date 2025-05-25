import React from 'react';
import { Input, Badge } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  span {
    font-size: 1.5rem;
    font-weight: bold;
    color: #5FB8B3;
  }
`;

const SearchBar = styled(Input)`
  max-width: 500px;
  width: 100%;
  border-radius: 20px;
  
  .ant-input {
    border-radius: 20px;
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  a {
    color: #666;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    
    &:hover {
      color: #5FB8B3;
    }
  }
`;

const Header = () => {
    return (
        <HeaderContainer>
            <Logo to="/users/home">
                <img src="/Images/logo.jpg" alt="SmokeFree" />
                <span>SmokeFree</span>
            </Logo>

            <SearchBar
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined style={{ color: '#5FB8B3' }} />}
            />

            <NavIcons>
                <Link to="/users/notifications">
                    <Badge count={2} style={{ backgroundColor: '#5FB8B3' }}>
                        <ShoppingCartOutlined />
                    </Badge>
                </Link>
                <Link to="/users/profile">
                    <UserOutlined />
                </Link>
            </NavIcons>
        </HeaderContainer>
    );
};

export default Header; 