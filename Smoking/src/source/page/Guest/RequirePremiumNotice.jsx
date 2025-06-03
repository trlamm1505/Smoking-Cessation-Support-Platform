import React from 'react';
import { Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router';

const shine = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FullScreenContainer = styled.div`
  position: fixed;
  z-index: 9999;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #e8f4f3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ContentWrapper = styled.div`
  background: white;
  padding: 48px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(95, 184, 179, 0.1);
  text-align: center;
  max-width: 480px;
  width: 90%;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
  border: 1px solid #E3F6F5;
`;

const IconWrapper = styled.div`
  font-size: 72px;
  color: #5FB8B3;
  margin-bottom: 32px;
  animation: ${shine} 2s infinite;
  filter: drop-shadow(0 4px 8px rgba(95, 184, 179, 0.2));
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const Message = styled.div`
  font-size: 1.1rem;
  color: #444;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.6;
  font-weight: 400;
`;

const AnimatedButton = styled(Button)`
  font-size: 1rem;
  padding: 0 32px;
  height: 48px;
  border-radius: 24px;
  background: linear-gradient(135deg, #5FB8B3 0%, #70C1BC 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(95, 184, 179, 0.2);
  transition: all 0.3s ease;

  a {
    color: white;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 8px;
  }

  &:hover {
    background: linear-gradient(135deg, #70C1BC 0%, #5FB8B3 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(95, 184, 179, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const RequirePremiumNotice = () => (
  <FullScreenContainer>
    <ContentWrapper>
      <IconWrapper>
        <ExclamationCircleOutlined />
      </IconWrapper>
      <Title>
        <span>Yêu Cầu Tài Khoản Premium</span>
      </Title>
      <Message>
        Để sử dụng tính năng này, bạn cần nâng cấp lên tài khoản Premium.
        Hãy đăng ký ngay để trải nghiệm đầy đủ các tính năng hữu ích.
      </Message>
      <AnimatedButton type="primary" size="large">
        <Link to="/guest/premium">Nâng Cấp Premium Ngay</Link>
      </AnimatedButton>
    </ContentWrapper>
  </FullScreenContainer>
);

export default RequirePremiumNotice; 