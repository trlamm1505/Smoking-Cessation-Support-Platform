import React, { useState, useEffect } from 'react';
import { Card, Form, InputNumber, Select, Button, Typography, TimePicker, Space, Table, DatePicker, Input } from 'antd';
import { PlusOutlined, SaveOutlined, ClockCircleOutlined, EnvironmentOutlined, DollarOutlined, SmileOutlined, CalendarOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title } = Typography;
const { Option } = Select;

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

const AnimatedCard = styled(Card)`
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(95, 184, 179, 0.1);
  margin-bottom: 24px;
  border: 1px solid rgba(95, 184, 179, 0.1);
`;

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

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 24px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .stat-card {
    background: #ffffff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(95, 184, 179, 0.15);
      border-color: #5FB8B3;
    }

    .stat-title {
      color: #64748b;
      font-size: 16px;
      font-weight: normal;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #5FB8B3;
    }
  }

  .tracker-form-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(95, 184, 179, 0.1);
    border: 1px solid rgba(95, 184, 179, 0.1);
    margin-bottom: 24px;

    .ant-card-head {
      border-bottom: 2px solid #E3F6F5;
      margin-bottom: 20px;
    }

    .ant-form-item-label > label {
      color: #2c7a75;
      font-weight: 500;
      font-size: 15px;

      .anticon {
        color: #5FB8B3;
      }
    }

    .ant-input-number,
    .ant-picker,
    .ant-select-selector {
      border-radius: 8px;
      border: 1px solid #E3F6F5;
      padding: 8px 12px;
      height: auto;
      transition: all 0.3s ease;
      
      &:hover, &:focus {
        border-color: #5FB8B3;
        box-shadow: 0 0 0 2px rgba(95, 184, 179, 0.1);
      }
    }

    .ant-select-selector {
      height: 42px !important;
      padding: 0 12px !important;
      
      .ant-select-selection-item {
        line-height: 42px;
      }
    }

    .ant-btn {
      border-radius: 8px;
      height: 42px;
      background: linear-gradient(135deg, #5FB8B3, #70C1BC);
      border: none;
      box-shadow: 0 2px 8px rgba(95, 184, 179, 0.2);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(95, 184, 179, 0.3);
        background: linear-gradient(135deg, #70C1BC, #5FB8B3);
      }

      .anticon {
        margin-right: 8px;
      }
    }
  }

  .history-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(95, 184, 179, 0.1);
    border: 1px solid rgba(95, 184, 179, 0.1);

    .ant-card-head {
      border-bottom: 2px solid #E3F6F5;
      margin-bottom: 20px;
    }

    .ant-table {
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
    }
  }

  .achievements-section {
    margin-bottom: 32px;
  }
`;

const SmokingTrackerPage = () => {
  const [form] = Form.useForm();
  const [entries, setEntries] = useState([]);
  const [maxCigarettesPerDay, setMaxCigarettesPerDay] = useState(20);
  const [pricePerPack, setPricePerPack] = useState(30000);
  const [planRange, setPlanRange] = useState({ start: null, end: null });

  const fetchLogs = async () => {
    const userId = Number(localStorage.getItem('userId')) || 1;
    const res = await fetch(`http://localhost:8080/habit-logs/all/${userId}`);
    const data = await res.json();
    const logs = Array.isArray(data) ? data : [data];
    setEntries(logs.map(log => ({
      ...log,
      id: log.id,
      date: log.logDate,
      cigaretteCount: log.cigarettesSmoked,
      price: log.moneySaved,
      cravingLevel: log.cravingsLevel,
      healthNote: log.notes,
    })));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const userId = Number(localStorage.getItem('userId')) || 1;
    fetch(`http://localhost:8080/api/cessation-plans/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        let plan = Array.isArray(data) ? data[0] : data;
        if (plan && plan.startDate && (plan.targetQuitDate || plan.endDate)) {
          setPlanRange({
            start: dayjs(plan.startDate),
            end: dayjs(plan.targetQuitDate || plan.endDate)
          });
        }
      });
  }, []);

  const onFinish = async (values) => {
    const userId = Number(localStorage.getItem('userId')) || 1;
    const payload = {
      userId,
      logDate: values.logDate ? values.logDate.format('YYYY-MM-DD') : new Date().toISOString().slice(0, 10),
      smokedToday: values.smokedToday !== undefined ? values.smokedToday : true,
      cigarettesSmoked: values.cigaretteCount !== undefined && values.cigaretteCount !== null ? values.cigaretteCount : 0,
      cravingsLevel: Number(values.cravingLevel),
      mood: values.mood,
      notes: values.healthNote || '',
      moneySaved: values.price || 0
    };
    try {
      const res = await fetch('http://localhost:8080/habit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Lưu ghi nhận thất bại!');
      await fetchLogs(); // fetch lại danh sách sau khi lưu thành công
      form.resetFields();
    } catch (err) {
      // Có thể thêm message.error(err.message || 'Lỗi khi lưu!') nếu muốn
    }
  };

  const columns = [
    {
      title: 'Ngày ghi nhận',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Số điếu',
      dataIndex: 'cigaretteCount',
      key: 'cigaretteCount',
    },
    {
      title: 'Chi phí tiết kiệm (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price?.toLocaleString() || '0',
    },
    {
      title: 'Mức độ thèm thuốc',
      dataIndex: 'cravingLevel',
      key: 'cravingLevel',
      render: (level) => {
        if (level === '1') return '1 - Không thèm';
        if (level === '3') return '3 - Bình thường';
        if (level === '5') return '5 - Rất thèm';
        return level;
      }
    },
    {
      title: 'Tâm trạng',
      dataIndex: 'mood',
      key: 'mood',
      render: (mood) => {
        if (mood === 'good') return 'Tốt';
        if (mood === 'normal') return 'Bình thường';
        if (mood === 'stress') return 'Căng thẳng';
        if (mood === 'sad') return 'Buồn';
        return mood;
      }
    },
    {
      title: 'Ghi chú sức khỏe hôm nay',
      dataIndex: 'healthNote',
      key: 'healthNote',
    },
  ];

  const totalCigarettes = entries.reduce((sum, entry) => sum + (entry.cigaretteCount || 0), 0);
  const totalCost = entries.reduce((sum, entry) => sum + (entry.price || 0), 0);
  const savedCost = Math.max(0, (maxCigarettesPerDay * pricePerPack) - totalCost);

  const filteredEntries = planRange.start && planRange.end
    ? entries.filter(entry => {
      const entryDate = dayjs(entry.date);
      return entryDate.isSameOrAfter(planRange.start, 'day') && entryDate.isSameOrBefore(planRange.end, 'day');
    })
    : entries;

  return (
    <PageContainer>
      <Title level={2} className="page-title">
        <SmileOutlined />
        Ghi Nhận Thói Quen Hút Thuốc
      </Title>

      <AnimatedCard delay="0.5s" title="Thêm Ghi Nhận Mới" className="tracker-form-card">
        <Form
          form={form}
          name="smoking_tracker"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="cigaretteCount"
            label={
              <Space>
                <PlusOutlined />
                <span>Số điếu thuốc</span>
              </Space>
            }
            rules={[]}
          >
            <InputNumber min={0} placeholder="Nhập số điếu" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="price"
            label={
              <Space>
                <DollarOutlined />
                <span>Chi phí tiết kiệm (VND)</span>
              </Space>
            }
            rules={[{ required: true, message: 'Vui lòng nhập chi phí tiết kiệm!' }]}
          >
            <InputNumber
              min={0}
              step={1000}
              style={{ width: '100%' }}
              placeholder="Nhập chi phí tiết kiệm"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\D/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="cravingLevel"
            label={<span>🔥 Mức độ thèm thuốc</span>}
            rules={[{ required: true, message: 'Vui lòng chọn mức độ thèm thuốc!' }]}
          >
            <Select placeholder="Chọn mức độ thèm thuốc">
              <Option value="1">1 - Không thèm</Option>
              <Option value="2">2</Option>
              <Option value="3">3 - Bình thường</Option>
              <Option value="4">4</Option>
              <Option value="5">5 - Rất thèm</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="mood"
            label={<span>😊 Tâm trạng của bạn</span>}
            rules={[{ required: true, message: 'Vui lòng chọn tâm trạng!' }]}
          >
            <Select placeholder="Chọn tâm trạng">
              <Option value="good">Tốt</Option>
              <Option value="normal">Bình thường</Option>
              <Option value="stress">Căng thẳng</Option>
              <Option value="sad">Buồn</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="healthNote"
            label={<span>🩺 Ghi chú về tình trạng sức khỏe hôm nay</span>}
          >
            <Input.TextArea rows={2} placeholder="Nhập ghi chú về sức khỏe hôm nay..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>
              Lưu ghi nhận
            </Button>
          </Form.Item>
        </Form>
      </AnimatedCard>

      <AnimatedCard delay="0.75s" title="Lịch Sử Ghi Nhận" className="history-card">
        <Table
          columns={columns}
          dataSource={filteredEntries}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </AnimatedCard>
    </PageContainer>
  );
};

export default SmokingTrackerPage; 