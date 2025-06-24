import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Button, message, InputNumber, Space, Calendar, Modal, Badge, Steps } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    BarChartOutlined,
    ScheduleOutlined,
    CheckOutlined
} from '@ant-design/icons';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import dayjs from 'dayjs';
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

const AnimatedCard = styled(Card)`
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(95, 184, 179, 0.1);
  margin-bottom: 24px;
  border: 1px solid #E3F6F5;
`;

const PageContainer = styled.div`
    padding: 24px;
    background: #e8f4f3;
    min-height: 100vh;

    .page-title {
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #1a1a1a;

        .anticon {
            color: #5FB8B3;
            font-size: 24px;
            animation: shine 2s infinite;
        }

        @keyframes shine {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
    }

    .schedule-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(95, 184, 179, 0.1);
        border: 1px solid #E3F6F5;

        .ant-list-item {
            padding: 20px;
            background: #f0f8f7;
            border-radius: 8px;
            margin: 16px;
            transition: all 0.3s ease;
            border: 1px solid #E3F6F5;

            &:hover {
                transform: translateX(5px);
                box-shadow: 0 2px 8px rgba(95, 184, 179, 0.1);
            }

            .task-content {
                flex: 1;
            }

            .task-title {
                font-size: 16px;
                font-weight: 600;
                color: #2c7a75;
                margin-bottom: 8px;
            }

            .task-description {
                color: #666;
                font-size: 14px;
            }

            .status-buttons {
                display: flex;
                gap: 8px;
            }

            .completed {
                opacity: 0.7;
                background: #e8f4f3;

                .task-title {
                    text-decoration: line-through;
                }
            }
        }

        .target-section {
            padding: 20px;
            background: #f0f8f7;
            border-radius: 8px;
            margin: 16px;
            border: 1px solid #E3F6F5;

            .target-header {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #2c7a75;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 16px;
            }

            .target-content {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 12px;
            }

            .target-label {
                color: #666;
                font-size: 14px;
            }

            .target-number {
                font-size: 24px;
                font-weight: 600;
                color: #5FB8B3;
            }

            .target-arrow {
                color: #5FB8B3;
                font-size: 20px;
            }
        }
    }

    .calendar-section {
        margin-top: 24px;

        h3 {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #1a1a1a;

            .anticon {
                color: #5FB8B3;
                font-size: 24px;
                animation: shine 2s infinite;
            }
        }
    }

    .calendar-card {
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(95, 184, 179, 0.1);
        border: 1px solid #E3F6F5;

        .ant-picker-calendar {
            background: transparent;
        }

        .ant-picker-cell {
            &:hover .ant-picker-cell-inner {
                background: #e8f4f3;
            }
        }

        .ant-picker-cell-selected .ant-picker-cell-inner {
            background: #5FB8B3 !important;
        }

        .task-status-badge {
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #666;

            .ant-badge-status-dot {
                width: 6px;
                height: 6px;
            }

            .completed {
                color: #5FB8B3;
            }

            .in-progress {
                color: #91A7FF;
            }

            .not-started {
                color: #B5B5C3;
            }
        }
    }

    .history-modal {
        .ant-modal-content {
            border-radius: 12px;
        }

        .modal-title {
            color: #2c7a75;
            margin-bottom: 16px;
        }

        .history-list {
            .history-item {
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 8px;
                background: #f0f8f7;
                border: 1px solid #E3F6F5;

                .task-status {
                    font-weight: 600;
                    &.completed {
                        color: #5FB8B3;
                    }
                    &.incomplete {
                        color: #ff4d4f;
                    }
                }
            }
        }
    }
`;

const StepsCustomStyle = createGlobalStyle`
  .ant-steps-item-process .ant-steps-icon {
    background: linear-gradient(135deg, #5FB8B3 60%, #70C1BC 100%);
    color: #fff !important;
    box-shadow: 0 4px 16px rgba(95,184,179,0.15);
    border: none;
  }
  .ant-steps-item-process .ant-steps-icon > .ant-steps-icon-dot {
    background: transparent !important;
  }
`;

// Custom Step Bar Styles (đẹp mắt, spacing đều, line chuyển màu, responsive)
const StepBarWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #f8fdfc;
  border-radius: 16px 16px 0 0;
  padding: 32px 32px 0 32px;
  gap: 0;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 20px;
    padding: 16px 8px 0 8px;
  }
`;
const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 120px;
  position: relative;
  z-index: 1;
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 27px;
    left: 54px;
    right: -50%;
    height: 4px;
    background: ${({ status }) => status === 'done' ? 'linear-gradient(90deg, #5FB8B3 60%, #70C1BC 100%)' : '#e3f6f5'};
    border-radius: 2px;
    z-index: 0;
    @media (max-width: 700px) {
      display: none;
    }
  }
`;
const StepNumber = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: ${({ current }) => current ? '0 6px 24px rgba(95,184,179,0.18)' : 'none'};
  background: ${({ current, done }) =>
        current ? 'linear-gradient(135deg, #5FB8B3 60%, #70C1BC 100%)'
            : done ? '#fff' : '#f3f3f3'};
  color: ${({ current, done }) =>
        current ? '#fff'
            : done ? '#5FB8B3' : '#bdbdbd'};
  border-radius: ${({ current }) => current ? '12px' : '50%'};
  border: ${({ current, done }) =>
        current ? 'none'
            : done ? '2px solid #5FB8B3' : '2px solid #e3f6f5'};
  transition: all 0.3s;
  position: relative;
  z-index: 2;
`;
const StepTitle = styled.div`
  font-size: ${({ current }) => current ? '1.25rem' : '1.08rem'};
  font-weight: ${({ current }) => current ? 800 : 600};
  color: ${({ current, done }) =>
        current ? '#222'
            : done ? '#5FB8B3' : '#bdbdbd'};
  margin-bottom: 2px;
  text-align: center;
  letter-spacing: 0.01em;
`;
const StepDesc = styled.div`
  font-size: 0.98rem;
  color: ${({ current, done }) =>
        current ? '#666'
            : done ? '#5FB8B3bb' : '#bdbdbd'};
  margin-bottom: 0;
  text-align: center;
  min-height: 36px;
`;

const StyledSteps = styled(Steps)`
  .ant-steps-item-icon,
  .ant-steps-item-process .ant-steps-item-icon,
  .ant-steps-item-finish .ant-steps-item-icon,
  .ant-steps-item-wait .ant-steps-item-icon {
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;
    line-height: 40px !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    overflow: hidden !important;
    background-clip: padding-box !important;
  }
  .ant-steps-item-process .ant-steps-item-icon {
    position: relative !important;
  }
  .ant-steps-item-process .ant-steps-item-icon::before {
    content: '';
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #5FB8B3, #85BB47);
    z-index: 0;
  }
  .ant-steps-item-process .ant-steps-icon {
    position: relative;
    z-index: 1;
    color: #fff !important;
  }
  .ant-steps-item-icon {
    background: white;
    border: 2px solid #e8e8e8;
    font-size: 20px;
    transition: all 0.4s;
  }
  .ant-steps-item-finish .ant-steps-item-icon {
    background: #fff;
    border-color: #5FB8B3;
    color: #5FB8B3;
  }
  .ant-steps-item-wait .ant-steps-item-icon {
    background: #f5f7f7;
    color: #bdbdbd;
    border: 2px solid #e8f4f3;
  }
  .ant-steps-item-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }
  .ant-steps-item-description {
    font-size: 14px;
    color: #666;
    max-width: 150px;
  }
  .ant-steps-item-tail::after {
    background: #e8e8e8;
    height: 2px;
  }
  .ant-steps-item-finish .ant-steps-item-tail::after {
    background: linear-gradient(90deg, #5FB8B3, #85BB47);
  }
`;

function CustomStepBar({ phases, currentPhase }) {
    return (
        <StepBarWrapper>
            {phases.map((phase, idx) => {
                let status = idx < currentPhase ? 'done' : idx === currentPhase ? 'current' : 'upcoming';
                return (
                    <StepItem key={phase.title} status={status}>
                        <StepNumber current={idx === currentPhase} done={idx < currentPhase}>{idx + 1}</StepNumber>
                        <StepTitle current={idx === currentPhase} done={idx < currentPhase}>{phase.title}</StepTitle>
                        <StepDesc current={idx === currentPhase} done={idx < currentPhase}>{phase.description}</StepDesc>
                    </StepItem>
                );
            })}
        </StepBarWrapper>
    );
}

const DetailedSchedule = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taskHistory, setTaskHistory] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [planStartDate, setPlanStartDate] = useState(null);
    const [soNgay, setSoNgay] = useState(30);
    const [viewingDate, setViewingDate] = useState(dayjs());
    const [activityStatus, setActivityStatus] = useState({});

    useEffect(() => {
        // Fetch kế hoạch cai thuốc để lấy years, cigarettesPerDay
        const userId = Number(localStorage.getItem('userId')) || 1;
        fetch(`http://localhost:8080/api/cessation-plans/user/${userId}`)
            .then(res => res.json())
            .then(data => {
                let plan = Array.isArray(data) ? data[0] : data;
                const years = plan.smokingFrequency || 1;
                const cigarettesPerDay = plan.cigarettesPerDay || 10;
                // Lấy số ngày đúng từ kế hoạch
                const soNgayValue = plan.targetQuitDate && plan.startDate
                    ? dayjs(plan.targetQuitDate).diff(dayjs(plan.startDate), 'day')
                    : 30;
                setSoNgay(soNgayValue);
                setPlanStartDate(plan.startDate ? dayjs(plan.startDate) : null);
                // Gọi API sinh lịch trình
                return fetch('http://localhost:8080/stages/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ years, cigarettesPerDay, soNgay: soNgayValue })
                });
            })
            .then(res => res.json())
            .then(schedule => {
                setTasks(schedule);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleTaskComplete = async (taskId, completed) => {
        const userId = Number(localStorage.getItem('userId')) || 1;
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        try {
            await axios.post(`http://localhost:8080/user-plan-stage-progress/tick`, null, {
                params: {
                    userId,
                    sequenceOrder: task.day,
                    completed
                }
            });
            // Cập nhật trạng thái local
            const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: completed } : t);
            setTasks(updatedTasks);
        } catch (err) {
            message.error('Lỗi khi cập nhật trạng thái nhiệm vụ!');
        }
    };

    const handleActivityComplete = (taskId, activityIdx, completed) => {
        setActivityStatus(prev => ({
            ...prev,
            [`${taskId}_${activityIdx}`]: completed
        }));
    };

    const renderTaskContent = (task) => {
        if (task.isTarget) {
            return (
                <div className="target-section">
                    <div className="target-header">
                        <BarChartOutlined /> Mục tiêu hôm nay
                    </div>
                    <div className="target-content">
                        <div>
                            <div className="target-label">Số điếu hiện tại</div>
                            <div className="target-number">{task.currentAmount}</div>
                        </div>
                        <div className="target-arrow">→</div>
                        <div>
                            <div className="target-label">Mục tiêu giảm còn</div>
                            <div className="target-number">{task.targetAmount}</div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="task-content">
                <div className="task-title">{task.title}</div>
                <div className="task-description">{task.description}</div>
            </div>
        );
    };

    const dateCellRender = (date) => {
        const dateStr = date.format('YYYY-MM-DD');
        const dayTasks = taskHistory[dateStr] || [];
        const today = dayjs();

        if (dayTasks.length === 0) return null;

        const completedTasks = dayTasks.filter(task => task.status === true).length;
        const totalTasks = dayTasks.length;
        const isPastDay = date.isBefore(today, 'day');
        const isFutureDay = date.isAfter(today, 'day');
        const isToday = date.isSame(today, 'day');

        // Chỉ hiển thị màu cho ngày đã qua và ngày hiện tại
        if (isFutureDay) {
            return (
                <div className="task-status-badge">
                    <div style={{
                        color: '#666',
                        fontSize: '13px',
                    }}>
                        {completedTasks}/{totalTasks}
                    </div>
                </div>
            );
        }

        // Màu sắc cho các ngày
        let textColor, backgroundColor;

        if (isToday) {
            // Ngày hiện tại - màu xanh dương
            textColor = '#2196f3';
            backgroundColor = '#e3f2fd';
        } else if (completedTasks < 3) {
            // Ngày có ít hơn 3 nhiệm vụ hoàn thành - màu cam
            textColor = '#ff6b00';
            backgroundColor = '#fff4e6';
        } else if (isPastDay) {
            // Ngày đã qua - màu tím
            textColor = '#8c54ff';
            backgroundColor = '#f3ebff';
        } else {
            // Các trường hợp còn lại - màu xanh lá
            textColor = '#1d9a54';
            backgroundColor = '#e6f8ef';
        }

        return (
            <div className="task-status-badge">
                <div style={{
                    backgroundColor,
                    color: textColor,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'inline-block',
                    border: isToday ? `1px solid ${textColor}` : 'none'
                }}>
                    {completedTasks}/{totalTasks}
                </div>
            </div>
        );
    };

    const onSelect = (date) => {
        setSelectedDate(date);
        setViewingDate(date);
        setIsModalVisible(true);
    };

    const phases = [
        { title: 'Chuẩn bị', description: 'Lập kế hoạch và chuẩn bị tâm lý', duration: 7 },
        { title: 'Giảm dần', description: 'Giảm số lượng điếu thuốc', duration: 7 },
        { title: 'Cai hoàn toàn', description: 'Ngừng hút thuốc', duration: 7 },
        { title: 'Duy trì', description: 'Duy trì thói quen không hút thuốc', duration: 7 }
    ];
    const today = dayjs();
    let todayIndex = 1;
    if (planStartDate) {
        todayIndex = today.diff(planStartDate, 'day') + 1;
    }
    const todayTasks = tasks.filter(item => item.day === todayIndex);
    const otherTasks = tasks.filter(item => item.day !== todayIndex);

    // Tính nhiệm vụ của ngày viewingDate (nếu trong phạm vi kế hoạch)
    let viewingDayIndex = null;
    if (planStartDate && viewingDate) {
      const diff = viewingDate.startOf('day').diff(planStartDate.startOf('day'), 'day') + 1;
      if (diff > 0 && diff <= soNgay) {
        viewingDayIndex = diff;
      }
    }
    const viewingTasks = viewingDayIndex
      ? tasks.filter(item => item.day === viewingDayIndex)
      : [];

    return (
        <PageContainer>
            <StepsCustomStyle />
            <Title level={2} className="page-title">
                <ScheduleOutlined style={{ color: '#5FB8B3', fontSize: 32, marginRight: 12, verticalAlign: 'middle' }} />
                Lịch Trình Chi Tiết
            </Title>

            {/* Giai đoạn cai thuốc */}
            <AnimatedCard delay="0.5s">
                <Card style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #E3F6F5', boxShadow: '0 2px 8px rgba(95,184,179,0.07)', padding: 0 }}>
                    <StyledSteps current={todayIndex - 1}>
                        {phases.map(phase => (
                            <Steps.Step
                                key={phase.title}
                                title={<div>{phase.title}<div style={{ fontSize: 13, color: '#888', fontWeight: 400, marginTop: 2 }}>{phase.duration} ngày</div></div>}
                                description={phase.description}
                            />
                        ))}
                    </StyledSteps>
                </Card>
            </AnimatedCard>

            <AnimatedCard delay="1s">
                <Card className="schedule-card">
                    <List
                        dataSource={viewingTasks}
                        renderItem={task => (
                            <List.Item className={task.status === true ? 'completed' : ''}>
                                <div style={{ width: '100%' }}>
                                    <div className="task-title">{task.title || `Kế hoạch ngày ${task.day} - ${task.stageName || ''}`}</div>
                                    {task.goal && (
                                        <div style={{ color: '#5FB8B3', fontWeight: 500, marginBottom: 4 }}>
                                            Mục tiêu: {task.goal}
                                        </div>
                                    )}
                                    {task.activities && Array.isArray(task.activities) && (
                                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                                            {task.activities.map((act, idx) => (
                                                <li key={idx} style={{ color: '#444', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span>{typeof act === 'string' ? act : act.name}</span>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <Button
                                                            type={activityStatus[`${task.id}_${idx}`] === true ? 'primary' : 'default'}
                                                            icon={<CheckCircleOutlined />}
                                                            onClick={() => handleActivityComplete(task.id, idx, true)}
                                                            style={activityStatus[`${task.id}_${idx}`] === true ? { background: '#5FB8B3', borderColor: '#5FB8B3', color: '#fff' } : {}}
                                                        >
                                                            Hoàn thành
                                                        </Button>
                                                        <Button
                                                            type={activityStatus[`${task.id}_${idx}`] === false ? 'primary' : 'default'}
                                                            danger={activityStatus[`${task.id}_${idx}`] === false}
                                                            icon={<CloseCircleOutlined />}
                                                            onClick={() => handleActivityComplete(task.id, idx, false)}
                                                        >
                                                            Không hoàn thành
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {task.description && (
                                        <div style={{ color: '#666', fontSize: 14 }}>{task.description}</div>
                                    )}
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
            </AnimatedCard>

            {/* Calendar section */}
            <div className="calendar-section">
                <Title level={3}>
                    <CalendarOutlined /> Lịch Sử Nhiệm Vụ
                </Title>
                <AnimatedCard delay="1.5s">
                    <Card className="calendar-card">
                        <Calendar
                            fullscreen={false}
                            dateCellRender={dateCellRender}
                            onSelect={onSelect}
                        />
                    </Card>
                </AnimatedCard>
            </div>

            <List
                dataSource={otherTasks}
                renderItem={item => (
                    <List.Item style={{ background: '#f8fdfc', borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px rgba(95,184,179,0.07)', border: '1px solid #E3F6F5', padding: 24 }}>
                        <div style={{ width: '100%' }}>
                            <div style={{ fontWeight: 700, fontSize: 18, color: '#2c7a75', marginBottom: 4 }}>
                                Ngày {item.day} - {item.stageName}
                            </div>
                            <div style={{ color: '#5FB8B3', fontWeight: 500, marginBottom: 4 }}>Mục tiêu: {item.goal}</div>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                {item.activities && item.activities.map((act, idx) => (
                                    <li key={idx} style={{ color: '#444', marginBottom: 2 }}>{act}</li>
                                ))}
                            </ul>
                        </div>
                    </List.Item>
                )}
            />
        </PageContainer>
    );
};

export default DetailedSchedule; 