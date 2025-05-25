import React from 'react';
import { Card, Row, Col, Statistic, Progress, Timeline, Button, Typography, Space, Tag } from 'antd';
import { ClockCircleOutlined, TrophyOutlined, DollarOutlined, HeartOutlined, CalendarOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const PageContainer = styled.div`
    padding: 24px;
    background: #f0f2f5;
    min-height: calc(100vh - 64px);
`;

const StyledCard = styled(Card)`
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    height: 100%;

    .ant-card-head {
        border-bottom: none;
    }
`;

const ProgressCard = styled(StyledCard)`
    .ant-progress-text {
        color: #5FB8B3;
        font-weight: bold;
    }
`;

const StatisticCard = styled(StyledCard)`
    text-align: center;

    .ant-statistic-title {
        color: #666;
        font-size: 14px;
    }

    .ant-statistic-content {
        color: #2c3e50;
    }

    .icon {
        font-size: 24px;
        color: #5FB8B3;
        margin-bottom: 16px;
    }
`;

const TimelineCard = styled(StyledCard)`
    .ant-timeline-item-head-blue {
        border-color: #5FB8B3;
    }
`;

const AchievementCard = styled(StyledCard)`
    .achievement-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;

        .icon {
            font-size: 24px;
            color: #ffd700;
            margin-right: 12px;
        }

        .info {
            flex: 1;
        }

        &:last-child {
            margin-bottom: 0;
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
      <Title level={2} style={{ marginBottom: 24, color: '#2c3e50' }}>
        Xin chào, Nguyễn Văn A
      </Title>

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
                  strokeColor="#5FB8B3"
                  format={percent => (
                    <Space direction="vertical" align="center">
                      <Text strong style={{ fontSize: '24px', color: '#5FB8B3' }}>
                        {userData.daysWithoutSmoking}/{userData.nextMilestone}
                      </Text>
                      <Text type="secondary">ngày</Text>
                    </Space>
                  )}
                />
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
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