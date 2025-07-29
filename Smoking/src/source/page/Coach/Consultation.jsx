// Import các thư viện cần thiết
import React, { useState, useEffect } from 'react'; // React và các hook
import { Card, Button, Modal, Form, Input, Select, message, Typography, Space, Tag, Descriptions, Table } from 'antd'; // Các component UI từ Ant Design
import styled from 'styled-components'; // Thư viện styled-components để custom CSS
import { ClockCircleOutlined, UserOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, PhoneOutlined, MailOutlined, LinkOutlined, TrophyOutlined } from '@ant-design/icons'; // Icon từ Ant Design
import dayjs from 'dayjs'; // Thư viện xử lý ngày giờ
import weekday from 'dayjs/plugin/weekday'; // Plugin cho dayjs để lấy thứ trong tuần
import weekOfYear from 'dayjs/plugin/weekOfYear'; // Plugin cho dayjs để lấy tuần trong năm
import customParseFormat from 'dayjs/plugin/customParseFormat'; // Plugin cho dayjs để parse định dạng ngày custom
import isoWeek from 'dayjs/plugin/isoWeek'; // Plugin cho dayjs để lấy tuần ISO
import axiosClient from '../Axios/AxiosCLients'; // Hàm gọi API
import { useNavigate } from 'react-router-dom'; // Hook điều hướng trang

// Kích hoạt các plugin cho dayjs
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

// Lấy các component Typography và TextArea từ Ant Design
const { Title, Text } = Typography;
const { TextArea } = Input;

// Container là khối bao ngoài cho toàn bộ giao diện
const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow-x: auto; /* Thêm scroll ngang cho màn hình nhỏ */
`;

// GuestHeader là header cho từng phần giao diện
const GuestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: #e0f2f1; /* Màu nền xanh nhạt */
  padding: 16px 24px; /* Padding cho header */
  border-radius: 8px; /* Bo góc */
  border: 1px solid #b2dfdb; /* Viền nhẹ */

  .header-title {
    font-size: 24px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

// TimeTableControls là khối chứa các filter chọn năm, tuần
const TimeTableControls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
`;

// TimeTable là bảng hiển thị lịch tư vấn theo tuần và slot
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
    min-width: 120px; /* Độ rộng tối thiểu cho cột ngày */
  }

  th {
    background-color: #b2dfdb; /* Màu nền cho header */
    font-weight: bold;
  }

  td {
    background-color: #ffffff; /* Màu nền cho ô dữ liệu */
  }

  tr:nth-child(even) td {
      background-color: #f9f9f9; /* Màu nền khác cho dòng chẵn */
  }
`;

// SlotLabel là label cho từng slot thời gian
const SlotLabel = styled.div`
    font-weight: bold;
    margin-bottom: 8px;
`;

// ConsultationEntry là khối hiển thị thông tin từng cuộc hẹn
const ConsultationEntry = styled.div`
    background-color: #d6e4ff; /* Màu nền nhạt cho entry */
    border: 1px solid #91caff;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 8px;
    text-align: left;
    font-size: 12px;
    word-break: break-word;
`;

// StyledConfirmModal là modal xác nhận cuộc hẹn với style riêng
const StyledConfirmModal = styled(Modal)`
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
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ant-modal-title {
    color: #2c7a75;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ant-modal-body {
    padding: 24px 32px 8px 32px;
  }
  .ant-form-item-label > label {
    color: #2c7a75;
    font-weight: 600;
    font-size: 16px;
  }
  .ant-input, .ant-select-selector, textarea {
    border-radius: 10px !important;
    background: #f6fcfb !important;
    border: 1.5px solid #e3f6f5 !important;
    font-size: 16px;
    min-height: 44px;
  }
  .ant-input:focus, .ant-select-focused .ant-select-selector {
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
    width: 100%;
  }
  .ant-btn-primary:hover {
    background: linear-gradient(90deg, #2c7a75 0%, #5FB8B3 100%) !important;
    box-shadow: 0 4px 16px #5FB8B344;
  }
  .ant-btn {
    border-radius: 12px;
    font-size: 16px;
    height: 44px;
  }
`;

// Component chính quản lý logic và UI lịch tư vấn
const TimeConsultation = () => {
  // State lưu ngày được chọn (mặc định là hôm nay)
  const [selectedDate, setSelectedDate] = useState(dayjs());
  // State hiển thị modal đánh giá
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  // State lưu cuộc hẹn đang chọn để đánh giá
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  // Form cho modal đánh giá
  const [feedbackForm] = Form.useForm();

  // State cho modal xác nhận
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  // State lưu cuộc hẹn đang chọn để xác nhận
  const [confirmConsultation, setConfirmConsultation] = useState(null);
  // State lưu link phòng họp (nếu có)
  const [meetLink, setMeetLink] = useState('');
  // Form cho modal xác nhận
  const [confirmForm] = Form.useForm();

  // State lưu danh sách các cuộc hẹn
  const [consultations, setConsultations] = useState([]);
  // State lưu link phòng họp cho từng cuộc hẹn
  const [meetLinks, setMeetLinks] = useState({});
  // Lấy coachId và userId từ localStorage
  const coachId = localStorage.getItem('coachId');
  const userId = localStorage.getItem('userId'); // Nếu không có coachId thì lấy userId

  // Hook điều hướng trang
  const navigate = useNavigate();

  // useEffect: gọi API lấy danh sách cuộc hẹn khi component mount và mỗi 3 giây
  useEffect(() => {
    const idToUse = coachId || userId; // Ưu tiên coachId, nếu không có thì dùng userId
    if (idToUse) {
      // Gọi API lấy danh sách cuộc hẹn khi mount
      axiosClient.get(`/api/consultations/coach/${idToUse}`)
        .then(res => setConsultations(res.data))
        .catch((err) => setConsultations([]));
      // Thiết lập polling mỗi 3 giây để cập nhật liên tục
      const interval = setInterval(() => {
        axiosClient.get(`/api/consultations/coach/${idToUse}`)
          .then(res => setConsultations(res.data))
          .catch((err) => setConsultations([]));
      }, 3000);
      // Clear interval khi component unmount
      return () => clearInterval(interval);
    } else {
      // Nếu không có id, log ra để debug
      console.log('No coachId or userId found in localStorage');
      console.log('Available localStorage items:', {
        coachId: localStorage.getItem('coachId'),
        userId: localStorage.getItem('userId'),
        userRole: localStorage.getItem('userRole'),
        token: localStorage.getItem('token')
      });
    }
  }, [coachId, userId]);

  // Log ngày được chọn (chủ yếu để debug)
  console.log('Initial selectedDate:', selectedDate.format('YYYY-MM-DD'));

  // Hàm xác định slot thời gian dựa vào giờ của cuộc hẹn
  // Trả về tên slot (Slot 1, Slot 2, ...) hoặc null nếu không thuộc slot nào
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

  // Mảng các slot thời gian cố định trong ngày
  const timeSlots = [
      { key: 'Slot 1', time: '07:00 - 09:00' },
      { key: 'Slot 2', time: '09:30 - 11:30' },
      { key: 'Slot 3', time: '12:30 - 14:30' },
      { key: 'Slot 4', time: '15:00 - 17:00' },
      // Có thể thêm slot khác nếu cần
  ];

  // Mảng tên các ngày trong tuần (dùng cho header bảng)
  const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
  // Mảng key các ngày (không dùng nhiều)
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Tính ngày bắt đầu tuần hiện tại dựa trên selectedDate
  const startOfWeek = dayjs(selectedDate).startOf('week'); // Mặc định bắt đầu từ Chủ Nhật
  const startOfWeekMonday = dayjs(startOfWeek).add(1, 'day'); // Điều chỉnh về Thứ Hai

  // Tạo mảng 7 ngày của tuần hiện tại (dùng cho bảng lịch)
  const weekDates = Array.from({ length: 7 }).map((_, i) =>
      dayjs(startOfWeekMonday).add(i, 'day').format('YYYY-MM-DD')
  );

  // Log ra các ngày trong tuần (debug)
  console.log('Calculated weekDates:', weekDates);

  // Lấy năm và số tuần hiện tại từ selectedDate
  const currentYear = selectedDate.year();
  const currentWeek = selectedDate.isoWeek();

  // Hàm lấy tổng số tuần trong năm (theo chuẩn ISO)
  const getWeeksInYear = (year) => {
    // Tuần cuối cùng luôn chứa ngày 28/12
    return dayjs(`${year}-12-28`).isoWeek();
  };
  // Tạo danh sách các tuần để chọn filter
  const weekOptions = Array.from({ length: getWeeksInYear(currentYear) }).map((_, i) => {
    const week = i + 1;
    const startOfWeek = dayjs().year(currentYear).isoWeek(week).startOf('week').add(1, 'day'); // Thứ Hai
    const endOfWeek = dayjs(startOfWeek).add(6, 'day');
    return {
      value: week,
      label: `Tuần ${week}: ${startOfWeek.format('DD/MM')} - ${endOfWeek.format('DD/MM')}`
    };
  });

  // Tạo danh sách các năm để chọn filter
  const yearOptions = [-2, -1, 0, 1, 2].map(offset => {
    const year = dayjs().year() + offset;
    return { value: year, label: year };
  });

  // Hàm xử lý khi chọn năm mới
  const handleYearChange = (year) => {
      console.log('handleYearChange - New year:', year);
      // Đặt ngày về đầu tuần của năm mới
      setSelectedDate(dayjs().year(year).startOf('year').startOf('week').add(1, 'day'));
  };

  // Hàm xử lý khi chọn tuần mới
  const handleWeekChange = (week) => {
       console.log('handleWeekChange - New week:', week);
      // Đặt ngày về đầu tuần mới
      setSelectedDate(dayjs().year(currentYear).week(week).startOf('week').add(1, 'day'));
  };

  // Chuyển danh sách cuộc hẹn thành object theo ngày/slot để dễ render bảng
  const timetable = {}; // Object lưu các cuộc hẹn theo ngày và slot
  const outOfSlotAppointments = []; // Lưu các cuộc hẹn không thuộc slot nào

  // Log danh sách cuộc hẹn và ngày tuần (debug)
  console.log('Processing consultations:', consultations);
  console.log('Current weekDates:', weekDates);

  // Duyệt qua từng cuộc hẹn để phân loại vào timetable
  consultations.forEach(c => {
    const date = dayjs(c.scheduledTime).format('YYYY-MM-DD'); // Lấy ngày của cuộc hẹn
    console.log('Processing consultation:', {
      id: c.consultationId || c.id,
      scheduledTime: c.scheduledTime,
      date: date,
      memberName: c.memberName,
      isInWeek: weekDates.includes(date)
    });

    if (weekDates.includes(date)) { // Nếu cuộc hẹn thuộc tuần hiện tại
      const slot = getSlotFromTime(c.scheduledTime); // Xác định slot
      console.log('Slot for consultation:', slot);
      if (slot) {
        // Nếu có slot, thêm vào timetable
        if (!timetable[date]) timetable[date] = {};
        if (!timetable[date][slot]) timetable[date][slot] = [];
        timetable[date][slot].push(c);
        console.log('Added to timetable:', date, slot);
      } else {
        // Nếu không thuộc slot nào, thêm vào outOfSlotAppointments
        outOfSlotAppointments.push(c);
        console.log('Added to out of slot:', c);
      }
    } else {
      // Nếu không thuộc tuần hiện tại, bỏ qua
      console.log('Consultation not in current week:', date);
    }
  });

  // Log kết quả phân loại (debug)
  console.log('Final timetable:', timetable);
  console.log('Final out of slot:', outOfSlotAppointments);

  // Hàm xử lý khi xem bài viết (chưa dùng, để phát triển sau)
  const handleViewPost = (post) => {
    console.log('View post:', post.id);
    // TODO: Hiện tại chỉ thông báo, sau này có thể chuyển trang hoặc mở modal
    message.info(`Xem bài viết: ${post.title} (Chức năng đang phát triển)`);
  };

  // Hàm mở modal đánh giá cho một cuộc hẹn
  const handleOpenFeedbackModal = (consultation) => {
    setSelectedConsultation(consultation); // Lưu cuộc hẹn đang chọn
    // feedbackForm.setFieldsValue({ feedback: consultation.feedback }); // Nếu có dữ liệu feedback thì set vào form
    setIsFeedbackModalVisible(true); // Hiện modal
  };

  // Hàm lưu đánh giá sau khi submit form
  const handleSaveFeedback = (values) => {
    // TODO: Gọi API lưu đánh giá (chưa làm)
    console.log('Saving feedback for', selectedConsultation.id, ':', values);
    // Thông báo thành công, đóng modal và reset form
    message.success('Đã lưu đánh giá');
    setIsFeedbackModalVisible(false);
    setSelectedConsultation(null);
    feedbackForm.resetFields();
  };

  // Hàm mở modal xác nhận cuộc hẹn
  const handleOpenConfirmModal = (consultation) => {
    setConfirmConsultation(consultation); // Lưu cuộc hẹn đang chọn
    confirmForm.setFieldsValue({ meetLink: '' }); // Reset field link
    setIsConfirmModalVisible(true); // Hiện modal
  };

  // Hàm xử lý xác nhận cuộc hẹn (gọi API approve)
  const handleSaveConfirmation = () => {
    if (!confirmConsultation) return; // Nếu chưa chọn cuộc hẹn thì thoát
    const consultationId = confirmConsultation.consultationId || confirmConsultation.id; // Lấy id cuộc hẹn
    axiosClient.put(`/api/consultations/${consultationId}/approve`)
      .then(() => {
        message.success('Đã xác nhận thành công!');
        // Sau khi xác nhận, gọi lại API lấy danh sách mới
        const idToUse = coachId || userId;
        if (idToUse) {
          axiosClient.get(`/api/consultations/coach/${idToUse}`)
            .then(res => setConsultations(res.data));
        }
        setIsConfirmModalVisible(false); // Đóng modal
        confirmForm.resetFields(); // Reset form
      })
      .catch((err) => {
        console.error('Lỗi khi xác nhận:', err);
        message.error('Xác nhận thất bại, vui lòng thử lại.');
      });
  };

  // Hàm đóng modal xác nhận
  const handleCancelConfirmModal = () => {
    setIsConfirmModalVisible(false);
    setConfirmConsultation(null);
    setMeetLink('');
    confirmForm.resetFields();
  };

  // Hàm render trạng thái cuộc hẹn (hiển thị màu sắc và text)
  const renderConsultationStatus = (status) => {
    if (status === 'completed') {
      return <Tag color="green">Đã hoàn thành</Tag>;
    }
    if (status === 'approved' || status === 'confirmed') {
      return <Tag color="blue">Đã xác nhận</Tag>;
    }
    if (status === 'cancelled') {
      return <Tag color="red">Đã hủy</Tag>;
    }
    return <Tag color="orange">Chờ xác nhận</Tag>;
  };

  // Hàm xác nhận cuộc hẹn với link phòng họp (ít dùng)
  const handleApprove = (consultationId) => {
    const link = meetLinks[consultationId]; // Lấy link phòng họp
    if (!link) {
      message.error('Vui lòng nhập link Meet!');
      return;
    }
    axiosClient.put(`/api/consultations/${consultationId}/approve`, {}, { params: { meetingLink: link } })
      .then(() => {
        message.success('Xác nhận thành công!');
        // Sau khi xác nhận, gọi lại API lấy danh sách mới
        const idToUse = coachId || userId;
        return axiosClient.get(`/api/consultations/coach/${idToUse}`);
      })
      .then(res => setConsultations(res.data))
      .catch(() => message.error('Có lỗi xảy ra!'));
  };

  // Sau phần TimeTable và ngoài khung giờ, thêm bảng lịch sử các cuộc hẹn đã xác nhận
  // Lọc các cuộc hẹn đã xác nhận
  const confirmedAppointments = consultations.filter(
    c => c.status === 'approved' || c.status === 'confirmed' || c.status === 'completed'
  );

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
                {day}<br />{dayjs(startOfWeekMonday).add(index, 'day').format('DD/MM')}
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
                          <Text strong>{consultation.memberName}</Text><br />
                              <Space size={4}>
                                <ClockCircleOutlined style={{ fontSize: '12px' }} />
                          <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(consultation.scheduledTime).format('HH:mm')}</Text>
                          </Space><br />
                             <Space size={4} style={{ marginTop: '4px' }}>
                                 <FileTextOutlined style={{ fontSize: '12px' }} />
                                  <Text style={{ fontSize: '12px' }}>{consultation.notes}</Text>
                          </Space><br />
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
                                Phòng tư vấn
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

      {/* Bảng lịch sử các cuộc hẹn đã xác nhận/hoàn thành */}
        <div style={{ marginTop: '32px' }}>
          <GuestHeader>
            <div className="header-title">
              <CheckCircleOutlined />
            Lịch sử các cuộc hẹn đã xác nhận/hoàn thành
            </div>
          </GuestHeader>
          <Table
          dataSource={confirmedAppointments
            .slice()
            .sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime))
          }
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
              render: status => {
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
                // if (status === 'cancelled') {
                //   return (
                //     <span style={{
                //       background: '#ffe6e6',
                //       color: '#ff4d4f',
                //       fontWeight: 700,
                //       borderRadius: 12,
                //       padding: '4px 16px',
                //       fontSize: 15,
                //       boxShadow: '0 1px 4px #ff4d4f22',
                //       letterSpacing: 1
                //     }}>Đã hủy</span>
                //   );
                // }
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
                        const uid = localStorage.getItem('coachId');
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
                },
              },
            ]}
            pagination={{ pageSize: 4 }}
            style={{ marginTop: '16px' }}
          />
        </div>

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
      <StyledConfirmModal
        title={"Xác nhận cuộc hẹn"}
            open={isConfirmModalVisible}
            onCancel={handleCancelConfirmModal}
            footer={null}
        >
        <div style={{ marginBottom: 18, color: '#2c7a75', fontSize: 16, textAlign: 'center' }}>
          Bạn có chắc chắn muốn xác nhận cuộc hẹn này?
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, marginBottom: 0 }}>
          <Button onClick={handleCancelConfirmModal} style={{ background: '#f5f5f5', color: '#666', border: 'none', boxShadow: 'none', fontWeight: 500, borderRadius: 10, padding: '0 22px', height: 40 }}>
                            Hủy
                        </Button>
          <Button type="primary" onClick={() => handleSaveConfirmation()}>Xác nhận</Button>
        </div>
      </StyledConfirmModal>

    </Container>
  );
};

export default TimeConsultation; 