import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Select, message, Typography, Space, Tag, Descriptions, Table } from 'antd';
import styled from 'styled-components';
import { ClockCircleOutlined, UserOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, PhoneOutlined, MailOutlined, LinkOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import axiosClient from '../Axios/AxiosCLients';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

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

  const [consultations, setConsultations] = useState([]);
  const [meetLinks, setMeetLinks] = useState({});
  const coachId = localStorage.getItem('coachId');
  const userId = localStorage.getItem('userId'); // Fallback to userId if coachId not available

  useEffect(() => {
    const idToUse = coachId || userId;
    if (idToUse) {
      console.log('Fetching consultations for ID:', idToUse, 'Type:', coachId ? 'coachId' : 'userId');
      axiosClient.get(`/api/consultations/coach/${idToUse}`)
        .then(res => {
          console.log('API response:', res.data);
          setConsultations(res.data);
        })
        .catch((err) => {
          console.error('Error fetching consultations:', err);
          setConsultations([]);
        });
    } else {
      console.log('No coachId or userId found in localStorage');
      console.log('Available localStorage items:', {
        coachId: localStorage.getItem('coachId'),
        userId: localStorage.getItem('userId'),
        userRole: localStorage.getItem('userRole'),
        token: localStorage.getItem('token')
      });
    }
  }, [coachId, userId]);

  console.log('Initial selectedDate:', selectedDate.format('YYYY-MM-DD'));

  // Hàm xác định slot dựa vào giờ
  const getSlotFromTime = (isoString) => {
    const hour = dayjs(isoString).hour();
    const minute = dayjs(isoString).minute();
    const time = hour * 60 + minute;
    if (time >= 420 && time < 540) return 'Slot 1'; // 07:00-09:00
    if (time >= 570 && time < 690) return 'Slot 2'; // 09:30-11:30
    if (time >= 750 && time < 870) return 'Slot 3'; // 12:30-14:30
    if (time >= 900 && time < 1020) return 'Slot 4'; // 15:00-17:00
    return null;
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
  const startOfWeek = dayjs(selectedDate).startOf('week'); // dayjs week starts on Sunday by default
  const startOfWeekMonday = dayjs(startOfWeek).add(1, 'day'); // Adjust to start on Monday

  // Get dates for the current week
  const weekDates = Array.from({ length: 7 }).map((_, i) =>
      dayjs(startOfWeekMonday).add(i, 'day').format('YYYY-MM-DD')
  );

  console.log('Calculated weekDates:', weekDates);

  // Get the current year and week number based on selectedDate
  const currentYear = selectedDate.year();
  const currentWeek = selectedDate.isoWeek();

  // Generate week options for the selected year
  const getWeeksInYear = (year) => {
    // ISO week: tuần cuối cùng luôn chứa ngày 28/12
    return dayjs(`${year}-12-28`).isoWeek();
  };
  const weekOptions = Array.from({ length: getWeeksInYear(currentYear) }).map((_, i) => {
    const week = i + 1;
    const startOfWeek = dayjs().year(currentYear).isoWeek(week).startOf('week').add(1, 'day'); // Thứ Hai
    const endOfWeek = dayjs(startOfWeek).add(6, 'day');
    return {
      value: week,
      label: `Tuần ${week}: ${startOfWeek.format('DD/MM')} - ${endOfWeek.format('DD/MM')}`
    };
  });

  const yearOptions = [-2, -1, 0, 1, 2].map(offset => {
    const year = dayjs().year() + offset;
    return { value: year, label: year };
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

  // Chuyển đổi consultations thành object theo ngày/slot
  const timetable = {};
  const outOfSlotAppointments = [];

  console.log('Processing consultations:', consultations);
  console.log('Current weekDates:', weekDates);

  consultations.forEach(c => {
    const date = dayjs(c.scheduledTime).format('YYYY-MM-DD');
    console.log('Processing consultation:', {
      id: c.consultationId || c.id,
      scheduledTime: c.scheduledTime,
      date: date,
      memberName: c.memberName,
      isInWeek: weekDates.includes(date)
    });

    if (weekDates.includes(date)) {
      const slot = getSlotFromTime(c.scheduledTime);
      console.log('Slot for consultation:', slot);
      if (slot) {
        if (!timetable[date]) timetable[date] = {};
        if (!timetable[date][slot]) timetable[date][slot] = [];
        timetable[date][slot].push(c);
        console.log('Added to timetable:', date, slot);
      } else {
        outOfSlotAppointments.push(c);
        console.log('Added to out of slot:', c);
      }
    } else {
      console.log('Consultation not in current week:', date);
    }
  });

  console.log('Final timetable:', timetable);
  console.log('Final out of slot:', outOfSlotAppointments);

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
       confirmForm.setFieldsValue({ meetLink: '' }); // Clear field
       setIsConfirmModalVisible(true);
   };

   const handleSaveConfirmation = (values) => {
       if (!confirmConsultation) return;

       // Use both possible id fields
       const consultationId = confirmConsultation.consultationId || confirmConsultation.id;
       const { meetLink } = values;

       console.log('Xác nhận:', { consultationId, meetLink, confirmConsultation });

       axiosClient.put(`/api/consultations/${consultationId}/approve`, {}, { params: { meetingLink: meetLink } })
         .then(() => {
           message.success('Đã xác nhận và gửi link thành công!');
           // Cập nhật lại danh sách appointments
           const idToUse = coachId || userId;
           if (idToUse) {
             axiosClient.get(`/api/consultations/coach/${idToUse}`)
               .then(res => setConsultations(res.data));
           }
           setIsConfirmModalVisible(false);
           confirmForm.resetFields();
         })
         .catch((err) => {
           console.error('Lỗi khi xác nhận:', err);
           message.error('Xác nhận thất bại, vui lòng thử lại.');
         });
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

const handleApprove = (consultationId) => {
  const link = meetLinks[consultationId];
  if (!link) {
    message.error('Vui lòng nhập link Meet!');
    return;
  }
  axiosClient.put(`/api/consultations/${consultationId}/approve`, {}, { params: { meetingLink: link } })
    .then(() => {
      message.success('Xác nhận thành công!');
      // Fetch lại danh sách
      const idToUse = coachId || userId;
      return axiosClient.get(`/api/consultations/coach/${idToUse}`);
    })
    .then(res => setConsultations(res.data))
    .catch(() => message.error('Có lỗi xảy ra!'));
};

  // Sau phần TimeTable và ngoài khung giờ, thêm bảng lịch sử các cuộc hẹn đã xác nhận
  // Lọc các cuộc hẹn đã xác nhận
  const confirmedAppointments = consultations.filter(c => c.status === 'approved' || c.status === 'confirmed');

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
          <th></th>
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
              const consultationsInSlot = timetable[date] && timetable[date][slot.key] ? timetable[date][slot.key] : [];
                return (
                  <td key={date}>
                    {consultationsInSlot.length > 0 ? (
                      consultationsInSlot.map(consultation => (
                         <ConsultationEntry key={consultation.id}>
                             <Text strong>{consultation.memberName}</Text><br/>
                              <Space size={4}>
                                <ClockCircleOutlined style={{ fontSize: '12px' }} />
                          <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(consultation.scheduledTime).format('HH:mm')}</Text>
                              </Space><br/>
                             <Space size={4} style={{ marginTop: '4px' }}>
                                 <FileTextOutlined style={{ fontSize: '12px' }} />
                                  <Text style={{ fontSize: '12px' }}>{consultation.notes}</Text>
                             </Space><br/>
                              <div style={{ marginTop: '4px' }}>
                                {renderConsultationStatus(consultation.status)}
                              </div>
                               <Space size={4} style={{ marginTop: '8px' }}>
                                  {consultation.status === 'pending' && (
                                      <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleOpenConfirmModal(consultation)}>
                                         Xác nhận
                                      </Button>
                                  )}
                                     {consultation.status === 'confirmed' && consultation.meetLink && (
                                         <Button size="small" icon={<LinkOutlined />} href={consultation.meetLink} target="_blank">
                                             Link Meet
                                         </Button>
                                     )}
                               </Space>
                         </ConsultationEntry>
                      ))
                    ) : (
                    ''
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </TimeTable>

      {/* Bảng lịch sử các cuộc hẹn đã xác nhận */}
      {confirmedAppointments.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <GuestHeader>
            <div className="header-title">
              <CheckCircleOutlined />
              Lịch sử các cuộc hẹn đã xác nhận
            </div>
          </GuestHeader>
          <Table
            dataSource={confirmedAppointments}
            rowKey={record => record.consultationId || record.id}
            columns={[
              {
                title: 'Ngày',
                dataIndex: 'scheduledTime',
                key: 'scheduledTime',
                render: date => dayjs(date).format('DD/MM/YYYY'),
              },
              {
                title: 'Giờ',
                dataIndex: 'scheduledTime',
                key: 'time',
                render: date => dayjs(date).format('HH:mm'),
              },
              {
                title: 'Thành viên',
                dataIndex: 'fullName',
                key: 'fullName',
              },
              {
                title: 'Ghi chú',
                dataIndex: 'notes',
                key: 'notes',
              },
              {
                title: 'Trạng thái',
                dataIndex: 'status',
                key: 'status',
                render: status => (
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
                ),
              },
              {
                title: 'Link Google Meet',
                key: 'meetingLink',
                render: (_, record) => {
                  const link = record.meetingLink || record.meetLink;
                  const scheduled = dayjs(record.scheduledTime);
                  const now = dayjs();
                  const isActive = now.isBefore(scheduled.add(1, 'hour'));
                  if (link) {
                    if (isActive) {
                      return <a href={link} target="_blank" rel="noopener noreferrer">Tham gia</a>;
                    } else {
                      return <span style={{ opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }}>Tham gia</span>;
                    }
                  }
                  return '-';
                },
              },
            ]}
            pagination={{ pageSize: 4 }}
            style={{ marginTop: '16px' }}
          />
        </div>
      )}

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