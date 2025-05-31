import React from 'react';
import { Input, Badge } from 'antd';
import { SearchOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
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

const SearchBar = styled(Input)`
  max-width: 700px;
  width: 100%;
  border-radius: 25px;
  height: 45px;
  font-size: 1.1rem;
  
  .ant-input {
    border-radius: 25px;
    height: 45px;
    font-size: 1.1rem;
    padding-left: 20px;
    line-height: 45px;
    display: flex;
    align-items: center;
  }

  .ant-input-prefix {
    margin-right: 10px;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
  }

  .ant-input-affix-wrapper {
    padding: 0 15px;
    height: 45px;
    display: flex;
    align-items: center;
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

            <SearchBar
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined style={{ color: '#5FB8B3' }} />}
            />

            <NavIcons>
                <Link to="/guest/notifications">
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