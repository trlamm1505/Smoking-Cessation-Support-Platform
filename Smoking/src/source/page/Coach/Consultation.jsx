import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Select, message, Typography, Space, Tag, Descriptions } from 'antd';
import styled from 'styled-components';
import { ClockCircleOutlined, UserOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, PhoneOutlined, MailOutlined, LinkOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { TextArea } = Input;

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
  background-color: #e0f2f1; /* Light blue-green background */
  padding: 16px 24px; /* Add some padding */
  border-radius: 8px; /* Rounded corners */
  border: 1px solid #b2dfdb; /* Subtle border */

  .header-title {
    font-size: 24px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    gap: 12px;
  }
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
    background-color: #b2dfdb; /* Matching blue-green background for headers */
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

  // State for confirm modal
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirmConsultation, setConfirmConsultation] = useState(null);
  const [meetLink, setMeetLink] = useState('');
  const [confirmForm] = Form.useForm();

  console.log('Initial selectedDate:', selectedDate.format('YYYY-MM-DD'));

  // Mock data for consultations - structured for easy lookup by date and time slot
   const [mockConsultations, setMockConsultations] = useState({
       '2024-03-25': { // Tuesday
           'Slot 2': [
               { id: 1, memberName: 'Nguyễn Văn A', time: '09:30-11:00', notes: 'Kiểm tra tiến độ', status: 'confirmed', meetLink: 'https://meet.google.com/abc-def-ghi' }
           ]
       },
        '2024-03-28': { // Friday
            'Slot 2': [
                 { id: 2, memberName: 'Trần Thị B', time: '09:30-11:00', notes: 'Tư vấn phương pháp mới', status: 'confirmed', meetLink: 'https://meet.google.com/jkl-mno-pqr' }
            ],
            'Slot 3': [
                 { id: 3, memberName: 'Nguyễn Văn A', time: '12:30-14:00', notes: 'Thảo luận yếu tố tái nghiện', status: 'pending' }
            ]
        },
       // Add more mock data - Adding data for the current calculated week
       [dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD')]: { // Monday of current week
            'Slot 1': [
                { id: 101, memberName: 'Thành viên Test 1', time: '07:00-09:00', notes: 'Cuộc hẹn đầu tiên', status: 'pending' } // Pending for testing confirmation
            ]
       },
       [dayjs().startOf('week').add(3, 'day').format('YYYY-MM-DD')]: { // Wednesday of current week
            'Slot 3': [
                { id: 102, memberName: 'Thành viên Test 2', time: '12:30-14:00', notes: 'Theo dõi tiến độ', status: 'pending' }
            ]
       }
   });

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
    const startOfWeek = dayjs(selectedDate).startOf('week'); // dayjs week starts on Sunday by default
    const startOfWeekMonday = dayjs(startOfWeek).add(1, 'day'); // Adjust to start on Monday

    // Get dates for the current week
    const weekDates = Array.from({ length: 7 }).map((_, i) =>
        dayjs(startOfWeekMonday).add(i, 'day').format('YYYY-MM-DD')
    );

    console.log('Calculated weekDates:', weekDates);

    // Get the current year and week number based on selectedDate
    const currentYear = selectedDate.year();
    const currentWeek = selectedDate.week();

    // Options for Year and Week dropdowns (simplified mock)
     // Generate year options around the current year
     const yearOptions = [-2, -1, 0, 1, 2].map(offset => {
         const year = dayjs().year() + offset;
         return { value: year, label: year };
     });

     // Generate week options for the current year
     const weeksInYear = dayjs(currentYear + '-12-28').week(); // Alternative way to get weeks in year
      const weekOptions = Array.from({ length: weeksInYear }).map((_, i) => {
          const week = i + 1;
          const startOfWeek = dayjs().year(currentYear).week(week).startOf('week').add(1, 'day'); // Adjust to Monday
          const endOfWeek = dayjs(startOfWeek).add(6, 'day');
          return {
              value: week,
              label: `Tuần ${week}: ${startOfWeek.format('DD/MM')} - ${endOfWeek.format('DD/MM')}`
          };
      });

    const handleYearChange = (year) => {
        console.log('handleYearChange - New year:', year);
        // Set the date to the first week of the selected year
        setSelectedDate(dayjs().year(year).startOf('year').startOf('week').add(1, 'day')); // First day of the first week, adjusted to Monday
    };

    const handleWeekChange = (week) => {
         console.log('handleWeekChange - New week:', week);
        // Set the date to the first day of the selected week in the current year
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

   // --- New functions for confirmation ---
   const handleOpenConfirmModal = (consultation) => {
       setConfirmConsultation(consultation);
       setMeetLink(''); // Reset link input
       setIsConfirmModalVisible(true);
   };

   const handleSaveConfirmation = (values) => {
       if (!confirmConsultation) return;

       const updatedMockConsultations = { ...mockConsultations };

       // Find the correct date key
       const consultationDate = weekDates.find(date => {
           const consultationsOnDate = mockConsultations[date] || {};
           return Object.values(consultationsOnDate).flat().some(c => c.id === confirmConsultation.id);
       });

       if (consultationDate) {
           const updatedDateConsultations = { ...updatedMockConsultations[consultationDate] };
           Object.keys(updatedDateConsultations).forEach(slotKey => {
               updatedDateConsultations[slotKey] = updatedDateConsultations[slotKey].map(c => {
                   if (c.id === confirmConsultation.id) {
                       return { ...c, status: 'confirmed', meetLink: values.meetLink };
                   }
                   return c;
               });
           });
            updatedMockConsultations[consultationDate] = updatedDateConsultations;
            setMockConsultations(updatedMockConsultations);
            message.success('Đã xác nhận cuộc hẹn và lưu link.');
       }

       setIsConfirmModalVisible(false);
       setConfirmConsultation(null);
       setMeetLink('');
       confirmForm.resetFields();
   };

   const handleCancelConfirmModal = () => {
       setIsConfirmModalVisible(false);
       setConfirmConsultation(null);
       setMeetLink('');
       confirmForm.resetFields();
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
      <GuestHeader>
        <div className="header-title">
          <TrophyOutlined />
          Lịch Tư Vấn
        </div>
      </GuestHeader>

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
                console.log(`Checking consultations for date: ${date}`);
                const consultationsOnDate = mockConsultations[date] || {};
                console.log(`Consultations found for ${date}:`, consultationsOnDate);
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
                             <Space size={4} style={{ marginTop: '4px' }}>
                                 <FileTextOutlined style={{ fontSize: '12px' }} />
                                  <Text style={{ fontSize: '12px' }}>{consultation.notes}</Text>
                             </Space><br/>
                              <div style={{ marginTop: '4px' }}>
                                {renderConsultationStatus(consultation.status)}
                              </div>
                              {/* Add buttons for actions */}
                               <Space size={4} style={{ marginTop: '8px' }}>
                                  {consultation.status === 'pending' && (
                                      <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleOpenConfirmModal(consultation)}>
                                         Xác nhận
                                      </Button>
                                  )}
                                   {consultation.status === 'confirmed' && (
                                       <Button size="small" icon={<CloseCircleOutlined />} danger >
                                          Hủy
                                       </Button>
                                   )}
                                    <Button size="small" onClick={() => handleOpenFeedbackModal(consultation)}>
                                         Đánh giá
                                    </Button>
                                     {/* Display meet link if available and confirmed */}
                                     {consultation.status === 'confirmed' && consultation.meetLink && (
                                         <Button size="small" icon={<LinkOutlined />} href={consultation.meetLink} target="_blank">
                                             Link Meet
                                         </Button>
                                     )}
                               </Space>
                         </ConsultationEntry>
                      ))
                    ) : (
                      '' // Empty cell if no consultations
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
           title="Gửi đánh giá"
           open={isFeedbackModalVisible}
           onCancel={() => setIsFeedbackModalVisible(false)}
           footer={null}
       >
           <Form
               form={feedbackForm}
               layout="vertical"
               onFinish={handleSaveFeedback}
           >
               <Form.Item
                   name="feedback"
                   label="Nội dung đánh giá"
                   rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]}
               >
                   <Input.TextArea rows={4} placeholder="Nhập đánh giá của bạn về cuộc tư vấn..." />
               </Form.Item>
               <Form.Item>
                   <Button type="primary" htmlType="submit">
                       Lưu đánh giá
                   </Button>
               </Form.Item>
           </Form>
       </Modal>

        {/* Confirm Modal */}
        <Modal
            title="Xác nhận cuộc hẹn và thêm Link Meet"
            open={isConfirmModalVisible}
            onCancel={handleCancelConfirmModal}
            footer={null}
        >
            <Form
                form={confirmForm}
                layout="vertical"
                onFinish={handleSaveConfirmation}
            >
                <Form.Item
                    name="meetLink"
                    label="Link Google Meet"
                    rules={[
                        { required: true, message: 'Vui lòng nhập link Google Meet' },
                        { type: 'url', message: 'Vui lòng nhập đúng định dạng URL' }
                    ]}
                >
                    <Input placeholder="Dán link Google Meet vào đây..." />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button onClick={handleCancelConfirmModal}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Lưu và Xác nhận
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>

    </Container>
  );
};

export default TimeConsultation; 