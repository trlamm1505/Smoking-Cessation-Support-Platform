import React from 'react';
import { Card, Row, Col, Typography, Progress, Tag, Tooltip } from 'antd';
import { TrophyOutlined, CalendarOutlined, DollarOutlined, HeartOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  padding: 24px;

  .page-title {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    .anticon {
      color: #FFD700;
      font-size: 24px;
    }
  }
`;

const AchievementCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .ant-card-head-title {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .anticon {
      color: #5FB8B3;
    }
  }

  .achievement-badge {
    text-align: center;
    padding: 20px;
    background: ${props => props.unlocked ? '#f6ffed' : '#f5f5f5'};
    border-radius: 8px;
    transition: all 0.3s;
    cursor: pointer;
    border: 2px solid ${props => props.unlocked ? '#52c41a' : '#d9d9d9'};

    &:hover {
      transform: translateY(-2px);
    }

    .anticon {
      font-size: 32px;
      color: ${props => props.unlocked ? '#52c41a' : '#999'};
      margin-bottom: 12px;
    }

    .badge-title {
      font-weight: 500;
      margin-bottom: 4px;
      color: ${props => props.unlocked ? '#000' : '#999'};
    }

    .badge-description {
      font-size: 12px;
      color: #666;
    }

    .badge-date {
      font-size: 12px;
      color: #1890ff;
      margin-top: 8px;
    }

    .progress-info {
      margin-top: 12px;
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

    const renderAchievementSection = (title, items, icon) => (
        <AchievementCard title={<><TrophyOutlined /> {title}</>}>
            <Row gutter={[16, 16]}>
                {items.map(achievement => (
                    <Col xs={24} sm={12} md={8} lg={6} key={achievement.id}>
                        <Tooltip title={achievement.unlocked ? `Đạt được vào: ${achievement.date}` : `Hoàn thành: ${achievement.progress}%`}>
                            <div className="achievement-badge" unlocked={achievement.unlocked}>
                                {achievement.icon}
                                <div className="badge-title">{achievement.title}</div>
                                <div className="badge-description">{achievement.description}</div>
                                {!achievement.unlocked && (
                                    <div className="progress-info">
                                        <Progress percent={achievement.progress} size="small" />
                                    </div>
                                )}
                                {achievement.unlocked && (
                                    <div className="badge-date">{achievement.date}</div>
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