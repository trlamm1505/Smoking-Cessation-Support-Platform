import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Tabs, message, Popconfirm, Select, Upload, Row, Col, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, TeamOutlined, LockOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import userApi from '../Axios/userAxios';
import coachApi from '../Axios/coachApi';
import { toast } from 'react-toastify';

const { TabPane } = Tabs;
const { Option } = Select;

const UserCoachManagement = () => {
  // User state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Coach state
  const [coaches, setCoaches] = useState([]);
  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [isAddCoachModal, setIsAddCoachModal] = useState(false);
  const [addCoachForm] = Form.useForm();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await userApi.getAll();
      setUsers(res.data || res);
    } catch (err) {
      message.error('Lỗi tải danh sách người dùng');
    }
    setLoadingUsers(false);
  };

  // Fetch coaches
  const fetchCoaches = async () => {
    setLoadingCoaches(true);
    try {
      const res = await coachApi.getAllAdmin();
      setCoaches(res.data || res);
    } catch (err) {
      message.error('Lỗi tải danh sách coach');
    }
    setLoadingCoaches(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchCoaches();
  }, []);

  // Xóa user
  const handleDeleteUser = async (id) => {
    try {
      await userApi.delete(id);
      toast.success('Đã xóa người dùng');
      fetchUsers();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  // Xóa coach
  const handleDeleteCoach = async (id) => {
    try {
      await coachApi.adminDelete(id);
      toast.success('Đã xóa coach');
      fetchCoaches();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  // Upload ảnh lên Cloudinary
  const handleAvatarChange = async (info) => {
    const file = info.file.originFileObj;
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
    // Upload lên Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'avatarUploadClient');
    formData.append('cloud_name', 'dp4gsczko');
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dp4gsczko/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        addCoachForm.setFieldsValue({ profilePictureUrl: data.secure_url });
        setAvatarPreview(data.secure_url);
      }
    } catch (err) {
      message.error('Lỗi upload ảnh!');
    }
  };

  // Thêm coach mới
  const handleAddCoach = async (values) => {
    try {
      await coachApi.adminCreate(values);
      toast.success('Đã thêm coach mới');
      setIsAddCoachModal(false);
      addCoachForm.resetFields();
      setAvatarPreview(null);
      setAvatarFile(null);
      fetchCoaches();
    } catch (err) {
      toast.error('Thêm coach thất bại');
      console.error('Lỗi thêm coach:', err?.response?.data || err);
    }
  };

  // Cột bảng user
  const userColumns = [
    { title: 'ID', dataIndex: 'userId', key: 'userId' },
    { title: 'Tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="Xóa người dùng này?" onConfirm={() => handleDeleteUser(record.userId)} okText="Xóa" cancelText="Hủy">
          <Button icon={<DeleteOutlined />} danger size="small">Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  // Cột bảng coach
  const coachColumns = [
    { title: 'ID', dataIndex: 'coachId', key: 'coachId' },
    { title: 'Tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Chuyên môn', dataIndex: 'specialization', key: 'specialization' },
    { title: 'Bằng cấp', dataIndex: 'degree', key: 'degree' },
    { title: 'SĐT', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="Xóa coach này?" onConfirm={() => handleDeleteCoach(record.coachId)} okText="Xóa" cancelText="Hủy">
          <Button icon={<DeleteOutlined />} danger size="small">Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="users">
        <TabPane tab={<span><UserOutlined /> Người dùng</span>} key="users">
          <Table
            dataSource={users}
            columns={userColumns}
            rowKey="userId"
            loading={loadingUsers}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab={<span><TeamOutlined /> Coach</span>} key="coaches">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: 16 }}
            onClick={() => setIsAddCoachModal(true)}
          >
            Thêm coach mới
          </Button>
          <Table
            dataSource={coaches}
            columns={coachColumns}
            rowKey="coachId"
            loading={loadingCoaches}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>

      {/* Modal thêm coach mới */}
      <Modal
        title="Thêm coach mới"
        open={isAddCoachModal}
        onCancel={() => { setIsAddCoachModal(false); setAvatarPreview(null); setAvatarFile(null); }}
        footer={null}
      >
        <Card bordered style={{ boxShadow: '0 2px 8px #f0f1f2' }}>
          <div style={{ marginBottom: 16, color: '#888', fontSize: 15 }}>
            Vui lòng nhập đầy đủ thông tin để thêm coach mới vào hệ thống. Các trường có dấu * là bắt buộc.
          </div>
          <Form
            form={addCoachForm}
            layout="vertical"
            onFinish={handleAddCoach}
          >
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email!' }]} style={{ marginBottom: 16 }}> 
                  <Input placeholder="Nhập email" prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu!' }]} style={{ marginBottom: 16 }}> 
                  <Input.Password placeholder="Nhập mật khẩu" prefix={<LockOutlined />} />
                </Form.Item>
                <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên!' }]} style={{ marginBottom: 16 }}> 
                  <Input placeholder="Nhập họ tên" />
                </Form.Item>
                <Form.Item name="specialization" label="Chuyên môn" style={{ marginBottom: 16 }}> 
                  <Input placeholder="Nhập chuyên môn" />
                </Form.Item>
                <Form.Item name="degree" label="Bằng cấp" style={{ marginBottom: 16 }}> 
                  <Input placeholder="Nhập bằng cấp" />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Số điện thoại" style={{ marginBottom: 16 }}> 
                  <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} />
                </Form.Item>
                <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Chọn giới tính!' }]} style={{ marginBottom: 16 }}> 
                  <Select placeholder="Chọn giới tính" allowClear>
                    <Option value="Nam">Nam</Option> 
                    <Option value="Nữ">Nữ</Option> 
                  </Select> 
                </Form.Item>
                <Form.Item name="address" label="Địa chỉ" style={{ marginBottom: 16 }}> 
                  <Input placeholder="Nhập địa chỉ" prefix={<HomeOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item name="experience" label="Kinh nghiệm" style={{ marginBottom: 16 }}> 
                  <Input placeholder="Nhập kinh nghiệm" />
                </Form.Item>
                <Form.Item name="rating" label="Đánh giá" style={{ marginBottom: 16 }}> 
                  <Input type="number" placeholder="Nhập đánh giá (0-5)" min={0} max={5} />
                </Form.Item>
                <Form.Item name="bio" label="Giới thiệu" style={{ marginBottom: 16 }}> 
                  <Input.TextArea rows={2} placeholder="Giới thiệu ngắn về coach" />
                </Form.Item>
                <Form.Item name="availability" label="Thời gian làm việc" style={{ marginBottom: 16 }}> 
                  <Input placeholder="Nhập thời gian làm việc" />
                </Form.Item>
                <Form.Item 
                  name="profilePictureUrl" 
                  label="Ảnh đại diện (URL)" 
                  rules={[ 
                    { required: true, message: 'Vui lòng nhập URL ảnh đại diện!' },
                    { 
                      pattern: /^(https?:\/\/).+/i, 
                      message: 'URL phải bắt đầu bằng http:// hoặc https://',
                    },
                  ]}
                  style={{ marginBottom: 16 }}
                >
                  <Input placeholder="Nhập URL ảnh đại diện" />
                </Form.Item>
                <Form.Item name="active" label="Kích hoạt" initialValue={true} style={{ marginBottom: 16 }}>
                  <Select>
                    <Option value={true}>Hoạt động</Option>
                    <Option value={false}>Không hoạt động</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} size="large" style={{ minWidth: 180 }}>
                Thêm coach
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default UserCoachManagement; 