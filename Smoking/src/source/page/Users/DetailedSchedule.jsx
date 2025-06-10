import React, { useState } from 'react';
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
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Mục tiêu giảm thuốc hôm nay',
            description: 'Giảm từ 10 điếu xuống còn 8 điếu',
            isTarget: true,
            currentAmount: 10,
            targetAmount: 8,
            status: null
        },
        {
            id: 2,
            title: 'Thực hành hít thở sâu',
            description: 'Khi cảm thấy thèm thuốc, hãy thực hiện 5-10 hơi thở sâu để kiểm soát cảm giác',
            status: null
        },
        {
            id: 3,
            title: 'Uống nhiều nước',
            description: 'Uống ít nhất 2 lít nước mỗi ngày để giảm cơn thèm thuốc',
            status: null
        },
        {
            id: 4,
            title: 'Hoạt động thay thế',
            description: 'Khi muốn hút thuốc, hãy nhai kẹo cao su hoặc ăn nhẹ đồ healthy',
            status: null
        },
        {
            id: 5,
            title: 'Tránh trigger',
            description: 'Tránh xa những địa điểm hoặc tình huống có thể gây thèm thuốc',
            status: null
        },
        {
            id: 6,
            title: 'Vận động nhẹ nhàng',
            description: 'Đi bộ hoặc tập thể dục 15 phút khi cảm thấy thèm thuốc',
            status: null
        }
    ]);

    // Tạo dữ liệu mẫu cho 30 ngày (15 ngày trước và 15 ngày tới)
    const generateSampleData = () => {
        const data = {};
        const today = dayjs();
        const startDate = today.subtract(15, 'day');

        // Tạo dữ liệu cho 30 ngày
        for (let i = 0; i < 30; i++) {
            const currentDate = startDate.add(i, 'day');
            const dateStr = currentDate.format('YYYY-MM-DD');

            // Tạo dữ liệu khác nhau cho mỗi ngày
            if (currentDate.isBefore(today, 'day')) {
                // Ngày đã qua - có trạng thái hoàn thành ngẫu nhiên
                data[dateStr] = tasks.map(task => ({
                    ...task,
                    status: Math.random() > 0.3, // 70% khả năng hoàn thành
                    currentAmount: task.isTarget ? Math.floor(Math.random() * 3) + 8 : undefined, // 8-10 điếu
                    targetAmount: task.isTarget ? Math.floor(Math.random() * 3) + 5 : undefined  // 5-7 điếu
                }));
            } else if (currentDate.isSame(today, 'day')) {
                // Ngày hiện tại - giữ nguyên tasks
                data[dateStr] = tasks;
            } else {
                // Ngày tương lai - tạo mục tiêu giảm dần
                const daysFromToday = currentDate.diff(today, 'day');
                const targetCigarettes = Math.max(0, 8 - Math.floor(daysFromToday / 2));
                data[dateStr] = tasks.map(task => ({
                    ...task,
                    status: null,
                    currentAmount: task.isTarget ? 8 : undefined,
                    targetAmount: task.isTarget ? targetCigarettes : undefined
                }));
            }
        }
        return data;
    };

    const [taskHistory, setTaskHistory] = useState(generateSampleData());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleTaskComplete = (taskId, completed) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                const newStatus = completed;
                message.success(`${completed ? '✅' : '❌'} ${task.title}`);
                return { ...task, status: newStatus };
            }
            return task;
        });
        setTasks(updatedTasks);

        const currentDate = dayjs().format('YYYY-MM-DD');
        setTaskHistory(prev => ({
            ...prev,
            [currentDate]: updatedTasks
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
        setIsModalVisible(true);
    };

    const renderHistoryModal = () => {
        if (!selectedDate) return null;

        const dateStr = selectedDate.format('YYYY-MM-DD');
        const dayTasks = taskHistory[dateStr] || tasks.map(task => ({ ...task, status: null }));
        const isPast = selectedDate.isBefore(dayjs(), 'day');
        const isToday = selectedDate.isSame(dayjs(), 'day');
        const isFuture = selectedDate.isAfter(dayjs(), 'day');

        const getStatusBadge = (task) => (
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: 500,
                background: task.status === true ? '#e8f5e9' :
                    task.status === false ? '#fff1f0' : '#f0f8f7',
                color: task.status === true ? '#52c41a' :
                    task.status === false ? '#ff4d4f' : '#5FB8B3'
            }}>
                {isPast ? (
                    task.status === true ? '✅ Đã hoàn thành' : '❌ Không hoàn thành'
                ) : isToday ? (
                    task.status === true ? '✅ Đã hoàn thành' :
                        task.status === false ? '❌ Chưa hoàn thành' :
                            '⏳ Đang thực hiện'
                ) : (
                    '🔄 Chưa đến ngày'
                )}
            </div>
        );

        const renderTaskItem = (task) => (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fdfc',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #E3F6F5',
                marginBottom: '12px'
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#2c7a75',
                        marginBottom: '4px'
                    }}>
                        {task.title}
                    </div>
                    <div style={{
                        color: '#666',
                        fontSize: '14px'
                    }}>
                        {task.description}
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginLeft: '24px'
                }}>
                    {getStatusBadge(task)}
                    {isToday && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                                type={task.status === true ? 'primary' : 'default'}
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleTaskComplete(task.id, true)}
                                style={{
                                    background: task.status === true ? '#5FB8B3' : '',
                                    borderColor: task.status === true ? '#5FB8B3' : ''
                                }}
                                size="small"
                            >
                                Hoàn thành
                            </Button>
                            <Button
                                type={task.status === false ? 'primary' : 'default'}
                                danger={task.status === false}
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleTaskComplete(task.id, false)}
                                size="small"
                            >
                                Chưa hoàn thành
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );

        return (
            <Modal
                title={null}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1000}
                style={{ top: 20 }}
            >
                <div style={{ padding: '0 24px' }}>
                    <Title level={4} style={{
                        color: '#2c7a75',
                        marginBottom: '24px',
                        textAlign: 'center',
                        borderBottom: '2px solid #E3F6F5',
                        paddingBottom: '16px'
                    }}>
                        {isToday ? 'Nhiệm vụ hôm nay' :
                            isPast ? 'Nhiệm vụ đã qua' :
                                'Nhiệm vụ sắp tới'} - {selectedDate.format('DD/MM/YYYY')}
                    </Title>

                    {/* Render all tasks in vertical layout */}
                    <div>
                        {dayTasks.map((task, index) => renderTaskItem(task))}
                    </div>
                </div>
            </Modal>
        );
    };

    const phases = [
        { title: 'Chuẩn bị', description: 'Lập kế hoạch và chuẩn bị tâm lý', duration: 7 },
        { title: 'Giảm dần', description: 'Giảm số lượng điếu thuốc', duration: 7 },
        { title: 'Cai hoàn toàn', description: 'Ngừng hút thuốc', duration: 7 },
        { title: 'Duy trì', description: 'Duy trì thói quen không hút thuốc', duration: 7 }
    ];
    const planStartDate = dayjs().startOf('day'); // Giả sử bắt đầu từ hôm nay
    const daysPassed = dayjs().diff(planStartDate, 'day');
    let currentPhase = 2; // Giai đoạn số 3: Cai hoàn toàn
    let phaseStartDay = 0;
    for (let i = 0; i < phases.length; i++) {
        phaseStartDay += phases[i].duration;
        if (daysPassed < phaseStartDay) {
            // currentPhase = i;
            break;
        }
    }
    const phaseOrder = phases.map((p, idx) => `${idx + 1}. ${p.title}`);

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
                    <StyledSteps current={currentPhase}>
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
                        dataSource={tasks}
                        renderItem={task => (
                            <List.Item className={task.status === true ? 'completed' : ''}>
                                {renderTaskContent(task)}
                                <div className="status-buttons">
                                    <Button
                                        type={task.status === true ? 'primary' : 'default'}
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => handleTaskComplete(task.id, true)}
                                        style={{
                                            background: task.status === true ? '#5FB8B3' : '',
                                            borderColor: task.status === true ? '#5FB8B3' : ''
                                        }}
                                    >
                                        Hoàn thành
                                    </Button>
                                    <Button
                                        type={task.status === false ? 'primary' : 'default'}
                                        danger={task.status === false}
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => handleTaskComplete(task.id, false)}
                                    >
                                        Chưa hoàn thành
                                    </Button>
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

            {/* History Modal */}
            {renderHistoryModal()}
        </PageContainer>
    );
};

export default DetailedSchedule; 