import React, { useState } from 'react';
import { Card, Steps, Row, Col, Timeline, Statistic, Progress as AntProgress, Calendar, Button } from 'antd';
import { LineChartOutlined, TrophyOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Step } = Steps;

const ProgressContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 24px;
`;

const StatisticCard = styled(Card)`
  text-align: center;
  .ant-statistic-title {
    font-size: 16px;
    color: #666;
  }
  .ant-statistic-content {
    color: #5FB8B3;
  }
`;

const Progress = () => {
    const [currentPhase, setCurrentPhase] = useState(2); // Giả sử đang ở giai đoạn 2

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
                    <StyledCard>
                        <Steps current={currentPhase}>
                            {phases.map(phase => (
                                <Step key={phase.title} title={phase.title} description={phase.description} />
                            ))}
                        </Steps>
                    </StyledCard>
                </Col>

                <Col span={6}>
                    <StatisticCard>
                        <Statistic
                            title="Số ngày không hút thuốc"
                            value={15}
                            suffix="ngày"
                            prefix={<ClockCircleOutlined />}
                        />
                    </StatisticCard>
                </Col>

                <Col span={6}>
                    <StatisticCard>
                        <Statistic
                            title="Tiền tiết kiệm được"
                            value={750000}
                            suffix="VND"
                            prefix="₫"
                        />
                    </StatisticCard>
                </Col>

                <Col span={6}>
                    <StatisticCard>
                        <Statistic
                            title="Điếu thuốc đã bỏ"
                            value={300}
                            prefix={<CheckCircleOutlined />}
                        />
                    </StatisticCard>
                </Col>

                <Col span={6}>
                    <StatisticCard>
                        <Statistic
                            title="Sức khỏe phục hồi"
                            value={75}
                            suffix="%"
                            prefix={<TrophyOutlined />}
                        />
                    </StatisticCard>
                </Col>

                <Col span={16}>
                    <StyledCard title="Tiến độ theo tuần">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <div style={{ marginBottom: 16 }}>
                                    <h4>Tuần 1: Giảm 25%</h4>
                                    <AntProgress percent={100} status="success" />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <h4>Tuần 2: Giảm 50%</h4>
                                    <AntProgress percent={80} status="active" />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <h4>Tuần 3: Giảm 75%</h4>
                                    <AntProgress percent={30} status="active" />
                                </div>
                                <div>
                                    <h4>Tuần 4: Cai hoàn toàn</h4>
                                    <AntProgress percent={0} />
                                </div>
                            </Col>
                        </Row>
                    </StyledCard>
                </Col>

                <Col span={8}>
                    <StyledCard title="Thành tựu đạt được">
                        <Timeline>
                            <Timeline.Item color="green">
                                Hoàn thành 24 giờ đầu tiên không hút thuốc
                                <p><small>10/03/2024</small></p>
                            </Timeline.Item>
                            <Timeline.Item color="green">
                                Giảm 50% số điếu thuốc hàng ngày
                                <p><small>05/03/2024</small></p>
                            </Timeline.Item>
                            <Timeline.Item color="blue">
                                Tiết kiệm được 500,000 VND
                                <p><small>01/03/2024</small></p>
                            </Timeline.Item>
                            <Timeline.Item color="blue">
                                Bắt đầu kế hoạch cai thuốc
                                <p><small>28/02/2024</small></p>
                            </Timeline.Item>
                        </Timeline>
                    </StyledCard>
                </Col>

                <Col span={24}>
                    <StyledCard title="Lịch theo dõi">
                        <Calendar
                            fullscreen={false}
                            dateCellRender={(date) => {
                                // Đây là nơi bạn có thể thêm logic để hiển thị các marker cho những ngày đặc biệt
                                return null;
                            }}
                        />
                    </StyledCard>
                </Col>
            </Row>

            <StyledCard>
                <Row justify="center">
                    <Col>
                        <Button type="primary" size="large" icon={<CheckCircleOutlined />}>
                            Cập nhật tiến độ hôm nay
                        </Button>
                    </Col>
                </Row>
            </StyledCard>
        </ProgressContainer>
    );
};

export default Progress; 