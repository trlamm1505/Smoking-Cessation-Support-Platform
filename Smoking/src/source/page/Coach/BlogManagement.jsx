import React, { useState } from 'react';
import { Typography, Card, Button, Space, Modal, Form, Input, message, Upload, Tag, Table, Select, Tooltip } from 'antd';
import styled from 'styled-components';
import { EditOutlined, DeleteOutlined, PlusOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, PictureOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

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

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  .ant-card-body {
    padding: 24px;
  }

  .ant-table-thead > tr > th {
    background: #f5f5f5;
    font-weight: 600;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f0f8f7;
  }
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const StatusTag = styled(Tag)`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
`;

const BlogManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Lợi ích của việc bỏ thuốc lá',
      content: 'Nội dung bài viết về lợi ích của việc bỏ thuốc lá...',
      image: 'https://example.com/image1.jpg',
      tags: ['Sức khỏe', 'Bỏ thuốc'],
      status: 'Đã đăng',
      createdAt: '2024-03-31',
    },
  ]);

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Space>
          <FileTextOutlined style={{ color: '#5FB8B3' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Tooltip title="Xem ảnh đại diện">
          <ImagePreview src={image} alt="Blog thumbnail" />
        </Tooltip>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <Space wrap>
          {tags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <StatusTag color={status === 'Đã đăng' ? 'success' : 'processing'}>
          {status === 'Đã đăng' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} {status}
        </StatusTag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa bài viết">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              size="small"
            >
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa bài viết">
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
              size="small"
            >
              Xóa
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleCreatePost = () => {
    setEditingPost(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingPost(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      tags: record.tags,
      image: [{ url: record.image }],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài viết này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setPosts(posts.filter(post => post.id !== record.id));
        message.success('Xóa bài viết thành công!');
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingPost) {
        setPosts(posts.map(post =>
          post.id === editingPost.id
            ? {
                ...post,
                ...values,
                image: values.image?.[0]?.url || post.image,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : post
        ));
        message.success('Cập nhật bài viết thành công!');
      } else {
        const newPost = {
          id: posts.length + 1,
          title: values.title,
          content: values.content,
          image: values.image?.[0]?.url || 'https://example.com/default-image.jpg',
          tags: values.tags || [],
          status: 'Đã đăng',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setPosts([...posts, newPost]);
        message.success('Tạo bài viết thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingPost(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  return (
    <Container>
      <Header>
        <div className="header-title">
          <FileTextOutlined />
          <Title level={2} style={{ margin: 0 }}>Quản lý Blog</Title>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreatePost}
          size="large"
        >
          Viết bài mới
        </Button>
      </Header>

      <StyledCard>
        <Table 
          columns={columns} 
          dataSource={posts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} bài viết`,
          }}
        />
      </StyledCard>

      <Modal
        title={editingPost ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingPost(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tiêu đề bài viết"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh đại diện"
            rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ fileList }) => {
                form.setFieldsValue({ image: fileList });
              }}
            >
              <div>
                <PictureOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung bài viết"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
          >
            <TextArea rows={6} placeholder="Nhập nội dung bài viết..." />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Nhập tags và nhấn Enter"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPost ? 'Cập nhật' : 'Đăng bài'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingPost(null);
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default BlogManagement; 