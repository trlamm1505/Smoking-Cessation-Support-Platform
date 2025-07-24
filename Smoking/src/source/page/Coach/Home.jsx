import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Timeline, Button, Typography, Space, Tag, message, Spin } from 'antd';
import { ClockCircleOutlined, TrophyOutlined, DollarOutlined, HeartOutlined, CalendarOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axiosClient from '../Axios/AxiosCLients';
import axios from 'axios';

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
`;

const CoachHome = () => {
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    const coachId = localStorage.getItem('coachId');
    console.log('coachId in localStorage:', coachId);
    if (!coachId) {
      message.error('Không tìm thấy coachId!');
      setLoading(false);
      return;
    }
    axiosClient.get(`/api/statistics/consultations/summary/${coachId}`)
      .then(res => {
        console.log('Statistics data response:', res.data);
        setCoachData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching statistics data:', err);
        if (err?.response) {
          console.error('API error response:', err.response.data);
        }
        message.error('Không lấy được thông tin thống kê!');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoadingLeaderboard(true);
    axios.get('http://localhost:8080/achievements/user-summary')
      .then(res => {
        const sorted = [...res.data].sort((a, b) => b.achievementCount - a.achievementCount);
        setLeaderboard(sorted);
      })
      .catch(() => setLeaderboard([]))
      .finally(() => setLoadingLeaderboard(false));
  }, []);

  if (loading) return <PageContainer><Title>Đang tải dữ liệu...</Title></PageContainer>;
  if (!coachData) return <PageContainer><Title>Không có dữ liệu coach</Title></PageContainer>;

  return (
    <PageContainer>
      <WelcomeTitle level={2}>
        Xin chào, {coachData.fullName || 'Coach'}!
      </WelcomeTitle>

      <Row gutter={[32, 32]} align="top">
        {/* Thống kê bên trái */}
        <Col xs={24} lg={16}>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12}>
              <StatisticCard>
                <TeamOutlined className="icon" />
                <Statistic
                  title="Khách Hàng Đang Tư Vấn"
                  value={coachData.totalMembers || 0}
                  suffix="người"
                />
              </StatisticCard>
            </Col>
            <Col xs={24} sm={12}>
              <StatisticCard>
                <CalendarOutlined className="icon" />
                <Statistic
                  title="Buổi Tư Vấn Đã Hoàn Thành"
                  value={coachData.completedSessions || 0}
                  suffix="buổi"
                />
              </StatisticCard>
            </Col>
          </Row>
        </Col>

        {/* Leaderboard bên phải */}
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

export default CoachHome; 