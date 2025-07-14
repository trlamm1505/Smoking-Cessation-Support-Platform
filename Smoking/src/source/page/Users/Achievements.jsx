import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Tooltip } from 'antd';
import { TrophyOutlined, CalendarOutlined, DollarOutlined, LockOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

const { Title } = Typography;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  padding: 24px;
  background: #edf6f5;
  min-height: 100vh;
  .page-title { margin-bottom: 24px; display: flex; align-items: center; gap: 12px; color: #1a1a1a; }
`;

const AnimatedAchievementCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(95, 184, 179, 0.08);
  border: none;
  background: white;
  position: relative;
  overflow: hidden;
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
  .ant-card-head { background: #5FB8B3; border-bottom: none; padding: 16px 24px; color: white; }
  .ant-card-body { padding: 24px; }
`;

const AchievementBadge = styled.div`
  text-align: center;
  padding: 24px;
  background: ${props => props.unlocked ? 'linear-gradient(135deg, rgba(246, 255, 237, 0.5) 0%, rgba(230, 247, 255, 0.5) 100%)' : '#f8f9fa'};
  border-radius: 16px;
  margin: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid ${props => props.unlocked ? 'rgba(82, 196, 26, 0.2)' : '#e8e8e8'};
  position: relative;
  overflow: hidden;
  filter: ${props => props.unlocked ? 'none' : 'grayscale(1)'};
  opacity: ${props => props.unlocked ? 1 : 0.3};
  .anticon { font-size: 36px; color: ${props => props.unlocked ? '#52c41a' : '#bfbfbf'}; margin-bottom: 16px; }
  .badge-title { font-weight: 600; font-size: 16px; margin-bottom: 8px; color: ${props => props.unlocked ? '#262626' : '#8c8c8c'}; }
  .badge-description { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 16px; }
  .badge-date { font-size: 13px; color: #1890ff; margin-top: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 4px; .anticon { font-size: 14px; margin: 0; } }
`;

const Achievements = () => {
  const [noSmoke, setNoSmoke] = useState([]);
  const [saveMoney, setSaveMoney] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 1;
    fetch(`http://localhost:8080/achievements/status/${userId}`)
      .then(res => res.json())
      .then(data => {
        const noSmokeArr = [];
        const saveMoneyArr = [];
        data.forEach(item => {
          const icon = item.achievement.type === 'no_smoke' ? <CalendarOutlined /> : <DollarOutlined />;
          const obj = {
            id: item.achievement.id,
            title: item.achievement.name,
            description: item.achievement.description,
            icon,
            unlocked: item.achieved,
            date: item.achievedDate,
          };
          if (item.achievement.type === 'no_smoke') noSmokeArr.push(obj);
          if (item.achievement.type === 'save_money') saveMoneyArr.push(obj);
        });
        setNoSmoke(noSmokeArr);
        setSaveMoney(saveMoneyArr);
      });
  }, []);

  const renderAchievementSection = (title, items) => (
    <AnimatedAchievementCard title={<><TrophyOutlined /> {title}</>}>
      <Row gutter={[24, 24]}>
        {items.map((achievement) => (
          <Col xs={24} sm={12} md={8} lg={6} key={achievement.id}>
            <Tooltip
              title={achievement.unlocked ? `Đạt được vào: ${achievement.date}` : `Chưa đạt`}
              placement="top"
            >
              <AchievementBadge unlocked={achievement.unlocked}>
                {!achievement.unlocked && (
                  <LockOutlined style={{ position: 'absolute', top: 8, right: 8, fontSize: 22, color: '#888', zIndex: 2, background: 'white', borderRadius: '50%' }} />
                )}
                <span className="anticon">
                  {achievement.icon}
                </span>
                <div className="badge-title">{achievement.title}</div>
                <div className="badge-description">{achievement.description}</div>
                {achievement.unlocked && (
                  <div className="badge-date">
                    <CalendarOutlined />
                    {achievement.date}
                  </div>
                )}
              </AchievementBadge>
            </Tooltip>
          </Col>
        ))}
      </Row>
    </AnimatedAchievementCard>
  );

  return (
    <PageContainer>
      <Title level={2} className="page-title">
        <TrophyOutlined />
        Thành Tích Cai Thuốc
      </Title>
      {renderAchievementSection('Thời Gian Không Hút Thuốc', noSmoke)}
      {renderAchievementSection('Tiết Kiệm', saveMoney)}
    </PageContainer>
  );
};

export default Achievements; 