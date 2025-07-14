import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, Checkbox, Typography, Spin, Badge, Tooltip } from 'antd';
import styled from 'styled-components';
import { DollarOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import coachApi from '../Axios/coachApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;

const Container = styled.div`
  padding: 32px 24px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  min-height: 80vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  background: linear-gradient(90deg, #e0f2f1 60%, #b2dfdb 100%);
  padding: 20px 32px;
  border-radius: 14px;
  border: 1px solid #b2dfdb;

  .header-title {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #2c7a75;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 1px;
  }
`;

const StyledCard = styled.div`
  background: #fafdff;
  border-radius: 16px;
  padding: 32px 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const AddButton = styled(Button)`
  background: linear-gradient(90deg, #5fb8b3 60%, #2c7a75 100%);
  color: #fff !important;
  font-weight: 600;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(95,184,179,0.15);
  padding: 0 28px;
  height: 44px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover, &:focus {
    background: linear-gradient(90deg, #2c7a75 60%, #5fb8b3 100%);
    color: #fff !important;
  }
`;

const columnsConfig = (handleEdit, handleDelete) => [
  {
    title: 'Tên gói',
    dataIndex: 'packageName',
    key: 'packageName',
    render: (text) => <b style={{ color: '#2c7a75' }}>{text}</b>,
  },
  {
    title: 'Giá (VNĐ)',
    dataIndex: 'price',
    key: 'price',
    render: (v) => <span style={{ color: '#52c41a', fontWeight: 500 }}>{v.toLocaleString()}</span>,
  },
  {
    title: 'Thời hạn (ngày)',
    dataIndex: 'durationDays',
    key: 'durationDays',
    render: (v) => <span style={{ color: '#1890ff' }}>{v}</span>,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    render: (v) => <Tooltip title={v}><span style={{ color: '#555' }}>{v}</span></Tooltip>,
  },
  {
    title: 'Kích hoạt',
    dataIndex: 'active',
    key: 'active',
    render: (v) =>
      v ? (
        <Badge status="success" text="Đang bán" />
      ) : (
        <Badge status="error" text="Ngừng bán" />
      ),
    align: 'center',
  },
  {
    title: 'Hành động',
    key: 'action',
    align: 'center',
    render: (_, record) => (
      <>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{ marginRight: 8, borderRadius: 20, fontWeight: 500 }}
        >
          Sửa
        </Button>
        <Popconfirm
          title="Bạn chắc chắn muốn xóa?"
          onConfirm={() => handleDelete(record.packageID)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="primary" danger style={{ borderRadius: 20, fontWeight: 500 }}>
            Xóa
          </Button>
        </Popconfirm>
      </>
    ),
  },
];

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [form] = Form.useForm();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await coachApi.getAllPackages();
      setPackages(res.data || []);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách gói!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (editingPackage) {
      form.setFieldsValue({
        packageName: editingPackage.packageName || '',
        price: editingPackage.price || 0,
        durationDays: editingPackage.durationDays || 0,
        description: editingPackage.description || '',
        active: !!editingPackage.active,
      });
    }
  }, [editingPackage, form]);

  const handleAdd = () => {
    setEditingPackage(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingPackage(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await coachApi.deletePackage(id);
      toast.success('Xóa gói thành công!');
      fetchPackages();
    } catch {
      toast.error('Xóa gói thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        if (editingPackage) {
          await coachApi.updatePackage(editingPackage.packageID, values);
          toast.success('Cập nhật gói thành công!');
        } else {
          await coachApi.createPackage(values);
          toast.success('Thêm gói mới thành công!');
        }
        setIsModalOpen(false);
        fetchPackages();
      } catch {
        toast.error('Lưu gói thất bại!');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <Container>
      <Header>
        <div className="header-title">
          <DollarOutlined />
          <Title level={2} style={{ margin: 0, color: '#2c7a75', fontWeight: 700, letterSpacing: 1 }}>
            Quản lý gói Premium
          </Title>
        </div>
        <AddButton icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm gói mới
        </AddButton>
      </Header>
      <StyledCard>
        {loading ? (
          <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
        ) : (
          <Table
            columns={columnsConfig(handleEdit, handleDelete)}
            dataSource={packages}
            rowKey="packageID"
            pagination={{ pageSize: 6 }}
            bordered
            size="middle"
            style={{ borderRadius: 16, overflow: 'hidden' }}
          />
        )}
      </StyledCard>
      <Modal
        title={
          <span>
            <DollarOutlined style={{ color: '#5fb8b3', marginRight: 8 }} />
            {editingPackage ? 'Chỉnh sửa gói' : 'Thêm gói mới'}
          </span>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        centered
        destroyOnClose
        width={500}
        bodyStyle={{ padding: 28, paddingTop: 12 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="packageName" label="Tên gói" rules={[{ required: true, message: 'Nhập tên gói!' }]}> 
            <Input placeholder="Nhập tên gói" /> 
          </Form.Item>
          <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Nhập giá!' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập giá" /> 
          </Form.Item>
          <Form.Item name="durationDays" label="Thời hạn (ngày)" rules={[{ required: true, message: 'Nhập thời hạn!' }]}> 
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số ngày" /> 
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Nhập mô tả!' }]}> 
            <Input.TextArea rows={3} placeholder="Nhập mô tả gói" /> 
          </Form.Item>
          <Form.Item name="active" label="Kích hoạt" valuePropName="checked">
            <Checkbox> Có</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </Container>
  );
};

export default PackageManagement; 