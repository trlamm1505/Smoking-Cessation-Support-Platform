import React from 'react';
import { Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router';

// Hiệu ứng rung cho icon
const shake = keyframes`
  0% { transform: scale(1) rotate(0deg);}
  20% { transform: scale(1.1) rotate(-10deg);}
  40% { transform: scale(1.2) rotate(10deg);}
  60% { transform: scale(1.1) rotate(-6deg);}
  80% { transform: scale(1.05) rotate(4deg);}
  100% { transform: scale(1) rotate(0deg);}
`;

// Hiệu ứng sáng cho nút
const glow = keyframes`
  0% { box-shadow: 0 0 0 0 #5FB8B3; }
  70% { box-shadow: 0 0 16px 8px #5FB8B3; }
  100% { box-shadow: 0 0 0 0 #5FB8B3; }
`;

const FullScreenContainer = styled.div`
  position: fixed;
  z-index: 9999;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  font-size: 72px;
  color: #faad14;
  margin-bottom: 32px;
  animation: ${shake} 1.2s infinite;
`;

const Message = styled.div`
  font-size: 1.6rem;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const AnimatedButton = styled(Button)`
  font-size: 1.2rem;
  padding: 0 36px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(90deg, #5FB8B3 0%, #4A90E2 100%);
  border: none;
  animation: ${glow} 2s infinite;
  box-shadow: 0 4px 24px rgba(95, 184, 179, 0.15);

  a {
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    display: block;
    width: 100%;
    height: 100%;
  }

  &:hover {
    background: linear-gradient(90deg, #4A90E2 0%, #5FB8B3 100%);
    filter: brightness(1.1);
  }
`;

const RequirePremiumNotice = () => (
  <FullScreenContainer>
    <IconWrapper>
      <ExclamationCircleOutlined />
    </IconWrapper>
    <Message>
      Bạn không thể sử dụng dịch vụ này.<br />
      Vui lòng đăng ký để sử dụng.
    </Message>
    <AnimatedButton type="primary" size="large">
      <Link to="/guest/premium">Đăng ký gói thành viên</Link>
    </AnimatedButton>
  </FullScreenContainer>
);

export default RequirePremiumNotice; 