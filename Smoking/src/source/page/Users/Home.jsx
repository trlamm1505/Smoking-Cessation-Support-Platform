import React from 'react';
import { Card, Row, Col, Statistic, Progress, Timeline, Button, Typography, Space, Tag } from 'antd';
import { ClockCircleOutlined, TrophyOutlined, DollarOutlined, HeartOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const PageContainer = styled.div`
    padding: 24px;
    background: linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%);
    min-height: calc(100vh - 64px);
`;

const WelcomeTitle = styled(Title)`
    position: relative;
    display: inline-flex;
    align-items: center;
    margin-bottom: 32px !important;
    padding-bottom: 12px;
    gap: 12px;
    
    .home-icon {
        font-size: 28px;
        color: #5FB8B3;
        animation: shine 2s infinite;
    }

    @keyframes shine {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }

    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 60px;
        height: 3px;
        background: #5FB8B3;
        border-radius: 3px;
    }
`;

const StyledCard = styled(Card)`
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    height: 100%;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    overflow: hidden;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 25px rgba(95, 184, 179, 0.2);
    }

    .ant-card-head {
        border-bottom: none;
        padding: 16px 24px;
    }

    .ant-card-head-title {
        font-size: 18px;
        font-weight: 600;
    }

    .ant-card-body {
        padding: 24px;
    }
`;

const ProgressCard = styled(StyledCard)`
    .ant-progress-text {
        color: #5FB8B3;
        font-weight: bold;
    }

    .ant-progress-inner {
        background-color: #f0f9f8;
    }

    .ant-progress-bg {
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

const StatisticCard = styled(StyledCard)`
    text-align: center;
    background: white;
    padding: 24px;
    position: relative;
    overflow: hidden;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #5FB8B3;
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    &:hover:before {
        transform: scaleX(1);
    }

    &:hover {
        background: linear-gradient(to bottom right, #ffffff, #f8fffe);
    }

    .ant-statistic-title {
        color: #666;
        font-size: 15px;
        margin-bottom: 20px;
        font-weight: 500;
    }

    .ant-statistic-content {
        color: #2c3e50;
        font-size: 28px;
        font-weight: 600;
    }

    .icon {
        font-size: 32px;
        color: #5FB8B3;
        margin-bottom: 20px;
        transition: all 0.3s ease;
    }

    &:hover .icon {
        transform: scale(1.1) rotate(5deg);
    }
`;

const TimelineCard = styled(StyledCard)`
    .ant-timeline {
        padding: 16px;
    }

    .ant-timeline-item-head {
        width: 16px;
        height: 16px;
        border-width: 3px;
    }

    .ant-timeline-item-head-blue {
        border-color: #5FB8B3;
        background: #fff;
    }

    .ant-timeline-item-content {
        padding: 16px;
        background: #f8fffe;
        border-radius: 12px;
        margin: 0 0 0 24px;
        transition: all 0.3s ease;
        border: 1px solid transparent;
    }

    .ant-timeline-item:hover .ant-timeline-item-content {
        background: white;
        border-color: #5FB8B3;
        transform: translateX(5px);
    }
`;

const AchievementCard = styled(StyledCard)`
    .achievement-item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding: 20px;
        background: #f8fffe;
        border-radius: 16px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;

        &:hover {
            background: white;
            border-color: #5FB8B3;
            transform: translateX(8px);
            box-shadow: 0 4px 12px rgba(95, 184, 179, 0.15);
        }

        .icon {
            font-size: 28px;
            color: #5FB8B3;
            margin-right: 20px;
            transition: all 0.3s ease;
        }

        &:hover .icon {
            transform: scale(1.2) rotate(10deg);
        }

        .info {
            flex: 1;
        }
    }

    .ant-tag {
        border: none;
        padding: 6px 12px;
        border-radius: 20px;
        margin-top: 8px;
    }

    .ant-btn {
        background: #5FB8B3;
        border-color: #5FB8B3;
        height: 45px;
        font-size: 16px;
        border-radius: 10px;
        transition: all 0.3s ease;
        
        &:hover {
            background: #4ca29d;
            border-color: #4ca29d;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(95, 184, 179, 0.3);
        }
    }
`;

const Home = () => {
  // Mock data - replace with real data from your backend
  const userData = {
    daysWithoutSmoking: 15,
    cigarettesAvoided: 300,
    moneySaved: 1500000,
    healthImprovement: 35,
    nextMilestone: 30,
    achievements: [
      {
        title: '7 Ngày Không Hút Thuốc',
        description: 'Hoàn thành thử thách 7 ngày đầu tiên',
        date: '10/03/2024'
      },
      {
        title: 'Tiết Kiệm 1 Triệu',
        description: 'Tiết kiệm được 1 triệu đồng từ việc cai thuốc',
        date: '12/03/2024'
      }
    ],
    recentActivities: [
      {
        date: '15/03/2024',
        content: 'Hoàn thành buổi tư vấn với chuyên gia',
        type: 'success'
      },
      {
        date: '14/03/2024',
        content: 'Vượt qua cơn thèm thuốc buổi sáng',
        type: 'success'
      },
      {
        date: '13/03/2024',
        content: 'Cập nhật kế hoạch cai thuốc',
        type: 'process'
      }
    ]
  };

  return (
    <PageContainer>
      <WelcomeTitle level={2}>
        <HomeOutlined className="home-icon" />
        Xin chào, Nguyễn Văn A
      </WelcomeTitle>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard>
            <ClockCircleOutlined className="icon" />
            <Statistic
              title="Số Ngày Không Hút Thuốc"
              value={userData.daysWithoutSmoking}
              suffix="ngày"
            />
          </StatisticCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard>
            <DollarOutlined className="icon" />
            <Statistic
              title="Tiết Kiệm Được"
              value={userData.moneySaved}
              suffix="đ"
              formatter={value => `${value.toLocaleString()}`}
            />
          </StatisticCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard>
            <HeartOutlined className="icon" />
            <Statistic
              title="Sức Khỏe Cải Thiện"
              value={userData.healthImprovement}
              suffix="%"
            />
          </StatisticCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard>
            <TrophyOutlined className="icon" />
            <Statistic
              title="Điếu Thuốc Đã Tránh"
              value={userData.cigarettesAvoided}
              suffix="điếu"
            />
          </StatisticCard>
        </Col>

        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <ProgressCard title="Tiến Trình Cai Thuốc">
                <Progress
                  percent={Math.round((userData.daysWithoutSmoking / userData.nextMilestone) * 100)}
                  strokeColor={{
                    '0%': '#5FB8B3',
                    '100%': '#4ca29d'
                  }}
                  strokeWidth={12}
                  format={percent => (
                    <Space direction="vertical" align="center">
                      <Text strong style={{ fontSize: '28px', color: '#5FB8B3' }}>
                        {userData.daysWithoutSmoking}/{userData.nextMilestone}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '16px' }}>ngày</Text>
                    </Space>
                  )}
                />
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 20, fontSize: '15px' }}>
                  Còn {userData.nextMilestone - userData.daysWithoutSmoking} ngày nữa đến mốc {userData.nextMilestone} ngày!
                </Text>
              </ProgressCard>
            </Col>
            <Col xs={24}>
              <TimelineCard title="Hoạt Động Gần Đây">
                <Timeline>
                  {userData.recentActivities.map((activity, index) => (
                    <Timeline.Item
                      key={index}
                      color={activity.type === 'success' ? '#5FB8B3' : '#1890ff'}
                    >
                      <Text strong>{activity.date}</Text>
                      <br />
                      {activity.content}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </TimelineCard>
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={8}>
          <AchievementCard title="Thành Tích Đạt Được">
            {userData.achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <TrophyOutlined className="icon" />
                <div className="info">
                  <Text strong>{achievement.title}</Text>
                  <br />
                  <Text type="secondary">{achievement.description}</Text>
                  <br />
                  <Tag color="#5FB8B3">
                    <CalendarOutlined /> {achievement.date}
                  </Tag>
                </div>
              </div>
            ))}
            <Button type="primary" block style={{ marginTop: 16, background: '#5FB8B3', borderColor: '#5FB8B3' }}>
              Xem Tất Cả Thành Tích
            </Button>
          </AchievementCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Home; 