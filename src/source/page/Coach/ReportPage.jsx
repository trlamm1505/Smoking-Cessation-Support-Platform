import React, { useState } from 'react';
import { Typography, Card, Form, Input, DatePicker, Button, Table, Space, Modal, message } from 'antd';
import styled from 'styled-components';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

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
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
`;

const ReportPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
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
    },
    {
      title: 'Thời gian',
      dataIndex: 'period',
      key: 'period',
      render: (period) => `${period[0]} - ${period[1]}`,
    },
    {
      title: 'Nội dung tóm tắt',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateReport = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
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
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo báo cáo!');
    }
  };

  const handleEdit = (record) => {
    message.info('Chức năng đang được phát triển');
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa báo cáo này?',
      onOk() {
        setReports(reports.filter(report => report.id !== record.id));
        message.success('Xóa báo cáo thành công!');
      },
    });
  };

  return (
    <Container>
      <Header>
        <Title level={2}>Báo cáo tiến độ định kỳ</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateReport}
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
        title="Tạo báo cáo mới"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
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
                Gửi báo cáo
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
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