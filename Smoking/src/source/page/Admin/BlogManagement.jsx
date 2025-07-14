import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;
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

const BlogManagement = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [form] = Form.useForm();
    const [blogPosts, setBlogPosts] = useState([
        {
            id: 1,
            title: 'Top 10 Phương Pháp Cai Thuốc Lá',
            author: 'TS. Nguyễn Văn A',
            views: 1520,
            status: 'Published'
        },
        {
            id: 2,
            title: 'Lợi Ích Của Việc Ngừng Hút Thuốc',
            author: 'BS. Trần Thị B',
            views: 800,
            status: 'Pending'
        },
        {
            id: 3,
            title: 'Cách Vượt Qua Cơn Thèm Thuốc',
            author: 'ThS. Lê Văn C',
            views: 500,
            status: 'Published'
        },
        {
            id: 4,
            title: 'Tác Động Của Thuốc Lá Đến Phổi',
            author: 'PGS. TS. Phạm Thị D',
            views: 300,
            status: 'Pending'
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
        setBlogPosts(blogPosts.map(post =>
            post.id === id ? { ...post, status: 'Published' } : post
        ));
    };

    const handleReject = (id) => {
         setBlogPosts(blogPosts.map(post =>
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
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Lượt xem',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color;
                if (status === 'Published') {
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
                    <BookOutlined />
                    <Title level={2} style={{ margin: 0 }}>Quản lý blog</Title>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('add')}>
                    Thêm bài viết
                </Button>
            </Header>

            <Table
                dataSource={blogPosts}
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
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input />
                    </Form.Item>
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
                        <Input.TextArea rows={6} />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Danh mục"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                    >
                        <Select>
                            <Option value="methods">Phương pháp</Option>
                            <Option value="health">Sức khỏe</Option>
                            <Option value="nutrition">Dinh dưỡng</Option>
                            <Option value="psychology">Tâm lý</Option>
                            <Option value="success">Câu chuyện thành công</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default BlogManagement; 