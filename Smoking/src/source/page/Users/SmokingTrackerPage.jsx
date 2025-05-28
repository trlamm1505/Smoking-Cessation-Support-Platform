import React, { useState } from 'react';
import { Card, Form, InputNumber, Select, Button, Typography, TimePicker, Space, Table, DatePicker } from 'antd';
import { PlusOutlined, SaveOutlined, ClockCircleOutlined, EnvironmentOutlined, DollarOutlined, SmileOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title } = Typography;
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

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);

    .stat-title {
      color: #666;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      color: #5FB8B3;
      font-weight: 500;
    }
  }

  .tracker-form-card {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 24px;
  }

  .history-card {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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