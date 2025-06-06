import React, { useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Rate, Tag, Modal, Form, DatePicker, TimePicker, Input, message, Select } from 'antd';
import { MessageOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PageContainer = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%);
  min-height: 100vh;

  .page-title {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    background: none;
    padding: 0;
    border-radius: 0;
    border: none;
    
    .anticon {
      color: #5FB8B3;
      font-size: 28px;
      animation: shine 2s infinite;
    }
    @keyframes shine {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    h1, .ant-typography {
      font-size: 32px;
      font-weight: 600;
      color: #222;
      margin: 0;
      text-transform: none;
    }
  }
`;

const CoachCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  background: white;
  border: none;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(95, 184, 179, 0.12);
  }

  .ant-card-body {
    padding: 20px;
  }

  .coach-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    .coach-info {
      flex: 1;
    }

    .coach-name {
      margin: 0;
      color: #333;
      font-size: 18px;
    }

    .coach-title {
      color: #666;
      font-size: 14px;
    }
  }

  .coach-stats {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;

    .stat-item {
      text-align: center;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 6px;
      flex: 1;

      .stat-value {
        font-size: 18px;
        font-weight: 500;
        color: #5FB8B3;
      }

      .stat-label {
        font-size: 12px;
        color: #666;
      }
    }
  }

  .coach-tags {
    margin-bottom: 16px;
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .coach-actions {
    display: flex;
    gap: 8px;
  }

  .appointment-status {
    margin-top: 16px;
    padding: 12px;
    border-radius: 8px;
    background: #f0f8f7;
    border: 1px solid #E3F6F5;

    .status-title {
      font-weight: 600;
      color: #2c7a75;
      margin-bottom: 8px;
    }

    .status-details {
      color: #666;
      font-size: 14px;
    }

    .meet-link {
      margin-top: 8px;
      color: #5FB8B3;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;

const BookingModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }

  .booking-form {
    .ant-form-item {
      margin-bottom: 16px;
    }
  }
`;

const Consultation = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [form] = Form.useForm();

    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [reviewForm] = Form.useForm();
    const [coachToReview, setCoachToReview] = useState(null);

    // Mock data cho danh sách huấn luyện viên
    const coaches = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            title: 'Chuyên gia tư vấn cai thuốc lá',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
            rating: 4.8,
            experience: '5 năm',
            consultations: 120,
            successRate: '92%',
            specialties: ['Tư vấn tâm lý', 'Liệu pháp thay thế', 'Quản lý stress'],
            availability: true,
            availableTime: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
        },
        {
            id: 2,
            name: 'Trần Thị B',
            title: 'Chuyên gia tâm lý học',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
            rating: 4.9,
            experience: '7 năm',
            consultations: 200,
            successRate: '95%',
            specialties: ['CBT Therapy', 'Meditation', 'Cai nghiện'],
            availability: true,
            availableTime: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
        }
    ];

    // Mock data cho lịch hẹn của người dùng
    const [userAppointments, setUserAppointments] = useState([
        {
            id: 1,
            coachName: 'Huấn luyện viên A',
            date: dayjs().format('YYYY-MM-DD'), // Confirmed for today
            time: '10:00 - 11:00',
            status: 'confirmed',
            meetLink: 'https://meet.google.com/example-link-today',
        },
        {
            id: 2,
            coachName: 'Huấn luyện viên B',
            date: dayjs().add(2, 'day').format('YYYY-MM-DD'), // Pending in 2 days
            time: '14:00 - 15:00',
            status: 'pending',
            meetLink: null,
        }
    ]);

    const handleBooking = (coach) => {
        setSelectedCoach(coach);
        setIsModalVisible(true);
    };

    // Function to update appointment status
    const updateAppointmentStatus = (appointmentId, status, meetLink = null) => {
        setUserAppointments(prev => prev.map(appointment =>
            appointment.id === appointmentId
                ? { ...appointment, status, meetLink }
                : appointment
        ));
    };

    // Simulate coach confirmation (this would normally come from an API call)
    const simulateCoachConfirmation = (appointmentId) => {
        // Simulate coach confirming after 2 seconds
        setTimeout(() => {
            updateAppointmentStatus(appointmentId, 'confirmed', 'https://meet.google.com/abc-def-ghi');
            message.success('Coach đã xác nhận lịch hẹn của bạn!');
        }, 2000);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            console.log('Booking values:', values);

            // Add new appointment to userAppointments
            const newAppointment = {
                id: userAppointments.length + 1,
                coachName: selectedCoach.name,
                date: values.date.format('YYYY-MM-DD'),
                time: values.time.format('HH:mm'),
                status: 'pending',
                meetLink: null,
                topic: values.topic,
                notes: values.notes
            };

            setUserAppointments(prev => [...prev, newAppointment]);
            message.success('Đặt lịch tư vấn thành công!');
            setIsModalVisible(false);
            form.resetFields();

            // Simulate coach confirmation
            simulateCoachConfirmation(newAppointment.id);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleReviewClick = (coach) => {
        setCoachToReview(coach);
        setIsReviewModalVisible(true);
    };

    const handleReviewModalOk = () => {
        reviewForm.validateFields().then((values) => {
            console.log('Review values:', coachToReview.id, values);
            message.success('Đã gửi đánh giá thành công!');
            setIsReviewModalVisible(false);
            reviewForm.resetFields();
            setCoachToReview(null);
        });
    };

    const handleReviewModalCancel = () => {
        setIsReviewModalVisible(false);
        reviewForm.resetFields();
        setCoachToReview(null);
    };

    const disabledDate = (current) => {
        return current && current < new Date().setHours(0, 0, 0, 0);
    };

    // Check for confirmed appointment today
    const hasConfirmedAppointmentToday = userAppointments.some(appointment =>
        appointment.status === 'confirmed' && dayjs(appointment.date).isSame(dayjs(), 'day')
    );

    return (
        <PageContainer>
            <div className="page-title">
                <MessageOutlined />
                <Title level={1} style={{ margin: 0 }}>Đặt Lịch Tư Vấn</Title>
            </div>

            <Row gutter={[16, 16]}>
                {coaches.map(coach => {
                    // Find if this coach has any appointments
                    const coachAppointments = userAppointments.filter(
                        appointment => appointment.coachName === coach.name
                    );
                    const latestAppointment = coachAppointments[coachAppointments.length - 1];

                    return (
                        <Col xs={24} md={12} key={coach.id}>
                            <CoachCard>
                                <div className="coach-header">
                                    <Avatar size={64} src={coach.avatar} />
                                    <div className="coach-info">
                                        <Title level={4} className="coach-name">{coach.name}</Title>
                                        <Text className="coach-title">{coach.title}</Text>
                                        <div>
                                            <Rate disabled defaultValue={coach.rating} style={{ fontSize: 14 }} />
                                            <Text style={{ marginLeft: 8 }}>{coach.rating}</Text>
                                        </div>
                                    </div>
                                </div>

                                <div className="coach-stats">
                                    <div className="stat-item">
                                        <div className="stat-value">{coach.experience}</div>
                                        <div className="stat-label">Kinh nghiệm</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{coach.consultations}</div>
                                        <div className="stat-label">Buổi tư vấn</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{coach.successRate}</div>
                                        <div className="stat-label">Tỷ lệ thành công</div>
                                    </div>
                                </div>

                                <div className="coach-tags">
                                    {coach.specialties.map((specialty, index) => (
                                        <Tag key={index} color="blue">{specialty}</Tag>
                                    ))}
                                </div>

                                <div className="coach-actions">
                                    <Button
                                        type="primary"
                                        icon={<CalendarOutlined />}
                                        onClick={() => handleBooking(coach)}
                                        block
                                    >
                                        Đặt Lịch Tư Vấn
                                    </Button>
                                    <Button onClick={() => handleReviewClick(coach)}>
                                        Đánh giá
                                    </Button>
                                </div>

                                {latestAppointment && (
                                    <div className="appointment-status">
                                        <div className="status-title">
                                            {latestAppointment.status === 'confirmed' ? '✅ Lịch hẹn đã xác nhận' : '⏳ Đang chờ xác nhận'}
                                        </div>
                                        <div className="status-details">
                                            <div>Ngày: {dayjs(latestAppointment.date).format('DD/MM/YYYY')}</div>
                                            <div>Giờ: {latestAppointment.time}</div>
                                            {latestAppointment.topic && (
                                                <div>Chủ đề: {
                                                    {
                                                        'quit_plan': 'Lập kế hoạch cai thuốc',
                                                        'withdrawal': 'Đối phó với cai nghiện',
                                                        'motivation': 'Duy trì động lực',
                                                        'relapse': 'Phòng ngừa tái nghiện',
                                                        'health': 'Tư vấn sức khỏe'
                                                    }[latestAppointment.topic]
                                                }</div>
                                            )}
                                        </div>
                                        {latestAppointment.status === 'confirmed' && latestAppointment.meetLink && (
                                            <div className="meet-link" onClick={() => window.open(latestAppointment.meetLink, '_blank')}>
                                                <CalendarOutlined /> Tham gia Google Meet
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CoachCard>
                        </Col>
                    );
                })}
            </Row>

            {hasConfirmedAppointmentToday && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Tag color="blue" style={{ fontSize: '16px', padding: '8px 16px' }}>
                        Bạn có lịch hẹn tư vấn đã xác nhận hôm nay!
                    </Tag>
                </div>
            )}

            <BookingModal
                title="Đặt Lịch Tư Vấn"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Xác Nhận Đặt Lịch"
                cancelText="Hủy"
            >
                {selectedCoach && (
                    <Form form={form} layout="vertical" className="booking-form">
                        <Form.Item
                            name="date"
                            label="Ngày tư vấn"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabledDate={disabledDate}
                                onChange={(date) => setSelectedDate(date)}
                                placeholder="Chọn ngày tư vấn"
                            />
                        </Form.Item>

                        <Form.Item
                            name="time"
                            label="Chọn giờ tư vấn"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Chọn giờ tư vấn"
                                disabled={!selectedCoach}
                            >
                                {selectedCoach && selectedCoach.availableTime.map((time, idx) => (
                                    <Option key={time + idx} value={time}>{time}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="topic"
                            label="Chủ đề tư vấn"
                            rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}
                        >
                            <Select placeholder="Chọn chủ đề tư vấn">
                                <Option value="quit_plan">Lập kế hoạch cai thuốc</Option>
                                <Option value="withdrawal">Đối phó với cai nghiện</Option>
                                <Option value="motivation">Duy trì động lực</Option>
                                <Option value="relapse">Phòng ngừa tái nghiện</Option>
                                <Option value="health">Tư vấn sức khỏe</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="notes"
                            label="Ghi chú"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Nhập thông tin về tình trạng và mục tiêu cai thuốc của bạn..."
                            />
                        </Form.Item>
                    </Form>
                )}
            </BookingModal>

            <Modal
                title={coachToReview ? `Đánh giá ${coachToReview.name}` : 'Gửi Đánh Giá'}
                visible={isReviewModalVisible}
                onOk={handleReviewModalOk}
                onCancel={handleReviewModalCancel}
                okText="Gửi đánh giá"
                cancelText="Hủy"
            >
                <Form
                    form={reviewForm}
                    layout="vertical"
                    name="review_form"
                >
                    <Form.Item
                        name="rating"
                        label="Số sao"
                        rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        name="comment"
                        label="Nội dung đánh giá"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </PageContainer>
    );
};

export default Consultation; 