import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Timeline, Button, Typography, Space, Tag, Spin } from 'antd';
import styled from 'styled-components';
import {
    UserOutlined,
    FileTextOutlined,
    DollarOutlined,
    TeamOutlined,
    HomeOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
    CalendarOutlined,
    DashboardOutlined,
    BarChartOutlined,
    LineChartOutlined
} from '@ant-design/icons';
import coachApi from '../Axios/coachApi';

const { Title, Text } = Typography;

const PageContainer = styled.div`
    padding: 0;
    background: none;
    min-height: calc(100vh - 64px - 48px);
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
        animation: none;
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

const Dashboard = () => {
    const [revenueTotal, setRevenueTotal] = useState(0);
    const [revenueSubscribers, setRevenueSubscribers] = useState(0);
    const [revenueAvg, setRevenueAvg] = useState(0);
    const [mostPopularPackage, setMostPopularPackage] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        setLoadingStats(true);
        Promise.all([
            coachApi.getRevenueTotal(),
            coachApi.getRevenueSubscribers(),
            coachApi.getRevenueAvgPerMember(),
            coachApi.getMostPopularPackage()
        ])
        .then(([
            revenueTotalRes,
            revenueSubscribersRes,
            revenueAvgRes,
            mostPopularPackageRes
        ]) => {
            setRevenueTotal(revenueTotalRes.data);
            setRevenueSubscribers(revenueSubscribersRes.data);
            setRevenueAvg(revenueAvgRes.data);
            setMostPopularPackage(mostPopularPackageRes.data);
        })
        .catch(() => {})
        .finally(() => setLoadingStats(false));
    }, []);

    return (
        <PageContainer>
            <WelcomeTitle level={2}>
                 <HomeOutlined className="home-icon" />
                 Chào mừng, Admin!
             </WelcomeTitle>

             <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                 <Col xs={24} sm={12} lg={6}>
                     <StatisticCard>
                         <UserOutlined className="icon" />
                          <Statistic
                             title="Tổng Người Dùng Premium"
                             value={revenueSubscribers}
                             loading={loadingStats}
                         />
                     </StatisticCard>
                 </Col>
                 <Col xs={24} sm={12} lg={6}>
                     <StatisticCard>
                         <DollarOutlined className="icon" />
                         <Statistic
                             title="Tổng doanh thu"
                             value={revenueTotal}
                             formatter={value => `${value ? value.toLocaleString() : 0} VNĐ`}
                             loading={loadingStats}
                         />
                     </StatisticCard>
                 </Col>
                 <Col xs={24} sm={12} lg={6}>
                     <StatisticCard>
                         <BarChartOutlined className="icon" />
                         <Statistic
                             title="Gói Premium phổ biến nhất"
                             value={mostPopularPackage ? mostPopularPackage.packageName : ''}
                             loading={loadingStats}
                         />
                     </StatisticCard>
                 </Col>
             </Row>

        </PageContainer>
    );
};

export default Dashboard; 