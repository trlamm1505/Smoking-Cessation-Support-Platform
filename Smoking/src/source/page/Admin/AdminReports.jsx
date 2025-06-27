import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Typography, Tag, Select, message, Spin, Tabs, Card } from 'antd';
import {
    InboxOutlined,
    SendOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    MessageOutlined // Using MessageOutlined for icon
} from '@ant-design/icons';
import styled from 'styled-components';
import userApi from '../Axios/userAxios';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const AdminReports = () => {
    const [activeTab, setActiveTab] = useState('received');
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isSendModalVisible, setIsSendModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setLoading(true);
        userApi.getAll().then(res => {
            setUsers(res.data || res);
        });
        userApi.getFeedbacks({}).then(res => {
            // Only show feedbacks where targetType !== 'coach'
            const data = (res.data || res).filter(fb => fb.targetType !== 'coach');
            setFeedbacks(data.map(fb => ({ ...fb, id: fb.feedbackId })));
        }).catch(() => {
            message.error('Lỗi tải phản hồi');
        }).finally(() => setLoading(false));
    }, []);

    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setIsViewModalVisible(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalVisible(false);
        setSelectedFeedback(null);
    };

     const handleMarkAsResolved = (id) => {
        // Implementation needed
    };

    const handleSendReport = () => {
        form.validateFields().then(values => {
            console.log('Sending report:', values);
            // Logic to send report goes here (e.g., API call)
            setIsSendModalVisible(false);
            form.resetFields();
        });
    };

    const handleCancelSendModal = () => {
        setIsSendModalVisible(false);
        form.resetFields();
    };

    // Helper to get fullName by userId
    const getSenderName = (userId) => {
        const user = users.find(u => u.userId === userId);
        return user ? user.fullName : userId;
    };

    // Table columns for admin feedbacks
    const feedbackColumns = [
         {
            title: 'Loại',
            dataIndex: 'targetType',
            key: 'targetType',
             render: (type) => {
                let color = type === 'system' ? 'geekblue' : 'orange';
                return <Tag color={color}>{type.toUpperCase()}</Tag>;
            },
            width: 120,
        },
        {
            title: 'Số sao',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => rating ? Array.from({ length: rating }, (_, i) => <span key={i} style={{ color: '#FFD700', fontSize: '1.1em' }}>★</span>) : '-',
            width: 100,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: 180,
        },
        {
            title: 'Nội dung',
            dataIndex: 'comment',
            key: 'comment',
            width: 260,
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
             render: (status) => {
                let color = status === 'active' ? 'success' : 'default';
                return <Tag color={color}>{status?.toUpperCase()}</Tag>;
            },
            width: 120,
        },
         {
            title: 'Người gửi',
            key: 'sender',
            render: (_, record) => getSenderName(record.userId),
            width: 160,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 90,
             render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => handleViewFeedback(record)} />
                    {record.status === 'active' && (
                        <Button icon={<CheckCircleOutlined />} onClick={() => handleMarkAsResolved(record.id)} style={{ color: '#52c41a' }}>Đã xử lý</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{
            padding: 0,
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e0fcf8 0%, #f7fafd 100%)',
        }}>
            <Card bordered={false} style={{
                boxShadow: '0 8px 32px rgba(79,209,197,0.12)',
                borderRadius: 32,
                margin: '0 auto 32px auto',
                maxWidth: 900,
                background: 'linear-gradient(90deg, #4fd1c5 0%, #38b2ac 100%)',
            }}>
                <h1 style={{
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 38,
                    textAlign: 'center',
                    margin: 0,
                    letterSpacing: 2,
                    textShadow: '0 2px 8px #38b2ac44',
                }}>Quản lý Phản hồi hệ thống & Báo cáo</h1>
            </Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab} tabBarStyle={{ fontSize: 22, fontWeight: 700, color: '#38b2ac' }} style={{ maxWidth: 1100, margin: '0 auto' }}>
                 <TabPane 
                    tab={
                        <span>
                            <InboxOutlined style={{ color: '#4fd1c5', fontSize: 26 }} />
                            Phản hồi hệ thống & báo cáo
                        </span>
                    }
                    key="received"
                >
                    <Card bordered style={{ borderRadius: 24, boxShadow: '0 4px 24px #e6f9f7', marginBottom: 32, border: '1.5px solid #4fd1c5', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
                            <Button type="primary" icon={<SendOutlined />} style={{
                                background: 'linear-gradient(90deg, #4fd1c5 0%, #38b2ac 100%)',
                                borderColor: '#4fd1c5',
                                fontWeight: 700,
                                fontSize: 18,
                                borderRadius: 32,
                                padding: '0 40px',
                                height: 48,
                                boxShadow: '0 2px 8px #4fd1c544',
                                transition: 'all 0.2s',
                            }}
                                onMouseOver={e => e.currentTarget.style.background = '#38b2ac'}
                                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #4fd1c5 0%, #38b2ac 100%)'}
                                onClick={() => setIsSendModalVisible(true)}
                            >
                                Gửi báo cáo
                            </Button>
                        </div>
                        <Spin spinning={loading} tip="Đang tải...">
                    <Table
                                dataSource={feedbacks}
                                columns={feedbackColumns}
                        rowKey="id"
                                pagination={{ pageSize: 10 }}
                                bordered
                                size="large"
                                style={{ borderRadius: 18 }}
                                rowClassName={() => 'custom-table-row'}
                                title={() => <span style={{ color: '#4fd1c5', fontWeight: 800, fontSize: 24, letterSpacing: 1 }}>Danh sách phản hồi & báo cáo</span>}
                            />
                        </Spin>
                    </Card>
                 </TabPane>
             </Tabs>
            {/* Modal for viewing feedback details */}
            <Modal
                title="Chi tiết phản hồi / báo cáo"
                open={isViewModalVisible}
                onCancel={handleCloseViewModal}
                footer={null}
                width={600}
            >
                {selectedFeedback && (
                    <div>
                        <p><strong>Loại:</strong> <Tag color={selectedFeedback.targetType === 'system' ? 'geekblue' : 'orange'}>{selectedFeedback.targetType?.toUpperCase()}</Tag></p>
                        <p><strong>Số sao:</strong> {selectedFeedback.rating ? Array.from({ length: selectedFeedback.rating }, (_, i) => <span key={i} style={{ color: '#FFD700', fontSize: '1.1em' }}>★</span>) : '-'}</p>
                        <p><strong>Tiêu đề:</strong> {selectedFeedback.title || '-'}</p>
                        <p><strong>Nội dung:</strong> {selectedFeedback.comment}</p>
                        <p><strong>Trạng thái:</strong> <Tag color={selectedFeedback.status === 'active' ? 'success' : 'default'}>{selectedFeedback.status?.toUpperCase()}</Tag></p>
                        <p><strong>Người gửi:</strong> {getSenderName(selectedFeedback.userId)}</p>
                    </div>
                )}
            </Modal>
            {/* Modal for sending a report */}
             <Modal
                title="Gửi Báo cáo / Thông báo"
                open={isSendModalVisible}
                onOk={handleSendReport}
                onCancel={handleCancelSendModal}
                okText="Gửi"
                cancelText="Hủy"
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="recipient"
                        label="Người nhận"
                        rules={[{ required: true, message: 'Vui lòng chọn người nhận' }]}
                    >
                        <Select placeholder="Chọn người nhận">
                            <Option value="all-users">Tất cả người dùng</Option>
                            <Option value="all-coaches">Tất cả Coach</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="subject"
                        label="Chủ đề"
                        rules={[{ required: true, message: 'Vui lòng nhập chủ đề' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="message"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
            {/* Custom table row style */}
            <style>{`
                .custom-table-row:hover td {
                  background: #e0fcf8 !important;
                }
                .ant-table-thead > tr > th {
                  background: #4fd1c5 !important;
                  color: #fff !important;
                  font-weight: 900;
                  font-size: 18px;
                  letter-spacing: 1px;
                }
                .ant-table-bordered .ant-table-container {
                  border-radius: 18px !important;
                }
            `}</style>
        </div>
    );
};

export default AdminReports; 