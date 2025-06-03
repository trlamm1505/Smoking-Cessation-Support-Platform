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

const LeaderboardCard = styled(StyledCard)`
    .leaderboard-header {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid #f0f9f8;

        .trophy-icon {
            font-size: 24px;
            color: #FFD700;
            margin-right: 12px;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
    }

    .leaderboard-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        padding: 16px;
        background: #f8fffe;
        border-radius: 12px;
        transition: all 0.3s ease;
        border: 1px solid transparent;
        position: relative;
        overflow: hidden;

        &:hover {
            background: white;
            border-color: #5FB8B3;
            transform: translateX(8px);
            box-shadow: 0 4px 12px rgba(95, 184, 179, 0.15);
        }

        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #5FB8B3;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        &:hover:before {
            opacity: 1;
        }

        .rank {
            font-size: 24px;
            font-weight: bold;
            width: 40px;
            text-align: center;
            position: relative;
            
            &:after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 2px;
                background: #5FB8B3;
                border-radius: 2px;
            }
        }

        .rank-1 { color: #FFD700; }
        .rank-2 { color: #C0C0C0; }
        .rank-3 { color: #CD7F32; }
        .rank-other { color: #5FB8B3; }

        .user-info {
            flex: 1;
            margin-left: 16px;
        }

        .user-name {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
        }

        .stats {
            display: flex;
            gap: 12px;
            margin-top: 8px;
            flex-wrap: nowrap;
            align-items: center;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #666;
            font-size: 13px;
            padding: 4px 8px;
            background: rgba(95, 184, 179, 0.1);
            border-radius: 20px;
            transition: all 0.3s ease;
            white-space: nowrap;

            &:hover {
                background: rgba(95, 184, 179, 0.2);
                transform: translateY(-2px);
            }

            .anticon {
                color: #5FB8B3;
                font-size: 14px;
            }
        }
    }

    .ant-btn {
        background: #5FB8B3;
        border-color: #5FB8B3;
        height: 45px;
        font-size: 16px;
        border-radius: 10px;
        transition: all 0.3s ease;
        margin-top: 24px;
        
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
        leaderboard: [
            {
                name: 'Nguyễn Văn A',
                daysWithoutSmoking: 45,
                moneySaved: 4500000,
                cigarettesAvoided: 900
            },
            {
                name: 'Trần Thị B',
                daysWithoutSmoking: 30,
                moneySaved: 3000000,
                cigarettesAvoided: 600
            },
            {
                name: 'Lê Văn C',
                daysWithoutSmoking: 25,
                moneySaved: 2500000,
                cigarettesAvoided: 500
            },
            {
                name: 'Phạm Thị D',
                daysWithoutSmoking: 20,
                moneySaved: 2000000,
                cigarettesAvoided: 400
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
                    <LeaderboardCard title={
                        <div className="leaderboard-header">
                            <TrophyOutlined className="trophy-icon" />
                            <span>Bảng Xếp Hạng</span>
                        </div>
                    }>
                        {userData.leaderboard.map((user, index) => (
                            <div key={index} className="leaderboard-item">
                                <div className={`rank rank-${index < 3 ? index + 1 : 'other'}`}>
                                    #{index + 1}
                                </div>
                                <div className="user-info">
                                    <div className="user-name">{user.name}</div>
                                    <div className="stats">
                                        <div className="stat-item">
                                            <ClockCircleOutlined /> {user.daysWithoutSmoking} ngày
                                        </div>
                                        <div className="stat-item">
                                            <DollarOutlined /> {user.moneySaved.toLocaleString()}đ
                                        </div>
                                        <div className="stat-item">
                                            <HeartOutlined /> {user.cigarettesAvoided} điếu
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button type="primary" block>
                            Xem Bảng Xếp Hạng Đầy Đủ
                        </Button>
                    </LeaderboardCard>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default Home; 