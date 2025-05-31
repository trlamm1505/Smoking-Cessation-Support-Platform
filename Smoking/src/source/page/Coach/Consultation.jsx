import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Select, message, Typography, Space, Tag, Descriptions } from 'antd';
import styled from 'styled-components';
import { ClockCircleOutlined, UserOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);

const { Title, Text } = Typography;

const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow-x: auto; /* Add horizontal scroll for small screens */
`;

const GuestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TimeTableControls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
`;

const TimeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e0e0e0;

  th,
  td {
    border: 1px solid #e0e0e0;
    padding: 12px;
    text-align: center;
    vertical-align: top;
    min-width: 120px; /* Minimum width for day columns */
  }

  th {
    background-color: #e6f7ff; /* Light blue background for headers */
    font-weight: bold;
  }

  td {
    background-color: #ffffff; /* White background for data cells */
  }

  tr:nth-child(even) td {
      background-color: #f9f9f9; /* Slightly different background for even rows */
  }
`;

const SlotLabel = styled.div`
    font-weight: bold;
    margin-bottom: 8px;
`;

const ConsultationEntry = styled.div`
    background-color: #d6e4ff; /* Light background for entry */
    border: 1px solid #91caff;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 8px;
    text-align: left;
    font-size: 12px;
    word-break: break-word;
`;

const TimeConsultation = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to today
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [feedbackForm] = Form.useForm();

  // Mock data for consultations - structured for easy lookup by date and time slot
   const mockConsultations = {
       '2024-03-25': { // Tuesday
           'Slot 2': [
               { id: 1, memberName: 'Nguyễn Văn A', time: '09:30-11:00', notes: 'Kiểm tra tiến độ', status: 'confirmed' }
           ]
       },
        '2024-03-28': { // Friday
            'Slot 2': [
                 { id: 2, memberName: 'Trần Thị B', time: '09:30-11:00', notes: 'Tư vấn phương pháp mới', status: 'confirmed' }
            ],
            'Slot 3': [
                 { id: 3, memberName: 'Nguyễn Văn A', time: '12:30-14:00', notes: 'Thảo luận yếu tố tái nghiện', status: 'pending' }
            ]
        }
       // Add more mock data
   };

    // Define time slots - adjust as needed
    const timeSlots = [
        { key: 'Slot 1', time: '07:00 - 09:00' },
        { key: 'Slot 2', time: '09:30 - 11:30' },
        { key: 'Slot 3', time: '12:30 - 14:30' },
        { key: 'Slot 4', time: '15:00 - 17:00' },
        // Add more slots
    ];

    const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    // Get the start date of the week based on selectedDate
    const startOfWeek = selectedDate.startOf('week'); // dayjs week starts on Sunday by default
    const startOfWeekMonday = dayjs(startOfWeek).add(1, 'day'); // Adjust to start on Monday

    // Get dates for the current week
    const weekDates = Array.from({ length: 7 }).map((_, i) =>
        dayjs(startOfWeekMonday).add(i, 'day').format('YYYY-MM-DD')
    );

    // Get the current year and week number
    const currentYear = selectedDate.year();
    const currentWeek = selectedDate.week();

    // Options for Year and Week dropdowns (simplified mock)
    const yearOptions = [{ value: currentYear, label: currentYear }];
    const weekOptions = [
        { value: currentWeek, label: `Tuần ${currentWeek}: ${startOfWeekMonday.format('DD/MM')} - ${dayjs(startOfWeekMonday).add(6, 'day').format('DD/MM')}` },
         { value: currentWeek - 1, label: `Tuần ${currentWeek - 1}: ${dayjs(startOfWeekMonday).subtract(7, 'day').format('DD/MM')} - ${dayjs(startOfWeekMonday).subtract(1, 'day').format('DD/MM')}` },
         { value: currentWeek + 1, label: `Tuần ${currentWeek + 1}: ${dayjs(startOfWeekMonday).add(7, 'day').format('DD/MM')} - ${dayjs(startOfWeekMonday).add(13, 'day').format('DD/MM')}` },
        // Add more week options based on the year
    ];

    const handleYearChange = (year) => {
        // Update selectedDate to the first day of the first week of the new year
        setSelectedDate(dayjs(`${year}-01-01`));
    };

    const handleWeekChange = (week) => {
        // Update selectedDate to the first day of the selected week in the current year
        setSelectedDate(dayjs().year(currentYear).week(week).startOf('week').add(1, 'day')); // Adjust to start Monday
    };


  const handleViewPost = (post) => {
    console.log('View post:', post.id);
    // TODO: Implement view logic (e.g., navigate to a view page or show in a modal)
    message.info(`Xem bài viết: ${post.title} (Chức năng đang phát triển)`);
  };


  const handleOpenFeedbackModal = (consultation) => {
    setSelectedConsultation(consultation);
    // feedbackForm.setFieldsValue({ feedback: consultation.feedback }); // Need to add feedback to mock data
    setIsFeedbackModalVisible(true);
  };

  const handleSaveFeedback = (values) => {
    // TODO: Implement API call to save feedback
    console.log('Saving feedback for', selectedConsultation.id, ':', values);
     // Update consultation status/feedback in state/via API
    message.success('Đã lưu đánh giá');
    setIsFeedbackModalVisible(false);
    setSelectedConsultation(null);
    feedbackForm.resetFields();
  };



  const renderConsultationStatus = (status) => {
    const statusText = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      completed: 'Đã hoàn thành',
      cancelled: 'Đã hủy',
    };
     const statusColor = {
      pending: 'orange',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return <Tag color={statusColor[status]}>{statusText[status]}</Tag>;
  };


  return (
    <Container>
      <Header>
        <Title level={2}>Lịch tư vấn</Title>
        {/* <Button type="primary" icon={<ClockCircleOutlined />} onClick={() => setIsAddModalVisible(true)}> */}
        {/*   Thêm lịch tư vấn */}
        {/* </Button> */}
      </Header>

      <TimeTableControls>
        <Space>
            <Text strong>NĂM:</Text>
             <Select
                value={currentYear}
                 onChange={handleYearChange}
                options={yearOptions}
                style={{ width: 120 }}
             />
        </Space>
         <Space>
            <Text strong>TUẦN:</Text>
             <Select
                value={currentWeek}
                 onChange={handleWeekChange}
                options={weekOptions}
                style={{ width: 250 }}
             />
         </Space>
      </TimeTableControls>

      <TimeTable>
        <thead>
          <tr>
            <th></th> {/* Corner cell */}
            {daysOfWeek.map((day, index) => (
              <th key={day}>
                {day}<br/>{dayjs(startOfWeekMonday).add(index, 'day').format('DD/MM')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(slot => (
            <tr key={slot.key}>
              <td><SlotLabel>{slot.key}</SlotLabel>{slot.time}</td>
              {weekDates.map(date => {
                const consultationsOnDate = mockConsultations[date] || {};
                const consultationsInSlot = consultationsOnDate[slot.key] || [];
                return (
                  <td key={date}>
                    {consultationsInSlot.length > 0 ? (
                      consultationsInSlot.map(consultation => (
                         <ConsultationEntry key={consultation.id}>
                             <Text strong>{consultation.memberName}</Text><br/>
                              <Space size={4}>
                                <ClockCircleOutlined style={{ fontSize: '12px' }} />
                                <Text type="secondary" style={{ fontSize: '12px' }}>{consultation.time}</Text>
                              </Space><br/>
                             {renderConsultationStatus(consultation.status)}<br/>
                             {/* Add actions like View Details, Complete, etc. */}
                              <Button type="link" size="small" onClick={() => handleOpenFeedbackModal(consultation)}>
                                 Xem/Thêm đánh giá
                              </Button>
                         </ConsultationEntry>
                      ))
                    ) : (
                      <Text type="secondary">-</Text>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </TimeTable>

      {/* Feedback Modal */}
      <Modal
        title={selectedConsultation ? `Đánh giá buổi tư vấn với ${selectedConsultation.memberName}` : 'Đánh giá buổi tư vấn'}
        open={isFeedbackModalVisible}
        onCancel={() => {
          setIsFeedbackModalVisible(false);
          setSelectedConsultation(null);
          feedbackForm.resetFields();
        }}
        onOk={() => feedbackForm.submit()}
        okText="Lưu đánh giá"
        cancelText="Hủy"
      >
        <Form
          form={feedbackForm}
          layout="vertical"
          onFinish={handleSaveFeedback}
        >
          <Form.Item
            name="feedback"
            label="Nội dung đánh giá"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]} /* Added required rule */
          >
            <Input.TextArea rows={6} placeholder="Nhập đánh giá của bạn về buổi tư vấn và tình hình của thành viên..." />
          </Form.Item>
        </Form>
      </Modal>

    </Container>
  );
};

export default TimeConsultation; 