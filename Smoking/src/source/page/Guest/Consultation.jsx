import React, { useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Modal, Form, DatePicker, Select, Input, message, Table } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import dayjs from 'dayjs';

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
  width: 100%;
  flex: 1;
  box-sizing: border-box;
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
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  background: white;
  border: none;
  overflow: hidden;
  .ant-card-body { padding: 20px; }
`;

const BookingModal = styled(Modal)`
  .ant-modal-content { border-radius: 8px; }
`;

const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
];



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

const Consultation = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [form] = Form.useForm();

    // Helper function to get meeting link from either meetingLink or meetLink field
    const getMeetingLink = (record) => {
        return record.meetingLink || record.meetLink || null;
    };

    const handleBooking = (coach) => {
        setSelectedCoach(coach);
        setIsModalVisible(true);
    };

    // Hàm cập nhật trạng thái cuộc hẹn
    const updateAppointmentStatus = (appointmentId, status, meetLink = null) => {
        setAppointments(prev => prev.map(appointment =>
            appointment.id === appointmentId
                ? { ...appointment, status, meetLink }
                : appointment
        ));
    };

    // Mô phỏng coach xác nhận sau 2s
    const simulateCoachConfirmation = (appointmentId) => {
        setTimeout(() => {
            updateAppointmentStatus(appointmentId, 'confirmed', 'https://meet.google.com/abc-def-ghi');
            message.success('Coach đã xác nhận lịch hẹn của bạn!');
        }, 2000);
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            const newAppointment = {
                id: appointments.length + 1,
                coachName: selectedCoach.name,
                date: values.date.format('YYYY-MM-DD'),
                time: values.time,
                notes: values.notes || '',
                status: 'pending',
                meetLink: null
            };
            setAppointments(prev => [...prev, newAppointment]);
            message.success('Đặt lịch tư vấn thành công!');
            setIsModalVisible(false);
            form.resetFields();
            simulateCoachConfirmation(newAppointment.id);
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
                    <Col xs={24} md={12} key={coach.id}>
                        <AnimatedCoachCard delay={`${index * 0.1}s`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                                <Avatar size={64} src={coach.avatar} icon={<UserOutlined />} />
                                <div style={{ flex: 1 }}>
                                    <Title level={4} style={{ margin: 0 }}>{coach.name}</Title>
                                    <Text type="secondary">{coach.title}</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text strong>Kinh nghiệm:</Text> {coach.experience} | <Text strong>Đánh giá:</Text> {coach.rating} ⭐
                                    </div>
                                </div>
                            </div>
                            <Button type="primary" block onClick={() => handleBooking(coach)}>
                                Đặt Lịch Tư Vấn
                            </Button>
                        </AnimatedCoachCard>
                    </Col>
                ))}
            </Row>

            <AnimatedHistoryCard title={<span style={{ fontWeight: 700, fontSize: 20, color: '#222' }}>Lịch Sử Đặt Lịch</span>}>
                <CustomTable
                    columns={[
                        { title: 'Tên huấn luyện viên', dataIndex: 'coachName', key: 'coachName' },
                        { title: 'Ngày', dataIndex: 'date', key: 'date', render: date => dayjs(date).format('DD/MM/YYYY') },
                        { title: 'Giờ', dataIndex: 'time', key: 'time' },
                        { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
                        { 
                            title: 'Trạng thái', 
                            dataIndex: 'status', 
                            key: 'status', 
                            render: status =>
                                status === 'approved' || status === 'confirmed'
                                    ? 'Đã xác nhận'
                                    : 'Chờ xác nhận'
                        },
                        { 
                            title: 'Link Google Meet', 
                            key: 'meetingLink', 
                            render: (_, record) => {
                                const link = getMeetingLink(record);
                                return link && (record.status === 'approved' || record.status === 'confirmed') ? 
                                    <a href={link} target="_blank" rel="noopener noreferrer">Tham gia</a> : 
                                    '-';
                            }
                        }
                    ]}
                    dataSource={appointments.map((item, idx) => ({ ...item, key: idx }))}
                    pagination={false}
                    style={{ borderRadius: 0 }}
                />
            </AnimatedHistoryCard>

            <BookingModal
                title={selectedCoach ? `Đặt Lịch Tư Vấn với ${selectedCoach.name}` : 'Đặt Lịch Tư Vấn'}
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
                            label="Ngày tư vấn"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} disabledDate={current => current && current < dayjs().startOf('day')} />
                        </Form.Item>
                        <Form.Item
                            name="time"
                            label="Chọn giờ tư vấn"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
                        >
                            <Select placeholder="Chọn giờ tư vấn">
                                {timeSlots.map(slot => (
                                    <Option value={slot} key={slot}>{slot}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="notes" label="Ghi chú">
                            <TextArea rows={3} placeholder="Nhập thông tin về tình trạng và mục tiêu cai thuốc của bạn..." />
                        </Form.Item>
                    </Form>
                )}
            </BookingModal>
        </PageContainer>
    );
};

export default Consultation;