import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Typography, Tag, Select, Card, Row, Col, Tabs } from 'antd';
import {
    InboxOutlined,
    SendOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    MessageOutlined // Using MessageOutlined for icon
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Styled component for the header, similar to other admin pages
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: #e0f2f1; /* Light teal background */
  padding: 16px 24px;
  border-radius: 8px;
  border: 1px solid #b2dfdb; /* Teal border */

  .header-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #2c7a75; /* Dark teal color */
    font-size: 24px;
    font-weight: 600;
  }
`;

const AdminReports = () => {
    const [activeTab, setActiveTab] = useState('received');
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isSendModalVisible, setIsSendModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Mock data for received reports/feedback
    const [receivedReports, setReceivedReports] = useState([
        { id: 1, from: 'User ID 101', type: 'Feedback', subject: 'Giao diện khó dùng', message: 'Tôi thấy trang ghi nhận thói quen hơi rối...', status: 'Pending', date: '20/03/2024' },
        { id: 2, from: 'Coach ID 205', type: 'Report', subject: 'Bài viết cộng đồng không phù hợp', message: 'Bài viết có nội dung tiêu cực...', status: 'Pending', date: '19/03/2024' },
         { id: 3, from: 'User ID 110', type: 'Report', subject: 'Lỗi chức năng theo dõi', message: 'Tôi không thể cập nhật số điếu thuốc...', status: 'Resolved', date: '18/03/2024' },
    ]);

    // Mock data for sending options (e.g., recipients)
    const recipients = [
        { key: 'all-users', label: 'Tất cả người dùng' },
        { key: 'all-coaches', label: 'Tất cả Coach' },
        { key: 'user-101', label: 'Người dùng ID 101' },
        { key: 'coach-205', label: 'Coach ID 205' },
    ];

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setIsViewModalVisible(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalVisible(false);
        setSelectedReport(null);
    };

     const handleMarkAsResolved = (id) => {
        setReceivedReports(receivedReports.map(report =>
            report.id === id ? { ...report, status: 'Resolved' } : report
        ));
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

    const receivedColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Từ',
            dataIndex: 'from',
            key: 'from',
        },
         {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
             render: (type) => {
                let color = type === 'Report' ? 'volcano' : 'geekblue';
                return <Tag color={color}>{type.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Chủ đề',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
             render: (status) => {
                let color;
                if (status === 'Resolved') {
                    color = 'success';
                } else if (status === 'Pending') {
                    color = 'warning';
                } else {
                    color = 'default';
                }
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
         {
            title: 'Ngày nhận',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Thao tác',
            key: 'action',
             render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => handleViewReport(record)} />
                     {record.status === 'Pending' && (
                        <Button icon={<CheckCircleOutlined />} onClick={() => handleMarkAsResolved(record.id)} style={{ color: '#52c41a' }} >Đã xử lý</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
             <Header>
                <div className="header-title">
                    <MessageOutlined /> {/* Icon for Reports */}
                    <Title level={2} style={{ margin: 0 }}>Quản lý Báo cáo & Phản hồi</Title>
                </div>
                <Button type="primary" icon={<SendOutlined />} onClick={() => setIsSendModalVisible(true)}>
                    Gửi báo cáo
                </Button>
            </Header>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                 <TabPane 
                    tab={
                        <span>
                            <InboxOutlined />
                            Báo cáo & Phản hồi nhận được
                        </span>
                    }
                    key="received"
                >
                    <Table
                        dataSource={receivedReports}
                        columns={receivedColumns}
                        rowKey="id"
                    />
                 </TabPane>
                 {/* We can add other tabs later, e.g., "Sent Reports" */}
             </Tabs>


            {/* Modal for viewing received report details */}
            <Modal
                title="Chi tiết Báo cáo / Phản hồi"
                open={isViewModalVisible}
                onCancel={handleCloseViewModal}
                footer={null}
                width={600}
            >
                {selectedReport && (
                    <div>
                        <p><strong>Từ:</strong> {selectedReport.from}</p>
                        <p><strong>Loại:</strong> <Tag color={selectedReport.type === 'Report' ? 'volcano' : 'geekblue'}>{selectedReport.type.toUpperCase()}</Tag></p>
                        <p><strong>Chủ đề:</strong> {selectedReport.subject}</p>
                        <p><strong>Ngày nhận:</strong> {selectedReport.date}</p>
                        <p><strong>Trạng thái:</strong> <Tag color={selectedReport.status === 'Resolved' ? 'success' : selectedReport.status === 'Pending' ? 'warning' : 'default'}>{selectedReport.status.toUpperCase()}</Tag></p>
                        <Typography.Paragraph style={{ marginTop: 16 }}>
                            <strong>Nội dung:</strong> {selectedReport.message}
                        </Typography.Paragraph>
                         {selectedReport.status === 'Pending' && (
                              <Button
                                style={{ marginTop: 16 }}
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() => {handleMarkAsResolved(selectedReport.id); handleCloseViewModal();}}
                              >Đánh dấu đã xử lý</Button>
                         )}
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
                            {recipients.map(rec => (
                                <Option key={rec.key} value={rec.key}>{rec.label}</Option>
                            ))}
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
        </>
    );
};

export default AdminReports; 