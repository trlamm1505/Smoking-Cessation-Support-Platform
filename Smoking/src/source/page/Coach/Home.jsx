import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Timeline, Button, Typography, Space, Tag, message } from 'antd';
import { ClockCircleOutlined, TrophyOutlined, DollarOutlined, HeartOutlined, CalendarOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axiosClient from '../Axios/AxiosCLients';

const { Title, Text } = Typography;

const PageContainer = styled.div`
    padding: 24px;
    background: linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%);
    min-height: calc(100vh - 64px);
`;

const WelcomeTitle = styled(Title)`
    position: relative;
    display: inline-block;
    margin-bottom: 32px !important;
    padding-bottom: 12px;
    
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

const CoachHome = () => {
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const coachId = localStorage.getItem('coachId');
    if (!coachId) {
      message.error('Không tìm thấy coachId!');
      setLoading(false);
      return;
    }
    axiosClient.get(`/api/coaches/${coachId}`)
      .then(res => {
        setCoachData(res.data);
        setLoading(false);
      })
      .catch(() => {
        message.error('Không lấy được thông tin coach!');
        setLoading(false);
      });
  }, []);

  if (loading) return <PageContainer><Title>Đang tải dữ liệu...</Title></PageContainer>;
  if (!coachData) return <PageContainer><Title>Không có dữ liệu coach</Title></PageContainer>;

  return (
    <PageContainer>
      <WelcomeTitle level={2}>
        Xin chào, {coachData.fullName || 'Coach'}!
      </WelcomeTitle>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard>
            <TeamOutlined className="icon" />
            <Statistic
              title="Khách Hàng Đang Tư Vấn"
              value={coachData.activeClients || 0}
              suffix="người"
            />
          </StatisticCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard>
            <CheckCircleOutlined className="icon" />
            <Statistic
              title="Tỷ Lệ Thành Công"
              value={coachData.successRate || 0}
              suffix="%"
            />
          </StatisticCard>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatisticCard>
            <CalendarOutlined className="icon" />
            <Statistic
              title="Buổi Tư Vấn Đang Chờ"
              value={coachData.pendingConsultations || 0}
              suffix="buổi"
            />
          </StatisticCard>
        </Col>

        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <TimelineCard title="Hoạt Động Gần Đây">
                <Timeline>
                  {(coachData.recentActivities || []).map((activity, index) => (
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
          <StyledCard title="Thành Tích Đạt Được">
            {(coachData.achievements || []).map((achievement, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '20px', 
                padding: '20px',
                background: '#f8fffe',
                borderRadius: '16px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid transparent'
              }}>
                <TrophyOutlined style={{ 
                  fontSize: '28px', 
                  color: '#5FB8B3', 
                  marginRight: '20px' 
                }} />
                <div>
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
          </StyledCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default CoachHome; 