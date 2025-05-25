import React from 'react';
import { Card, Row, Col, Progress, Statistic, Timeline } from 'antd';
import { DollarOutlined, ClockCircleOutlined, TrophyOutlined, HeartOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: 100%;
`;

const ProgressSection = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const AchievementBadge = styled.div`
  background: #f0f2f5;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  margin: 10px 0;
  
  img {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
`;

const Dashboard = () => {
    return (
        <DashboardContainer>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard>
                        <Statistic
                            title="Số ngày không hút thuốc"
                            value={15}
                            prefix={<ClockCircleOutlined />}
                            suffix="ngày"
                        />
                    </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard>
                        <Statistic
                            title="Tiền tiết kiệm được"
                            value={750000}
                            prefix={<DollarOutlined />}
                            suffix="VND"
                        />
                    </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard>
                        <Statistic
                            title="Huy hiệu đạt được"
                            value={5}
                            prefix={<TrophyOutlined />}
                        />
                    </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard>
                        <Statistic
                            title="Chỉ số sức khỏe"
                            value={85}
                            prefix={<HeartOutlined />}
                            suffix="%"
                        />
                    </StyledCard>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={16}>
                    <StyledCard title="Tiến trình cai thuốc">
                        <ProgressSection>
                            <h3>Mục tiêu: 30 ngày không hút thuốc</h3>
                            <Progress
                                percent={50}
                                status="active"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                            />
                        </ProgressSection>
                        <Timeline>
                            <Timeline.Item color="green">Bắt đầu kế hoạch cai thuốc</Timeline.Item>
                            <Timeline.Item color="green">Hoàn thành 1 tuần không hút thuốc</Timeline.Item>
                            <Timeline.Item color="blue">Đang trong giai đoạn ổn định</Timeline.Item>
                            <Timeline.Item color="gray">Mục tiêu 30 ngày</Timeline.Item>
                        </Timeline>
                    </StyledCard>
                </Col>
                <Col xs={24} lg={8}>
                    <StyledCard title="Huy hiệu thành tích">
                        <AchievementBadge>
                            <img src="/badges/1-day.png" alt="1 Day Badge" />
                            <h4>1 ngày không hút thuốc</h4>
                        </AchievementBadge>
                        <AchievementBadge>
                            <img src="/badges/1-week.png" alt="1 Week Badge" />
                            <h4>1 tuần không hút thuốc</h4>
                        </AchievementBadge>
                        <AchievementBadge>
                            <img src="/badges/money-save.png" alt="Money Save Badge" />
                            <h4>Tiết kiệm 500k</h4>
                        </AchievementBadge>
                    </StyledCard>
                </Col>
            </Row>
        </DashboardContainer>
    );
};

export default Dashboard; 