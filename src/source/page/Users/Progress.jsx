import React, { useState } from 'react';
import { Card, Steps, Row, Col, Timeline, Statistic, Progress as AntProgress, Button } from 'antd';
import { LineChartOutlined, TrophyOutlined, ClockCircleOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

const { Step } = Steps;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shine = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
`;

const ProgressContainer = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: linear-gradient(180deg, rgba(95, 184, 179, 0.15) 0%, rgba(95, 184, 179, 0) 100%);
    pointer-events: none;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 20px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(95, 184, 179, 0.15);
    background: rgba(255, 255, 255, 0.95);
  }

  .ant-card-head {
    padding: 24px;
    border-bottom: none;
    
    .ant-card-head-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      position: relative;
      padding-left: 16px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 24px;
        background: linear-gradient(to bottom, #5FB8B3, #85BB47);
        border-radius: 4px;
      }
    }
  }

  .ant-card-body {
    padding: 24px;
  }
`;

const StatisticCard = styled(Card)`
  height: 100%;
  border-radius: 20px;
  border: none;
  background: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(95, 184, 179, 0.1),
      transparent
    );
    transition: all 0.4s ease;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(95, 184, 179, 0.2);

    &::before {
      animation: ${shine} 1.5s infinite;
    }

    .icon-wrapper {
      transform: scale(1.1) rotate(10deg);
      background: linear-gradient(135deg, #5FB8B3, #85BB47);
      
      .anticon {
        color: white;
      }
    }

    .ant-statistic-content-value {
      background: linear-gradient(90deg, #5FB8B3, #85BB47);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .ant-card-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: rgba(95, 184, 179, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    .anticon {
      font-size: 32px;
      color: #5FB8B3;
      transition: all 0.4s ease;
    }
  }

  .ant-statistic-title {
    font-size: 16px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .ant-statistic-content {
    font-size: 32px;
    font-weight: 700;
    color: #1a1a1a;
    transition: all 0.4s ease;

    .ant-statistic-content-suffix {
      font-size: 16px;
      color: #666;
      margin-left: 8px;
    }
  }
`;

const StyledSteps = styled(Steps)`
  .ant-steps-item {
    padding-inline-start: 8px;
  }

  .ant-steps-item-icon {
    width: 40px;
    height: 40px;
    line-height: 40px;
    background: white;
    border: 2px solid #e8e8e8;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ant-steps-item-process .ant-steps-item-icon {
    background: linear-gradient(135deg, #5FB8B3, #85BB47);
    border: none;
    box-shadow: 0 4px 15px rgba(95, 184, 179, 0.3);
    transform: scale(1.1);
  }

  .ant-steps-item-finish .ant-steps-item-icon {
    background: white;
    border-color: #5FB8B3;
    color: #5FB8B3;
  }

  .ant-steps-item-content {
    transition: all 0.3s ease;
  }

  .ant-steps-item-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    transition: all 0.3s ease;

    &:hover {
      color: #5FB8B3;
    }
  }

  .ant-steps-item-description {
    font-size: 14px;
    color: #666;
    max-width: 150px;
  }

  .ant-steps-item-tail::after {
    background: #e8e8e8;
    height: 2px;
    transition: all 0.3s ease;
  }

  .ant-steps-item-finish .ant-steps-item-tail::after {
    background: linear-gradient(90deg, #5FB8B3, #85BB47);
  }
`;

const StyledProgress = styled(AntProgress)`
  margin-bottom: 32px;

  .ant-progress-bg {
    background: linear-gradient(90deg, #5FB8B3, #85BB47);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ant-progress-text {
    color: #5FB8B3;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  &:hover .ant-progress-bg {
    box-shadow: 0 2px 10px rgba(95, 184, 179, 0.3);
  }

  h4 {
    margin-bottom: 16px;
    color: #1a1a1a;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;

    &::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      background: linear-gradient(135deg, #5FB8B3, #85BB47);
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    &:hover::before {
      transform: scale(1.2);
      box-shadow: 0 0 10px rgba(95, 184, 179, 0.3);
    }
  }
`;

const StyledTimeline = styled(Timeline)`
  padding: 20px;

  .ant-timeline-item {
    padding-bottom: 32px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(10px);

      .ant-timeline-item-head {
        transform: scale(1.2);
        box-shadow: 0 0 15px rgba(95, 184, 179, 0.3);
      }

      strong {
        color: #5FB8B3;
      }
    }
  }

  .ant-timeline-item-head {
    width: 16px;
    height: 16px;
    background: white;
    border: 2px solid #5FB8B3;
    transition: all 0.3s ease;
  }

  .ant-timeline-item-tail {
    border-left: 2px solid #e8e8e8;
    transition: all 0.3s ease;
  }

  .ant-timeline-item-content {
    padding-left: 24px;

    strong {
      display: block;
      color: #1a1a1a;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 6px;
      transition: all 0.3s ease;
    }

    small {
      color: #666;
      font-size: 14px;
      display: block;
    }
  }
`;

const UpdateButton = styled(Button)`
  background: linear-gradient(90deg, #5FB8B3, #85BB47);
  border: none;
  height: 50px;
  padding: 0 40px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(95, 184, 179, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.4s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(95, 184, 179, 0.3);
    background: linear-gradient(90deg, #85BB47, #5FB8B3);

    &::before {
      animation: ${shine} 1.5s infinite;
    }
  }

  &:active {
    transform: translateY(1px);
  }

  .anticon {
    margin-right: 10px;
    font-size: 20px;
  }
`;

const Progress = () => {
    const [currentPhase, setCurrentPhase] = useState(2);

    const phases = [
        { title: 'Chuẩn bị', description: 'Lập kế hoạch và chuẩn bị tâm lý' },
        { title: 'Giảm dần', description: 'Giảm số lượng điếu thuốc' },
        { title: 'Cai hoàn toàn', description: 'Ngừng hút thuốc' },
        { title: 'Duy trì', description: 'Duy trì thói quen không hút thuốc' }
    ];

    return (
        <ProgressContainer>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <StyledCard delay="0.1s">
                        <StyledSteps current={currentPhase}>
                            {phases.map(phase => (
                                <Step key={phase.title} title={phase.title} description={phase.description} />
                            ))}
                        </StyledSteps>
                    </StyledCard>
                </Col>

                <Col span={6}>
                    <StatisticCard delay="0.2s">
                        <div className="icon-wrapper">
                            <ClockCircleOutlined />
                        </div>
                        <Statistic
                            title="Số ngày không hút thuốc"
                            value={15}
                            suffix="ngày"
                        />
                    </StatisticCard>
                </Col>

                <Col span={6}>
                    <StatisticCard delay="0.3s">
                        <div className="icon-wrapper">
                            <DollarOutlined />
                        </div>
                        <Statistic
                            title="Tiền tiết kiệm được"
                            value={750000}
                            suffix="VND"
                        />
                    </StatisticCard>
                </Col>

                <Col span={6}>
                    <StatisticCard delay="0.4s">
                        <div className="icon-wrapper">
                            <CheckCircleOutlined />
                        </div>
                        <Statistic
                            title="Điếu thuốc đã bỏ"
                            value={300}
                        />
                    </StatisticCard>
                </Col>

                <Col span={6}>
                    <StatisticCard delay="0.5s">
                        <div className="icon-wrapper">
                            <TrophyOutlined />
                        </div>
                        <Statistic
                            title="Sức khỏe phục hồi"
                            value={75}
                            suffix="%"
                        />
                    </StatisticCard>
                </Col>

                <Col span={16}>
                    <StyledCard delay="0.6s" title="Tiến độ theo tuần">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <div>
                                    <h4>Tuần 1: Giảm 25%</h4>
                                    <StyledProgress percent={100} status="success" />
                                </div>
                                <div>
                                    <h4>Tuần 2: Giảm 50%</h4>
                                    <StyledProgress percent={80} status="active" />
                                </div>
                                <div>
                                    <h4>Tuần 3: Giảm 75%</h4>
                                    <StyledProgress percent={30} status="active" />
                                </div>
                                <div>
                                    <h4>Tuần 4: Cai hoàn toàn</h4>
                                    <StyledProgress percent={0} />
                                </div>
                            </Col>
                        </Row>
                    </StyledCard>
                </Col>

                <Col span={8}>
                    <StyledCard delay="0.7s" title="Thành tựu đạt được">
                        <StyledTimeline>
                            <Timeline.Item color="green">
                                <strong>Hoàn thành 24 giờ đầu tiên không hút thuốc</strong>
                                <p><small>10/03/2024</small></p>
                            </Timeline.Item>
                            <Timeline.Item color="green">
                                <strong>Giảm 50% số điếu thuốc hàng ngày</strong>
                                <p><small>05/03/2024</small></p>
                            </Timeline.Item>
                            <Timeline.Item color="blue">
                                <strong>Tiết kiệm được 500,000 VND</strong>
                                <p><small>01/03/2024</small></p>
                            </Timeline.Item>
                            <Timeline.Item color="blue">
                                <strong>Bắt đầu kế hoạch cai thuốc</strong>
                                <p><small>28/02/2024</small></p>
                            </Timeline.Item>
                        </StyledTimeline>
                    </StyledCard>
                </Col>
            </Row>

            <StyledCard delay="0.8s">
                <Row justify="center">
                    <Col>
                        <UpdateButton type="primary" size="large" icon={<CheckCircleOutlined />}>
                            Cập nhật tiến độ hôm nay
                        </UpdateButton>
                    </Col>
                </Row>
            </StyledCard>
        </ProgressContainer>
    );
};

export default Progress; 