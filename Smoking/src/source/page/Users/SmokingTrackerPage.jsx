import React, { useState } from 'react';
import { Card, Form, InputNumber, Select, Button, Typography, TimePicker, Space, Table, DatePicker } from 'antd';
import { PlusOutlined, SaveOutlined, ClockCircleOutlined, EnvironmentOutlined, DollarOutlined, SmileOutlined, CalendarOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title } = Typography;
const { Option } = Select;

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

    const onFinish = (values) => {
        const newEntry = {
            ...values,
            id: Date.now(),
            date: new Date().toLocaleDateString()
        };
        setEntries([...entries, newEntry]);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Số điếu',
            dataIndex: 'cigaretteCount',
            key: 'cigaretteCount',
        },
        {
            title: 'Thời điểm',
            dataIndex: 'timeOfDay',
            key: 'timeOfDay',
            render: (time) => time?.format('HH:mm') || '-',
        },
        {
            title: 'Địa điểm',
            dataIndex: 'location',
            key: 'location',
            render: (location) => {
                const locations = {
                    home: 'Tại nhà',
                    work: 'Nơi làm việc',
                    social: 'Gặp bạn bè',
                    stress: 'Lúc căng thẳng',
                    other: 'Khác'
                };
                return locations[location] || location;
            },
        },
        {
            title: 'Chi phí (VND)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price?.toLocaleString() || '0',
        },
    ];

    const totalCigarettes = entries.reduce((sum, entry) => sum + (entry.cigaretteCount || 0), 0);
    const totalCost = entries.reduce((sum, entry) => sum + (entry.price || 0), 0);

    return (
        <PageContainer>
            <Title level={2} className="page-title">
                <SmileOutlined />
                Ghi Nhận Thói Quen Hút Thuốc
            </Title>

            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-title">Tổng số điếu hôm nay</div>
                    <div className="stat-value">{totalCigarettes} điếu</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Chi phí hôm nay</div>
                    <div className="stat-value">{totalCost.toLocaleString()} VND</div>
                </div>
            </div>

            <Card title="Thêm Ghi Nhận Mới" className="tracker-form-card">
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
                        rules={[{ required: true, message: 'Vui lòng nhập số điếu!' }]}
                    >
                        <InputNumber min={1} placeholder="Nhập số điếu" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="timeOfDay"
                        label={
                            <Space>
                                <ClockCircleOutlined />
                                <span>Thời điểm</span>
                            </Space>
                        }
                        rules={[{ required: true, message: 'Vui lòng chọn thời điểm!' }]}
                    >
                        <TimePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label={
                            <Space>
                                <EnvironmentOutlined />
                                <span>Địa điểm</span>
                            </Space>
                        }
                        rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                    >
                        <Select placeholder="Chọn địa điểm">
                            <Option value="home">Tại nhà</Option>
                            <Option value="work">Nơi làm việc</Option>
                            <Option value="social">Gặp bạn bè</Option>
                            <Option value="stress">Lúc căng thẳng</Option>
                            <Option value="other">Khác</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label={
                            <Space>
                                <DollarOutlined />
                                <span>Giá mỗi bao (VND)</span>
                            </Space>
                        }
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber
                            min={0}
                            step={1000}
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>
                            Lưu ghi nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Lịch Sử Ghi Nhận" className="history-card">
                <Table
                    columns={columns}
                    dataSource={entries}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </PageContainer>
    );
};

export default SmokingTrackerPage; 