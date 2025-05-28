import React, { useState, useEffect } from 'react';
import { Calendar, Button, Modal, TimePicker, Checkbox, message, Typography, Space } from 'antd';
import styled from 'styled-components';
import { ClockCircleOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;

const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TimeSlotContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
`;

const TimeSlot = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 4px;
  background: ${props => props.selected ? '#e6f7ff' : 'transparent'};
`;

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTimeSlots, setCurrentTimeSlots] = useState([]);
  const [savedSchedule, setSavedSchedule] = useState({});
  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });

  useEffect(() => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    setCurrentTimeSlots(savedSchedule[dateKey] || []);
  }, [selectedDate, savedSchedule]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handlePanelChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddTimeSlot = () => {
    setCurrentTimeSlots([...currentTimeSlots, { id: Date.now(), start: null, end: null }]);
  };

  const handleTimeChange = (id, type, time) => {
    const newTimeSlots = currentTimeSlots.map(slot =>
      slot.id === id ? { ...slot, [type]: time } : slot
    );
    setCurrentTimeSlots(newTimeSlots);
  };

  const handleRemoveTimeSlot = (id) => {
    const newTimeSlots = currentTimeSlots.filter(slot => slot.id !== id);
    setCurrentTimeSlots(newTimeSlots);
  };

  const handleSaveSchedule = () => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    setSavedSchedule({
      ...savedSchedule,
      [dateKey]: currentTimeSlots
    });
    message.success('Lịch làm việc đã được cập nhật');
    setIsModalVisible(false);
  };

  const handleWorkingDayChange = (day) => {
    setWorkingDays({
      ...workingDays,
      [day]: !workingDays[day]
    });
  };

  const cellRender = (current) => {
    const dateKey = current.format('YYYY-MM-DD');
    const slots = savedSchedule[dateKey];
    if (slots && slots.length > 0) {
      return (
        <div style={{ color: '#1890ff', fontSize: '12px' }}>
          {slots.length} khung giờ
        </div>
      );
    }
    return null;
  };

  return (
    <Container>
      <Header>
        <Title level={2}>Quản lý lịch làm việc</Title>
      </Header>

      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Ngày làm việc</Title>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(workingDays).map(([day, isWorking]) => (
            <Checkbox
              key={day}
              checked={isWorking}
              onChange={() => handleWorkingDayChange(day)}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Checkbox>
          ))}
        </div>
      </div>

      <Calendar
        onSelect={handleDateSelect}
        onPanelChange={handlePanelChange}
        value={selectedDate}
        cellRender={cellRender}
      />

      <Modal
        title={`Thiết lập khung giờ cho ngày ${selectedDate.format('DD/MM/YYYY')}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="add" icon={<ClockCircleOutlined />} onClick={handleAddTimeSlot}>
            Thêm khung giờ
          </Button>,
          <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSaveSchedule}>
            Lưu lịch trình
          </Button>
        ]}
      >
        <TimeSlotContainer>
          {currentTimeSlots.length > 0 ? (
            currentTimeSlots.map((slot) => (
              <TimeSlot key={slot.id}>
                <TimePicker
                  format="HH:mm"
                  placeholder="Giờ bắt đầu"
                  value={slot.start ? dayjs(slot.start, 'HH:mm') : null}
                  onChange={(time, timeString) => handleTimeChange(slot.id, 'start', timeString)}
                  minuteStep={30}
                />
                <span>đến</span>
                <TimePicker
                  format="HH:mm"
                  placeholder="Giờ kết thúc"
                  value={slot.end ? dayjs(slot.end, 'HH:mm') : null}
                  onChange={(time, timeString) => handleTimeChange(slot.id, 'end', timeString)}
                  minuteStep={30}
                />
                <Button
                  type="text"
                  icon={<DeleteOutlined style={{ color: 'red' }} />}
                  onClick={() => handleRemoveTimeSlot(slot.id)}
                />
              </TimeSlot>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#999' }}>
              Chưa có khung giờ nào được thiết lập cho ngày này.
            </div>
          )}
        </TimeSlotContainer>
      </Modal>
    </Container>
  );
};

export default Schedule; 