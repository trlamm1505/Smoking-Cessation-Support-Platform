import React, { useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Rate, Tag, Modal, Form, DatePicker, TimePicker, Input, message, Select } from 'antd';
import { MessageOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ReviewList from './components/ReviewList';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PageContainer = styled.div`
  padding: 24px;

  .page-title {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    .anticon {
      color: #5FB8B3;
      font-size: 24px;
    }
  }
`;

const CoachCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
            availableTime: ['09:00', '10:00', '14:00', '15:00', '16:00'],
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
            availableTime: ['09:30', '10:30', '13:30', '14:30', '15:30'],
        }
    ];

    const handleBooking = (coach) => {
        setSelectedCoach(coach);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            console.log('Booking values:', values);
            message.success('Đặt lịch tư vấn thành công!');
            setIsModalVisible(false);
            form.resetFields();
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

    return (
        <PageContainer>
            <Title level={2} className="page-title">
                <CalendarOutlined />
                Đặt Lịch Tư Vấn
            </Title>

            <Row gutter={[16, 16]}>
                {coaches.map(coach => (
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

                            {/* Display Reviews */}
                            {/*
                            <div style={{ marginTop: '20px' }}>
                                <Title level={5}>Đánh giá từ người dùng:</Title>
                                <ReviewList reviews={coach.reviews} />
                            </div>
                            */}
                        </CoachCard>
                    </Col>
                ))}
            </Row>

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
                            <TimePicker
                                style={{ width: '100%' }}
                                format="HH:mm"
                                placeholder="Chọn giờ tư vấn"
                            />
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