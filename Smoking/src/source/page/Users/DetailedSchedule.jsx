import React, { useState } from 'react';
import { Card, List, Typography, Button, message, InputNumber, Space, Calendar, Modal, Badge } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    BarChartOutlined,
    ScheduleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

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

    return (
        <PageContainer>
            <Title level={2} className="page-title">
                <ScheduleOutlined style={{ color: '#5FB8B3', fontSize: 32, marginRight: 12, verticalAlign: 'middle' }} />
                Nhiệm Vụ Hôm Nay
            </Title>

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

            {/* Calendar section */}
            <div className="calendar-section">
                <Title level={3}>
                    <CalendarOutlined /> Lịch Sử Nhiệm Vụ
                </Title>
                <Card className="calendar-card">
                    <Calendar
                        fullscreen={false}
                        dateCellRender={dateCellRender}
                        onSelect={onSelect}
                    />
                </Card>
            </div>

            {/* History Modal */}
            {renderHistoryModal()}
        </PageContainer>
    );
};

export default DetailedSchedule; 