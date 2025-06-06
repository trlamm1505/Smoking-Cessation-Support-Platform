import React from 'react';
import { Card, Row, Col, Typography, Progress, Tag, Tooltip } from 'antd';
import { TrophyOutlined, CalendarOutlined, DollarOutlined, HeartOutlined, FireOutlined, StarOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  padding: 24px;
  background: #edf6f5;
  min-height: 100vh;

  .page-title {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1a1a1a;
    
    .anticon {
      color: #5FB8B3;
      font-size: 28px;
      animation: shine 2s infinite;
    }

    @keyframes shine {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
  }
`;

const AchievementCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(95, 184, 179, 0.08);
  border: none;
  background: white;
  position: relative;
  overflow: hidden;

  .ant-card-head {
    background: #5FB8B3;
    border-bottom: none;
    padding: 16px 24px;
    position: relative;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at right top, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    }
    
    .ant-card-head-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
      font-size: 18px;
      position: relative;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      .anticon {
        color: white;
        font-size: 20px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
    }
  }

  .ant-card-body {
    padding: 24px;
  }

  .achievement-badge {
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

    &:hover {
      transform: translateY(-5px);
      background: ${props => {
    if (!props.unlocked) return '#f0f0f0';
    switch (props.type) {
      case 'time':
        return 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 50%, #91d5ff 100%)';
      case 'money':
        return 'linear-gradient(135deg, #f6ffed 0%, #b7eb8f 50%, #95de64 100%)';
      case 'health':
        return 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 50%, #ffa39e 100%)';
      case 'challenge':
        return 'linear-gradient(135deg, #fff7e6 0%, #ffd591 50%, #ffc069 100%)';
      default:
        return 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 50%, #91d5ff 100%)';
    }
  }};
    }

    .anticon {
      font-size: 36px;
      color: ${props => props.unlocked ? '#52c41a' : '#bfbfbf'};
      margin-bottom: 16px;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-block;

      &.calendar { color: #1890ff; }
      &.dollar { color: #52c41a; }
      &.heart { color: #f5222d; }
      &.fire { color: #fa8c16; }
      &.star { color: #faad14; }
    }

    .badge-title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 8px;
      color: ${props => props.unlocked ? '#262626' : '#8c8c8c'};
    }

    .badge-description {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .badge-date {
      font-size: 13px;
      color: #1890ff;
      margin-top: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;

      .anticon {
        font-size: 14px;
        margin: 0;
      }
    }

    .progress-info {
      margin-top: 16px;

      .ant-progress-text {
        color: #5FB8B3;
        font-weight: 500;
      }

      .ant-progress-bg {
        background: linear-gradient(90deg, #5FB8B3 0%, #70C1BC 100%);
      }
    }
  }
`;

const Achievements = () => {
  // Mock data - trong thực tế sẽ lấy từ API/database
  const achievements = {
    smokingFree: [
      {
        id: 1,
        title: '24 Giờ Đầu Tiên',
        description: 'Không hút thuốc trong 24 giờ đầu tiên',
        icon: <CalendarOutlined />,
        unlocked: true,
        date: '2024-03-15',
        progress: 100
      },
      {
        id: 2,
        title: '3 Ngày Kiên Trì',
        description: 'Không hút thuốc trong 3 ngày liên tiếp',
        icon: <CalendarOutlined />,
        unlocked: true,
        date: '2024-03-18',
        progress: 100
      },
      {
        id: 3,
        title: 'Tuần Đầu Thành Công',
        description: 'Hoàn thành 7 ngày không hút thuốc',
        icon: <CalendarOutlined />,
        unlocked: false,
        progress: 70
      }
    ],
    moneySaved: [
      {
        id: 4,
        title: 'Tiết Kiệm 100K',
        description: 'Tiết kiệm được 100.000 VND',
        icon: <DollarOutlined />,
        unlocked: true,
        date: '2024-03-16',
        progress: 100
      },
      {
        id: 5,
        title: 'Tiết Kiệm 500K',
        description: 'Tiết kiệm được 500.000 VND',
        icon: <DollarOutlined />,
        unlocked: false,
        progress: 60
      }
    ],
    health: [
      {
        id: 6,
        title: 'Hơi Thở Tươi Mới',
        description: 'Cải thiện hơi thở sau 48 giờ',
        icon: <HeartOutlined />,
        unlocked: true,
        date: '2024-03-17',
        progress: 100
      },
      {
        id: 7,
        title: 'Tim Mạch Khỏe Mạnh',
        description: 'Nhịp tim và huyết áp cải thiện',
        icon: <HeartOutlined />,
        unlocked: true,
        date: '2024-03-17',
        progress: 100
      }
    ],
    challenges: [
      {
        id: 8,
        title: 'Vượt Qua Cám Dỗ',
        description: 'Từ chối thuốc lá trong tình huống căng thẳng',
        icon: <FireOutlined />,
        unlocked: true,
        date: '2024-03-19',
        progress: 100
      },
      {
        id: 9,
        title: 'Người Truyền Cảm Hứng',
        description: 'Chia sẻ câu chuyện với cộng đồng',
        icon: <StarOutlined />,
        unlocked: false,
        progress: 0
      }
    ]
  };

  const getIconClassName = (iconType) => {
    switch (iconType.type.render.displayName) {
      case 'CalendarOutlined': return 'calendar';
      case 'DollarOutlined': return 'dollar';
      case 'HeartOutlined': return 'heart';
      case 'FireOutlined': return 'fire';
      case 'StarOutlined': return 'star';
      default: return '';
    }
  };

  const renderAchievementSection = (title, items, icon) => (
    <AchievementCard title={<><TrophyOutlined /> {title}</>}>
      <Row gutter={[24, 24]}>
        {items.map(achievement => (
          <Col xs={24} sm={12} md={8} lg={6} key={achievement.id}>
            <Tooltip
              title={achievement.unlocked ? `Đạt được vào: ${achievement.date}` : `Hoàn thành: ${achievement.progress}%`}
              placement="top"
            >
              <div className="achievement-badge" unlocked={achievement.unlocked} style={!achievement.unlocked ? { position: 'relative', filter: 'grayscale(1)', opacity: 0.3 } : {}}>
                {!achievement.unlocked && (
                  <LockOutlined style={{ position: 'absolute', top: 8, right: 8, fontSize: 22, color: '#888', zIndex: 2, background: 'white', borderRadius: '50%' }} />
                )}
                <span className={`anticon ${getIconClassName(achievement.icon)}`}
                  style={!achievement.unlocked ? { filter: 'grayscale(1)', opacity: 0.7 } : {}}>
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
              </div>
            </Tooltip>
          </Col>
        ))}
      </Row>
    </AchievementCard>
  );

  return (
    <PageContainer>
      <Title level={2} className="page-title">
        <TrophyOutlined />
        Thành Tích Cai Thuốc
      </Title>

      {renderAchievementSection('Thời Gian Không Hút Thuốc', achievements.smokingFree)}
      {renderAchievementSection('Tiết Kiệm', achievements.moneySaved)}
      {renderAchievementSection('Sức Khỏe', achievements.health)}
      {renderAchievementSection('Thử Thách', achievements.challenges)}
    </PageContainer>
  );
};

export default Achievements; 