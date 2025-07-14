import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Modal, Form, DatePicker, Select, Input, message, Table, Tag } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import dayjs from 'dayjs';
import axiosClient from '../Axios/AxiosCLients';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const shine = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

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
  min-height: 100vh;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background: none;
  padding: 0;
  border-radius: 0;
  border: none;
`;

const AnimatedIcon = styled(MessageOutlined)`
  color: #5FB8B3;
  font-size: 32px;
  animation: ${shine} 2s infinite;
`;

const CoachCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 20px;
  box-shadow: 0 6px 24px rgba(95,184,179,0.10), 0 1.5px 6px rgba(44,122,117,0.08);
  background: linear-gradient(135deg, #f8fffe 0%, #e6f7f6 100%);
  border: none;
  overflow: hidden;
  transition: box-shadow 0.3s, transform 0.3s;
  &:hover {
    box-shadow: 0 12px 32px rgba(95,184,179,0.18), 0 2px 8px rgba(44,122,117,0.12);
    transform: translateY(-4px) scale(1.02);
  }
  .ant-card-body { padding: 28px 24px; }
`;

const BookingModal = styled(Modal)`
  .ant-modal-content { border-radius: 8px; }
`;

// Define coach working slots to generate selectable times
const workingSlots = [
    { start: '07:00', end: '09:00' },
    { start: '09:30', end: '11:30' },
    { start: '12:30', end: '14:30' },
    { start: '15:00', end: '17:00' },
];

const generateTimeSlots = () => {
    const slots = [];
    workingSlots.forEach(slot => {
        let currentTime = dayjs(`2000-01-01T${slot.start}`);
        const endTime = dayjs(`2000-01-01T${slot.end}`);

        while (currentTime.isBefore(endTime)) {
            slots.push(currentTime.format('HH:mm'));
            currentTime = currentTime.add(30, 'minute');
        }
    });
    return slots;
};

const timeSlots = generateTimeSlots();

const CustomTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #e6f7f6 !important;
    color: #2c7a75 !important;
    font-weight: 600;
    font-size: 16px;
    border-bottom: 1.5px solid #e6f7f6 !important;
  }
`;

const HistoryCard = styled(Card)`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(95, 184, 179, 0.1);
  border: 1px solid rgba(95, 184, 179, 0.1);
  margin-top: 32px;

  .ant-card-head {
    border-bottom: 2px solid #E3F6F5;
    margin-bottom: 20px;
  }

  .ant-table-thead > tr > th {
    background: #f0f8f7;
    color: #2c7a75;
    font-weight: 500;
    border-bottom: 2px solid #E3F6F5;
    padding: 16px;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f0f8f7;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #E3F6F5;
    padding: 16px;
    color: #666;
  }
`;

const AnimatedCoachCard = styled(CoachCard)`
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
`;

const AnimatedHistoryCard = styled(HistoryCard)`
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const StyledBookingModal = styled(BookingModal)`
  .ant-modal-content {
    border-radius: 18px;
    background: linear-gradient(135deg, #f8fffe 0%, #e6f7f6 100%);
    box-shadow: 0 8px 32px rgba(95,184,179,0.12);
    padding: 0 8px 8px 8px;
  }
  .ant-modal-header {
    border-radius: 18px 18px 0 0;
    background: #e6f7f6;
    border-bottom: none;
    padding: 24px 32px 12px 32px;
  }
  .ant-modal-title {
    color: #2c7a75;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: 0.5px;
  }
  .ant-modal-body {
    padding: 24px 32px 8px 32px;
  }
  .ant-form-item-label > label {
    color: #2c7a75;
    font-weight: 600;
    font-size: 16px;
  }
  .ant-input, .ant-picker, .ant-select-selector, textarea {
    border-radius: 10px !important;
    background: #f6fcfb !important;
    border: 1.5px solid #e3f6f5 !important;
    font-size: 16px;
    min-height: 44px;
  }
  .ant-input:focus, .ant-picker-focused, .ant-select-focused .ant-select-selector {
    border-color: #5FB8B3 !important;
    box-shadow: 0 0 0 2px #5FB8B344;
  }
  .ant-btn-primary {
    background: linear-gradient(90deg, #5FB8B3 0%, #2c7a75 100%) !important;
    border: none;
    font-weight: 700;
    font-size: 18px;
    border-radius: 12px;
    height: 48px;
    margin-top: 8px;
    box-shadow: 0 2px 8px #5FB8B344;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .ant-btn-primary:hover {
    background: linear-gradient(90deg, #2c7a75 0%, #5FB8B3 100%) !important;
    box-shadow: 0 4px 16px #5FB8B344;
  }
`;

const Consultation = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [form] = Form.useForm();
    const [coaches, setCoaches] = useState([]);
    const [coachAppointments, setCoachAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleBooking = (coach) => {
        setSelectedCoach(coach);
        setIsModalVisible(true);
    };

    const bookConsultation = async (data) => {
        return axiosClient.post('/api/consultations/request', data);
    };

    const fetchUserConsultations = async (userId) => {
        return axiosClient.get(`/api/consultations/user/${userId}`);
    };

    useEffect(() => {
        if (!userId) return;
        // Gọi ngay khi mount
        fetchUserConsultations(userId).then(res => setAppointments(res.data));

        // Polling mỗi 3 giây
        const interval = setInterval(() => {
            fetchUserConsultations(userId).then(res => setAppointments(res.data));
        }, 3000);

        return () => clearInterval(interval);
    }, [userId]);

    // Fetch danh sách coach từ API khi load trang
    useEffect(() => {
        axiosClient.get('/api/coaches/all')
            .then(res => setCoaches(res.data))
            .catch(() => setCoaches([]));
    }, []);

    // Fetch all appointments for selected coach and selected date
    useEffect(() => {
        if (isModalVisible && selectedCoach && selectedDate) {
            axiosClient.get(`/api/consultations/coach/${selectedCoach.coachId}`)
                .then(res => setCoachAppointments(res.data || []))
                .catch(() => setCoachAppointments([]));
        }
    }, [isModalVisible, selectedCoach, selectedDate]);

    // Helper to get booked time slots for selected date
    const getBookedSlots = (date) => {
        if (!date) return [];
        const dateStr = date.format('YYYY-MM-DD');
        return (coachAppointments || [])
            .filter(app => dayjs(app.scheduledTime).format('YYYY-MM-DD') === dateStr)
            .map(app => dayjs(app.scheduledTime).format('HH:mm'));
    };

    // Helper để lấy endTime lớn nhất trong ngày
    const getMaxEndTime = (date) => {
        if (!date) return null;
        const dateStr = date.format('YYYY-MM-DD');
        let maxEndTime = null;
        (coachAppointments || []).forEach(app => {
            if (dayjs(app.scheduledTime).format('YYYY-MM-DD') === dateStr && app.endTime) {
                const end = dayjs(app.endTime);
                if (!maxEndTime || end.isAfter(maxEndTime)) {
                    maxEndTime = end;
                }
            }
        });
        return maxEndTime;
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            const coachId = selectedCoach.coachId;
            const dateStr = values.date.format('YYYY-MM-DD');
            const timeStr = values.time;
            const scheduledTime = dayjs(`${dateStr}T${timeStr}`).format('YYYY-MM-DDTHH:mm');

            bookConsultation({
                userId,
                coachId,
                scheduledTime,
                notes: values.notes || ''
            })
                .then(() => {
                    message.success('Đặt lịch tư vấn thành công!');
                    setIsModalVisible(false);
                    form.resetFields();
                    fetchUserConsultations(userId).then(res => setAppointments(res.data));
                })
                .catch((err) => {
                    let errorMsg = 'Đặt lịch thất bại!';
                    if (err?.response?.data?.message) {
                        errorMsg = err.response.data.message;
                    } else if (err?.message) {
                        errorMsg = err.message;
                    }
                    message.error(errorMsg);
                });
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <PageContainer>
            <TitleRow>
                <AnimatedIcon />
                <Title level={2} style={{ margin: 0 }}>Đặt Lịch Tư Vấn</Title>
            </TitleRow>
            <Row gutter={[16, 16]}>
                {coaches.map((coach, index) => (
                    <Col xs={24} md={12} key={coach.coachId || coach.id || index}>
                        <AnimatedCoachCard delay={`${index * 0.1}s`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
                                <Avatar size={76} src={coach.profilePictureUrl} icon={<UserOutlined />} style={{ border: '3px solid #5FB8B3', background: '#fff' }} />
                                <div style={{ flex: 1 }}>
                                    <Title level={4} style={{ margin: 0, color: '#2c7a75', fontWeight: 700, letterSpacing: 0.5 }}>{coach.fullName}
                                        <Tag color="gold" style={{ marginLeft: 10, fontWeight: 600, fontSize: 15, borderRadius: 8, padding: '2px 12px' }}>Coach</Tag>
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 15 }}>{coach.specialization}</Text>
                                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Text strong>Đánh giá:</Text>
                                        {coach.rating ? (
                                            <span style={{ color: '#FFD700', fontWeight: 600, fontSize: 18 }}>
                                                {coach.rating} <span style={{ fontSize: 18, verticalAlign: 'middle' }}>★</span>
                                            </span>
                                        ) : (
                                            <span style={{ color: '#aaa', fontSize: 16 }}>Chưa có</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button type="primary" block style={{
                                background: 'linear-gradient(90deg, #5FB8B3 0%, #2c7a75 100%)',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: 17,
                                borderRadius: 12,
                                boxShadow: '0 2px 8px #5FB8B344',
                                height: 48
                            }} onClick={() => handleBooking(coach)}>
                                Đặt Lịch Tư Vấn
                            </Button>
                        </AnimatedCoachCard>
                    </Col>
                ))}
            </Row>

            <AnimatedHistoryCard title={<span style={{ fontWeight: 700, fontSize: 20, color: '#222' }}>Lịch Sử Đặt Lịch</span>}>
                <CustomTable
                    columns={[
                        { title: 'Ngày', dataIndex: 'scheduledTime', key: 'scheduledTime', render: date => dayjs(date).format('DD/MM/YYYY') },
                        { title: 'Giờ', dataIndex: 'scheduledTime', key: 'time', render: date => dayjs(date).format('HH:mm') },
                        { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
                        {
                            title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => {
                                if (status === 'completed') {
                                    return (
                                        <span style={{
                                            background: '#e6fff3',
                                            color: '#1bbf7a',
                                            fontWeight: 700,
                                            borderRadius: 12,
                                            padding: '4px 16px',
                                            fontSize: 15,
                                            boxShadow: '0 1px 4px #1bbf7a22',
                                            letterSpacing: 1
                                        }}>Đã hoàn thành</span>
                                    );
                                }
                                if (status === 'approved' || status === 'confirmed') {
                                    return (
                                        <span style={{
                                            background: '#e6fff3',
                                            color: '#1bbf7a',
                                            fontWeight: 700,
                                            borderRadius: 12,
                                            padding: '4px 16px',
                                            fontSize: 15,
                                            boxShadow: '0 1px 4px #1bbf7a22',
                                            letterSpacing: 1
                                        }}>Đã xác nhận</span>
                                    );
                                }
                                return (
                                    <span style={{
                                        background: '#fff7e6',
                                        color: '#ff9800',
                                        fontWeight: 700,
                                        borderRadius: 12,
                                        padding: '4px 16px',
                                        fontSize: 15,
                                        boxShadow: '0 1px 4px #ff980022',
                                        letterSpacing: 1
                                    }}>Chờ xác nhận</span>
                                );
                            }
                        },
                        {
                            title: 'Phòng tư vấn',
                            key: 'meetingLink',
                            render: (_, record) => {
                                const now = dayjs();
                                const endTime = record.endTime ? dayjs(record.endTime) : null;
                                const isActive = endTime && now.isBefore(endTime);
                                if (record.status === 'approved' || record.status === 'confirmed') {
                                    if (isActive) {
                                        return (
                                            <Button type="primary" onClick={() => {
                                                const uid = localStorage.getItem('userId');
                                                navigate(`/agora-room/${record.consultationId || record.id}?uid=${uid}`);
                                            }}>
                                                Tham gia
                                            </Button>
                                        );
                                    } else {
                                        return <span style={{ opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }}>Tham gia</span>;
                                    }
                                }
                                return '-';
                            }
                        }
                    ]}
                    dataSource={appointments
                        .slice()
                        .sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime))
                        .map((item, idx) => ({ ...item, key: item.consultationId || item.id || idx }))}
                    pagination={{ pageSize: 4 }}
                    style={{ borderRadius: 0 }}
                />
            </AnimatedHistoryCard>

            <StyledBookingModal
                title={selectedCoach ? `Đặt Lịch Tư Vấn với ${selectedCoach.fullName}` : 'Đặt Lịch Tư Vấn'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Xác Nhận Đặt Lịch"
                cancelText="Hủy"
            >
                {selectedCoach && (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="date"
                            label={<span>Ngày tư vấn</span>}
                            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabledDate={current => current && current < dayjs().startOf('day')}
                                onChange={date => {
                                    setSelectedDate(date);
                                    form.setFieldsValue({ time: undefined }); // Reset time khi đổi ngày
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="time"
                            label={<span>Chọn giờ tư vấn</span>}
                            rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
                        >
                            <Select placeholder="Chọn giờ tư vấn" disabled={!selectedDate}>
                                {(() => {
                                    const date = selectedDate;
                                    const booked = getBookedSlots(date);
                                    const fixedSlots = ['07:00', '09:30', '12:30', '15:00'];
                                    const now = dayjs();
                                    const isToday = date && date.isSame(now, 'day');
                                    return fixedSlots.map(slot => {
                                        const isBooked = booked.includes(slot);
                                        // Nếu là hôm nay và giờ hiện tại đã qua slot thì disable
                                        const slotTime = date ? dayjs(date.format('YYYY-MM-DD') + 'T' + slot) : null;
                                        const isPast = isToday && slotTime && now.isAfter(slotTime);
                                        return (
                                            <Option value={slot} key={slot} disabled={isBooked || isPast}>
                                                {slot} {isBooked ? '(Đã có người đặt)' : isPast ? '(Đã qua giờ)' : ''}
                                            </Option>
                                        );
                                    });
                                })()}
                            </Select>
                        </Form.Item>
                        <Form.Item name="notes" label="Ghi chú">
                            <TextArea rows={3} placeholder="Nhập thông tin về tình trạng và mục tiêu cai thuốc của bạn..." style={{ minHeight: 60 }} />
                        </Form.Item>
                    </Form>
                )}
            </StyledBookingModal>
        </PageContainer>
    );
};

export default Consultation;