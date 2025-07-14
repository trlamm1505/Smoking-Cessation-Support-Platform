import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Timeline, Button, Typography, Space, Tag, Spin, message } from 'antd';
import { ClockCircleOutlined, TrophyOutlined, DollarOutlined, HeartOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import userApi from '../Axios/userAxios';
import axios from 'axios';

const { Title, Text } = Typography;

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
    animation: ${slideUp} 0.5s ease-out forwards;
    animation-delay: ${props => props.delay || '0s'};
    opacity: 0;

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
    const [userData, setUserData] = useState(null);
    const [plan, setPlan] = useState(null);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId = localStorage.getItem('userId');
                if (!userId || userId === 'undefined' || userId === 'null') {
                    setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
                    setLoading(false);
                    return;
                }
                // Gọi song song 3 API: userApi.get, habit-logs/stats/plan, cessation-plans
                const [userRes, statsRes, planRes] = await Promise.all([
                    userApi.get(userId),
                    axios.get(`http://localhost:8080/habit-logs/stats/plan/${userId}`),
                    axios.get(`http://localhost:8080/api/cessation-plans/user/${userId}`)
                ]);
                const user = userRes.data;
                const stats = Array.isArray(statsRes.data) && statsRes.data.length > 0 ? statsRes.data[0] : null;
                const planData = Array.isArray(planRes.data) && planRes.data.length > 0 ? planRes.data[0] : null;
                setUserData({
                    name: user.fullName || user.name || user.username || 'Người dùng',
                    daysWithoutSmoking: stats ? stats.totalNoSmokeDays : (user.daysWithoutSmoking || 0),
                    planDays: stats && stats.planDays ? stats.planDays : 30,
                    cigarettesAvoided: user.cigarettesAvoided || 0,
                    moneySaved: stats ? stats.totalMoneySaved : (user.moneySaved || 0),
                    healthImprovement: user.healthImprovement || 0,
                    nextMilestone: user.nextMilestone || 30,
                    leaderboard: user.leaderboard || [],
                    recentActivities: user.recentActivities || [],
                });
                setPlan(planData);
                // Lấy tham số cho stages/generate
                const years = user.years || 5;
                const cigarettesPerDay = user.cigarettesPerDay || user.cigarettes_per_day || 5;
                const soNgay = planData ? getPlanDays(planData.startDate, planData.targetQuitDate) : 20;
                // Gọi API stages/generate với đúng tham số
                const stagesRes = await axios.post('http://localhost:8080/stages/generate', { years, cigarettesPerDay, soNgay });
                setStages(stagesRes.data);
            } catch (err) {
                setError('Lỗi khi tải dữ liệu người dùng.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch leaderboard
    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoadingLeaderboard(true);
            try {
                const res = await axios.get('http://localhost:8080/achievements/user-summary');
                // Sắp xếp theo achievementCount giảm dần
                const sorted = [...res.data].sort((a, b) => b.achievementCount - a.achievementCount);
                setLeaderboard(sorted);
            } catch (err) {
                setLeaderboard([]);
            } finally {
                setLoadingLeaderboard(false);
            }
        };
        fetchLeaderboard();
    }, []);

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN');
    }
    function getDaysDone(startDate) {
        if (!startDate) return 0;
        const start = new Date(startDate);
        const today = new Date();
        const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        return diff >= 0 ? diff + 1 : 0;
    }
    function getPlanDays(startDate, endDate) {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.floor((end - start) / (1000 * 60 * 60 * 24));
    }
    function getDaysDoneCapped(startDate, endDate) {
        const done = getDaysDone(startDate);
        const total = getPlanDays(startDate, endDate);
        return done > total ? total : done;
    }

    // Xử lý dữ liệu stages thành các giai đoạn (dùng stageName, goal, đếm số ngày, số ngày đã hoàn thành)
    const stageProgress = React.useMemo(() => {
        if (!stages || stages.length === 0 || !plan) return [];
        // Nhóm theo stageOrder
        const grouped = {};
        stages.forEach(item => {
            const key = item.stageOrder || item.stage_name || item.stageName;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(item);
        });
        // Tính số ngày đã hoàn thành cho từng giai đoạn
        let remain = getDaysDoneCapped(plan.startDate, plan.targetQuitDate);
        return Object.keys(grouped).sort((a, b) => a - b).map(order => {
            const arr = grouped[order];
            const stageName = arr[0].stageName || arr[0].stage_name || `Giai đoạn ${order}`;
            const goal = arr[0].goal;
            const totalDays = arr.length;
            const done = Math.max(0, Math.min(remain, totalDays));
            remain -= done;
            return {
                stageName,
                goal,
                totalDays,
                done
            };
        });
    }, [stages, plan]);

    // Thêm phases tĩnh giống DetailedSchedule.jsx
    const phases = [
        { title: 'Giai đoạn 1', description: 'Lập kế hoạch và chuẩn bị tâm lý' },
        { title: 'Giai đoạn 2', description: 'Giảm số lượng điếu thuốc' },
        { title: 'Giai đoạn 3', description: 'Ngừng hút thuốc' },
        { title: 'Giai đoạn 4', description: 'Duy trì thói quen không hút thuốc' }
    ];

    // Tạo phaseInfos từ stages (giống DetailedSchedule.jsx)
    const phaseInfos = phases.map((phase) => {
        const tasksOfPhase = stages.filter(t => t.stageName === phase.title);
        const goal = tasksOfPhase[0]?.goal || phase.description;
        const days = tasksOfPhase.length;
        return { ...phase, goal, days };
    });

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Spin size="large" /></div>;
    }
    if (error) {
        return <div style={{ textAlign: 'center', color: 'red', marginTop: 40 }}>{error}</div>;
    }
    if (!userData) return null;

    return (
        <PageContainer>
            <WelcomeTitle level={2}>
                <HomeOutlined className="home-icon" />
                {`Xin chào, ${userData.name}`}
            </WelcomeTitle>

            {/* Hàng 1: 2 thẻ thống kê kéo dài ngang khung hình */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <StatisticCard>
                        <ClockCircleOutlined className="icon" />
                        <Statistic
                            title="Số Ngày Không Hút Thuốc"
                            value={userData.daysWithoutSmoking}
                            suffix="ngày"
                        />
                    </StatisticCard>
                </Col>
                <Col xs={24} lg={12}>
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
            </Row>

            {/* Hàng 2: Tiến trình và Leaderboard */}
            <Row gutter={[24, 24]}>
                {/* Cột trái: Tiến trình cai thuốc */}
                <Col xs={24} lg={16}>
                    <ProgressCard title="Tiến Trình Cai Thuốc" style={{ height: 'auto' }}>
                        <Progress
                            percent={plan ? Math.round((getDaysDoneCapped(plan.startDate, plan.targetQuitDate) / getPlanDays(plan.startDate, plan.targetQuitDate)) * 100) : 0}
                            strokeColor={{
                                '0%': '#5FB8B3',
                                '100%': '#4ca29d'
                            }}
                            strokeWidth={12}
                            format={() => plan ? `${getDaysDoneCapped(plan.startDate, plan.targetQuitDate)}/${getPlanDays(plan.startDate, plan.targetQuitDate)}` : '0/0'}
                        />
                        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 20, fontSize: '15px' }}>
                            {plan ? `Còn ${getPlanDays(plan.startDate, plan.targetQuitDate) - getDaysDoneCapped(plan.startDate, plan.targetQuitDate)} ngày nữa đến mốc ${getPlanDays(plan.startDate, plan.targetQuitDate)} ngày!` : 'Chưa có kế hoạch.'}
                        </Text>
                    </ProgressCard>

                    {/* Tiến trình theo giai đoạn */}
                    <ProgressCard title="Tiến Trình Theo Giai Đoạn" style={{ height: 'auto', marginTop: 24 }}>
                        {stageProgress && stageProgress.length > 0 ? (
                            stageProgress.map((stage, idx) => (
                                <div key={idx} style={{ marginBottom: 20 }}>
                                    <div style={{ fontWeight: 700, fontSize: 15 }}>{stage.stageName}</div>
                                    <div style={{ fontWeight: 500, color: '#5FB8B3', marginBottom: 4 }}>{stage.goal}</div>
                                    <Progress
                                        percent={stage.totalDays > 0 ? Math.round((stage.done / stage.totalDays) * 100) : 0}
                                        strokeColor={{
                                            '0%': '#5FB8B3',
                                            '100%': '#4ca29d'
                                        }}
                                        strokeWidth={10}
                                        format={percent => `${percent}%`}
                                    />
                                </div>
                            ))
                        ) : (
                            <Text type="secondary">Chưa có dữ liệu giai đoạn.</Text>
                        )}
                    </ProgressCard>
                </Col>
                {/* Cột phải: Leaderboard */}
                <Col xs={24} lg={8}>
                    <LeaderboardCard>
                        <div className="leaderboard-header">
                            <TrophyOutlined className="trophy-icon" />
                            <span style={{ fontWeight: 600, fontSize: 18 }}>Bảng Xếp Hạng</span>
                        </div>
                        {loadingLeaderboard ? (
                            <Spin />
                        ) : (
                            leaderboard.length === 0 ? (
                                <Text type="secondary">Chưa có dữ liệu xếp hạng.</Text>
                            ) : (
                                leaderboard.slice(0, 10).map((user, idx) => (
                                    <div className="leaderboard-item" key={user.userId}>
                                        <span className={`rank rank-${idx < 3 ? idx + 1 : 'other'}`}>{`#${idx + 1}`}</span>
                                        <img src={user.avatarUrl || user.avatarURL || user.avatar || ''} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginLeft: 12, border: '2px solid #5FB8B3' }} />
                                        <div className="user-info">
                                            <div className="user-name">{user.fullName}</div>
                                            <div className="stats">
                                                <div className="stat-item"><ClockCircleOutlined /> {user.noSmokeDays} ngày</div>
                                                <div className="stat-item"><DollarOutlined /> {user.moneySaved?.toLocaleString()}đ</div>
                                                <div className="stat-item"><TrophyOutlined /> {user.achievementCount} thành tích</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </LeaderboardCard>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default Home; 