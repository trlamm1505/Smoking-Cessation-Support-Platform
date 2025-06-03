import React, { useState } from 'react';
import { Typography, Card, Form, Input, DatePicker, Button, Table, Space, Modal, message, Tag, Tooltip } from 'antd';
import styled from 'styled-components';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

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

const ReportPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'Báo cáo tháng 3/2024',
      period: ['2024-03-01', '2024-03-31'],
      content: 'Tổng kết hoạt động tư vấn và tiến độ của học viên trong tháng 3',
      status: 'Đã gửi',
      createdAt: '2024-03-31',
    },
  ]);

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

  return (
    <Container>
      <Header>
        <div className="header-title">
          <FileTextOutlined />
          <Title level={2} style={{ margin: 0 }}>Báo cáo tiến độ định kỳ</Title>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateReport}
          size="large"
        >
          Tạo báo cáo mới
        </Button>
      </Header>

      <StyledCard>
        <Table 
          columns={columns} 
          dataSource={reports}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} báo cáo`,
          }}
        />
      </StyledCard>

      <Modal
        title={editingReport ? "Sửa báo cáo" : "Tạo báo cáo mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingReport(null);
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
            label="Tiêu đề báo cáo"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề báo cáo!' }]}
          >
            <Input placeholder="Nhập tiêu đề báo cáo" />
          </Form.Item>

          <Form.Item
            name="period"
            label="Thời gian báo cáo"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian báo cáo!' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung báo cáo"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung báo cáo!' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Nhập nội dung báo cáo chi tiết..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingReport ? 'Cập nhật' : 'Gửi báo cáo'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingReport(null);
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

export default ReportPage; 