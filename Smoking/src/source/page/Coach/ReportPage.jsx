import React, { useState, useEffect } from 'react';
import { Typography, Card, Form, Input, DatePicker, Button, Table, Space, Modal, message, Tag, Tooltip, Select } from 'antd';
import styled from 'styled-components';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import userApi from '../Axios/userAxios';
import coachApi from '../Axios/coachApi';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

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

const StatusTag = styled(Tag)`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
`;

// Style cho nút Sửa giống UserReviews
const EditButton = styled(Button)`
  background: linear-gradient(90deg, #f9d923 0%, #f8b400 100%) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 6px !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(249,217,35,0.08);
`;

const ReportPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [isSystemModal, setIsSystemModal] = useState(false);
  const [systemForm] = Form.useForm();
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemFeedbacks, setSystemFeedbacks] = useState([]);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [feedbackForm] = Form.useForm();
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [mySystemFeedbacks, setMySystemFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  // Get current coach ID
  const currentCoachId = Number(localStorage.getItem('coachId') || localStorage.getItem('userId'));

  // Lấy feedback thực tế và tên user
  useEffect(() => {
    userApi.getAll().then(res => {
      setUsers(res.data || []);
    });
    userApi.getFeedbacks({ targetType: 'coach' }).then(res => {
      setFeedbacks(res.data || []);
    });
  }, []);

  // Lấy feedback hệ thống (từ tất cả user/coach) và danh sách user/coach
  useEffect(() => {
    userApi.getAll().then(res => {
      setUsers(res.data || []);
    });
    userApi.getFeedbacks({ targetType: 'system' }).then(res => {
      setSystemFeedbacks(res.data || []);
      // Lọc feedback hệ thống của coach hiện tại
      const myId = Number(localStorage.getItem('userId'));
      setMySystemFeedbacks((res.data || []).filter(fb => fb.userId === myId));
    });
  }, []);

  const columns = [
    {
      title: 'Tiêu đề báo cáo',
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
      title: 'Thời gian',
      dataIndex: 'period',
      key: 'period',
      render: (period) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#5FB8B3' }} />
          <Text>{`${dayjs(period[0]).format('DD/MM/YYYY')} - ${dayjs(period[1]).format('DD/MM/YYYY')}`}</Text>
        </Space>
      ),
    },
    {
      title: 'Nội dung tóm tắt',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <StatusTag color={status === 'Đã gửi' ? 'success' : 'processing'}>
          {status === 'Đã gửi' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} {status}
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
          <Tooltip title="Sửa báo cáo">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              size="small"
            >
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa báo cáo">
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

  const handleCreateReport = () => {
    setEditingReport(null);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingReport) {
        // Update existing report
        const updatedReports = reports.map(report => 
          report.id === editingReport.id 
            ? {
                ...report,
                title: values.title,
                period: values.period.map(date => date.format('YYYY-MM-DD')),
                content: values.content,
              }
            : report
        );
        setReports(updatedReports);
        message.success('Cập nhật báo cáo thành công!');
      } else {
        // Create new report
        const newReport = {
          id: reports.length + 1,
          title: values.title,
          period: values.period.map(date => date.format('YYYY-MM-DD')),
          content: values.content,
          status: 'Đã gửi',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setReports([...reports, newReport]);
        message.success('Tạo báo cáo thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingReport(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (record) => {
    setEditingReport(record);
    form.setFieldsValue({
      title: record.title,
      period: [dayjs(record.period[0]), dayjs(record.period[1])],
      content: record.content,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa báo cáo này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setReports(reports.filter(report => report.id !== record.id));
        message.success('Xóa báo cáo thành công!');
      },
    });
  };

  // Gửi feedback hệ thống (coach gửi)
  const handleSendSystemFeedback = (values) => {
    setSendingFeedback(true);
    const myId = Number(localStorage.getItem('userId'));
    userApi.createFeedback({
      userId: myId,
      targetType: 'system',
      targetId: 0,
      rating: values.rating,
      comment: values.comment,
      title: values.title || '',
      status: 'active',
    }).then(() => {
      toast.success('Gửi feedback hệ thống thành công!');
      setIsFeedbackModalVisible(false);
      feedbackForm.resetFields();
      // Cập nhật lại feedback hệ thống của coach và toàn bộ feedback hệ thống
      userApi.getFeedbacks({ targetType: 'system' }).then(res => {
        setSystemFeedbacks(res.data || []);
        setMySystemFeedbacks((res.data || []).filter(fb => fb.userId === myId));
      });
    }).finally(() => setSendingFeedback(false));
  };

  // Helper: lấy tên người gửi (user hoặc coach)
  const getSenderName = (feedback) => {
    const user = users.find(u => u.id === feedback.userId || u.userId === feedback.userId);
    if (user) return user.fullName || user.name || user.username || 'Người dùng';
    return 'Người dùng';
  };

  // Columns cho feedback hệ thống của coach (không còn thao tác sửa)
  const mySystemFeedbackColumns = [
    { title: 'Số sao', dataIndex: 'rating', key: 'rating', align: 'center', render: (rating) => <span style={{color:'#FFD700', fontSize:18}}>{'★'.repeat(rating)}</span> },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Nội dung', dataIndex: 'comment', key: 'comment', render: (text) => <span style={{color:'#333', fontSize:'15px'}}>{text}</span> },
  ];

  const userCoachFeedbackColumns = [
    { title: 'Người gửi', dataIndex: 'userFullName', key: 'userFullName', render: (name) => <span style={{fontWeight: 600, color: '#2c7a75'}}>{name || 'Người dùng'}</span> },
    { title: 'Số sao', dataIndex: 'rating', key: 'rating', align: 'center', render: (rating) => <span style={{color:'#FFD700', fontSize:18}}>{'★'.repeat(rating)}</span> },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Nội dung', dataIndex: 'comment', key: 'comment', render: (text) => <span style={{color:'#333', fontSize:'15px'}}>{text}</span> },
  ];

  // Filter feedback meant for current coach only
  const feedbacksForCurrentCoach = feedbacks.filter(fb => 
    fb.targetType === 'coach' && fb.targetId === currentCoachId
  );

  return (
    <Container>
      <Header>
        <div className="header-title">
          <FileTextOutlined />
          <Title level={2} style={{ margin: 0 }}>Báo cáo tiến độ định kỳ</Title>
        </div>
      </Header>

      {/* Nút gửi feedback hệ thống */}
        <Button 
          type="primary" 
        icon={<StarOutlined />}
        style={{ marginBottom: 16, background: 'linear-gradient(90deg, #5FB8B3 30%, #1890ff 100%)', border: 'none' }}
        onClick={() => setIsFeedbackModalVisible(true)}
      >
        Gửi feedback hệ thống
        </Button>

      {/* Bảng feedback hệ thống của coach (có thao tác) */}
      <Title level={4} style={{ color: '#2c7a75', margin: '24px 0 12px 0' }}>Feedback hệ thống của bạn</Title>
        <Table 
        columns={mySystemFeedbackColumns}
        dataSource={mySystemFeedbacks}
        rowKey={record => record.feedbackId || record.id}
        pagination={false}
        bordered
        style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}
        />

      {/* Modal gửi feedback hệ thống */}
      <Modal
        title="Gửi feedback hệ thống"
        open={isFeedbackModalVisible}
        onCancel={() => { setIsFeedbackModalVisible(false); feedbackForm.resetFields(); }}
        footer={null}
        width={600}
      >
        <Form form={feedbackForm} layout="vertical" onFinish={handleSendSystemFeedback}>
          <Form.Item name="title" label="Tiêu đề">
            <Input placeholder="Nhập tiêu đề (nếu có)" />
          </Form.Item>
          <Form.Item name="rating" label="Số sao" rules={[{ required: true, message: 'Chọn số sao!' }]}> 
            <Select placeholder="Chọn số sao">
              {[1,2,3,4,5].map(star => (
                <Select.Option key={star} value={star}>
                  <span style={{ color: '#FFD700', fontSize: 18 }}>{'★'.repeat(star)}</span>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="comment" label="Nội dung" rules={[{ required: true, message: 'Nhập nội dung!' }]}> 
            <Input.TextArea rows={4} placeholder="Nhập nội dung feedback..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={sendingFeedback}>Gửi feedback</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bảng lịch sử feedback từ người dùng gửi cho coach (không thao tác, không người gửi, không ngày gửi) */}
      <Title level={4} style={{ color: '#2c7a75', margin: '32px 0 12px 0' }}>Feedback từ người dùng</Title>
      <Table
        columns={userCoachFeedbackColumns}
        dataSource={feedbacksForCurrentCoach}
        rowKey={record => record.feedbackId || record.id}
        pagination={false}
        bordered
        style={{ borderRadius: 12, overflow: 'hidden' }}
      />

      <ToastContainer position="top-right" autoClose={2000} />
    </Container>
  );
};

export default ReportPage; 