import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UsergroupAddOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title } = Typography;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: #e0f2f1;
  padding: 16px 24px;
  border-radius: 8px;
  border: 1px solid #b2dfdb;

  .header-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #2c7a75;
    font-size: 24px;
    font-weight: 600;
  }
`;

const CommunityManagement = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [form] = Form.useForm();

    // Mock data for community posts with different statuses
    const [communityPosts, setCommunityPosts] = useState([
        {
            id: 1,
            author: 'Nguyễn Văn A',
            content: 'Vừa đạt được 7 ngày không hút thuốc!',
            likes: 12,
            comments: 5,
            status: 'Approved'
        },
         {
            id: 2,
            author: 'Trần Thị B',
            content: 'Có ai gặp khó khăn trong việc bỏ thuốc không?',
            likes: 8,
            comments: 3,
            status: 'Pending'
        },
         {
            id: 3,
            author: 'Lê Văn C',
            content: 'Mẹo nhỏ giúp vượt qua cơn thèm.',
            likes: 20,
            comments: 10,
            status: 'Approved'
        },
          {
            id: 4,
            author: 'Phạm Thị D',
            content: 'Bài viết của tôi bị xóa, tại sao vậy admin?',
            likes: 1,
            comments: 2,
            status: 'Rejected'
        },
    ]);

    const showModal = (type) => {
        setModalType(type);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            console.log('Form values:', values);
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

     const handleApprove = (id) => {
        setCommunityPosts(communityPosts.map(post =>
            post.id === id ? { ...post, status: 'Approved' } : post
        ));
    };

    const handleReject = (id) => {
         setCommunityPosts(communityPosts.map(post =>
            post.id === id ? { ...post, status: 'Rejected' } : post
        ));
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Likes',
            dataIndex: 'likes',
            key: 'likes',
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
             render: (status) => {
                let color;
                if (status === 'Approved') {
                    color = 'success';
                } else if (status === 'Pending') {
                    color = 'warning';
                } else {
                    color = 'error';
                }
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showModal('edit')} />
                    <Button icon={<DeleteOutlined />} danger />
                     {record.status === 'Pending' && (
                        <>
                            <Button icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)} style={{ color: '#52c41a' }} />
                            <Button icon={<CloseCircleOutlined />} onClick={() => handleReject(record.id)} style={{ color: '#ff4d4f' }} />
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
            <Header>
                <div className="header-title">
                    <UsergroupAddOutlined />
                    <Title level={2} style={{ margin: 0 }}>Quản lý bài viết cộng đồng</Title>
                </div>
            </Header>

            <Table
                dataSource={communityPosts}
                columns={columns}
                rowKey="id"
            />

            <Modal
                title={modalType === 'add' ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="author"
                        label="Tác giả"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="content"
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

export default CommunityManagement; 