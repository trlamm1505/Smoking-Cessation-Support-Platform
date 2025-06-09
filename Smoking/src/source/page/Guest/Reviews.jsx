import React from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import RequirePremiumNotice from './RequirePremiumNotice';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%);
  min-height: 100vh;
  width: 100%;
  flex: 1;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background: none;
  padding: 0;
  border-radius: 0;
  border: none;
`;

const AnimatedIcon = styled(StarOutlined)`
  color: #5FB8B3;
  font-size: 32px;
  animation: shine 2s infinite;
  @keyframes shine {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(5deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
`;

const Reviews = () => {
    return (
        <PageContainer>
            <TitleRow>
                <AnimatedIcon />
                <Title level={2} style={{ margin: 0 }}>Đánh Giá</Title>
            </TitleRow>
            <RequirePremiumNotice />
        </PageContainer>
    );
};

export default Reviews; 