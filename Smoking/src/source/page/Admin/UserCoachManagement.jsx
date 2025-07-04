import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Tabs, message, Popconfirm, Select, Upload, Row, Col, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, TeamOutlined, LockOutlined, PhoneOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons';
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

  // Thêm state cho preview ảnh từ link
  const [imagePreview, setImagePreview] = useState('');

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await userApi.getAll();
      // Chỉ lấy user có role là 'member'
      const filteredUsers = (res.data || res).filter(u => u.role === 'member');
      // Lấy thông tin gói cho từng user
      const usersWithPackage = await Promise.all(filteredUsers.map(async (user) => {
        try {
          const pkgRes = await fetch(`http://localhost:8080/api/payments/current-package/${user.userId}`);
          if (!pkgRes.ok) return { ...user, endDate: null };
          const pkg = await pkgRes.json();
          return { ...user, endDate: pkg?.endDate || null };
        } catch {
          return { ...user, endDate: null };
        }
      }));
      setUsers(usersWithPackage);
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
      const user = users.find(u => u.userId === id);
      if (user && user.endDate) {
        const now = new Date();
        const end = new Date(user.endDate);
        if (end > now) {
          toast.error('Không thể xóa người dùng khi gói Premium chưa hết hạn!');
          return;
        }
      }
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
      // Tìm coach trước khi xóa để lấy userId
      const coach = coaches.find(c => c.coachId === id);
      if (!coach) {
        toast.error('Không tìm thấy coach');
        return;
      }

      // Xóa coach trước
      await coachApi.adminDelete(id);

      // Xóa user tương ứng nếu có userId
      if (coach.userId) {
        await userApi.delete(coach.userId);
      }

      toast.success('Đã xóa coach');
      // Cập nhật cả 2 danh sách
      fetchCoaches();
      fetchUsers();
    } catch (err) {
      console.error('Lỗi xóa coach:', err);
      toast.error('Xóa thất bại');
    }
  };

  // Thêm coach mới
  const handleAddCoach = async (values) => {
    try {
      await coachApi.adminCreate(values);
      toast.success('Đã thêm coach mới');
      setIsAddCoachModal(false);
      addCoachForm.resetFields();
      fetchCoaches();
    } catch (err) {
      toast.error('Thêm coach thất bại');
      console.error('Lỗi thêm coach:', err?.response?.data || err);
    }
  };

  // Khi nhập URL ảnh đại diện, tự động preview nếu hợp lệ
  const handleProfilePictureUrlChange = (e) => {
    const url = e.target.value;
    addCoachForm.setFieldsValue({ profilePictureUrl: url });
    if (/^(https?:\/\/).+\.(jpg|jpeg|png|webp|gif)$/i.test(url)) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  // Cột bảng user
  const userColumns = [
    { title: 'ID', dataIndex: 'userId', key: 'userId' },
    { title: 'Tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role' },
    {
      title: 'Ngày kết thúc gói', dataIndex: 'endDate', key: 'endDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Xóa người dùng này?"
          onConfirm={() => handleDeleteUser(record.userId)}
          okText="Xóa"
          cancelText="Hủy"
        >
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
        <Popconfirm
          title="Xóa coach này?"
          description=""
          onConfirm={() => handleDeleteCoach(record.coachId)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button icon={<DeleteOutlined />} danger size="small">Xóa</Button>
        </Popconfirm>
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
        }}>Quản lý Người dùng & Coach</h1>
      </Card>
      <Tabs defaultActiveKey="users" tabBarStyle={{ fontSize: 22, fontWeight: 700, color: '#38b2ac' }} style={{ maxWidth: 1100, margin: '0 auto' }}>
        <TabPane tab={<span><UserOutlined style={{ color: '#4fd1c5', fontSize: 26 }} /> Người dùng</span>} key="users">
          <Card bordered style={{ borderRadius: 24, boxShadow: '0 4px 24px #e6f9f7', marginBottom: 32, border: '1.5px solid #4fd1c5', overflow: 'hidden' }}>
            <Table
              dataSource={users
                .slice()
                .sort((a, b) => {
                  if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
                  return (b.userId || 0) - (a.userId || 0);
                })
              }
              columns={userColumns}
              rowKey="userId"
              loading={loadingUsers}
              pagination={{ pageSize: 10 }}
              bordered
              size="large"
              style={{ borderRadius: 18 }}
              rowClassName={() => 'custom-table-row'}
              title={() => <span style={{ color: '#4fd1c5', fontWeight: 800, fontSize: 24, letterSpacing: 1 }}>Danh sách người dùng</span>}
            />
          </Card>
        </TabPane>
        <TabPane tab={<span><TeamOutlined style={{ color: '#4fd1c5', fontSize: 26 }} /> Coach</span>} key="coaches">
          <Card bordered style={{ borderRadius: 24, boxShadow: '0 4px 24px #e6f9f7', marginBottom: 32, border: '1.5px solid #4fd1c5', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
              <Button
                type="primary"
                icon={<PlusOutlined style={{ fontSize: 22 }} />}
                style={{
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
                onClick={() => setIsAddCoachModal(true)}
              >
                Thêm coach mới
              </Button>
            </div>
            <Table
              dataSource={coaches
                .slice()
                .sort((a, b) => {
                  if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
                  return (b.coachId || 0) - (a.coachId || 0);
                })
              }
              columns={coachColumns}
              rowKey="coachId"
              loading={loadingCoaches}
              pagination={{ pageSize: 10 }}
              bordered
              size="large"
              style={{ borderRadius: 18 }}
              rowClassName={() => 'custom-table-row'}
              title={() => <span style={{ color: '#4fd1c5', fontWeight: 800, fontSize: 24, letterSpacing: 1 }}>Danh sách coach</span>}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal thêm coach mới */}
      <Modal
        title={<div style={{
          textAlign: 'center',
          background: 'linear-gradient(90deg, #4fd1c5 0%, #38b2ac 100%)',
          color: '#fff',
          fontWeight: 900,
          fontSize: 28,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '18px 0 10px 0',
          margin: '-24px -24px 0 -24px',
        }}>Thêm coach mới</div>}
        open={isAddCoachModal}
        onCancel={() => { setIsAddCoachModal(false); setImagePreview(''); }}
        footer={null}
        bodyStyle={{ padding: 0, borderRadius: 24 }}
        style={{ top: 40 }}
      >
        <Card bordered style={{ boxShadow: '0 4px 24px #e6f9f7', borderRadius: 24, padding: 0, background: '#fafdff' }}>
          <div style={{ margin: '24px 0 24px 0', color: '#38b2ac', fontSize: 18, textAlign: 'center', fontWeight: 600 }}>
            Vui lòng nhập đầy đủ thông tin để thêm coach mới vào hệ thống.<br />Các trường có dấu <span style={{ color: 'red' }}>*</span> là bắt buộc.
          </div>
          <Form
            form={addCoachForm}
            layout="vertical"
            onFinish={handleAddCoach}
            style={{ padding: '0 24px 16px 24px' }}
          >
            <Row gutter={32}>
              <Col xs={24} sm={24} md={12} style={{ borderRight: '1.5px solid #e6f9f7', paddingRight: 24 }}>
                <Form.Item name="email" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Email <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: 'Nhập email!' }]} style={{ marginBottom: 20 }}>
                  <Input placeholder="Nhập email" prefix={<UserOutlined />} style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
                <Form.Item name="password" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Mật khẩu <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: 'Nhập mật khẩu!' }]} style={{ marginBottom: 20 }}>
                  <Input.Password placeholder="Nhập mật khẩu" prefix={<LockOutlined />} style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
                <Form.Item name="fullName" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Họ tên <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: 'Nhập họ tên!' }]} style={{ marginBottom: 20 }}>
                  <Input placeholder="Nhập họ tên" style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
                <Form.Item name="specialization" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Chuyên môn</span>} style={{ marginBottom: 20 }}>
                  <Input placeholder="Nhập chuyên môn" style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
                <Form.Item name="degree" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Bằng cấp</span>} style={{ marginBottom: 20 }}>
                  <Input placeholder="Nhập bằng cấp" style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
                <Form.Item name="phoneNumber" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Số điện thoại</span>} style={{ marginBottom: 20 }}>
                  <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
                <Form.Item name="gender" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Giới tính <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: 'Chọn giới tính!' }]} style={{ marginBottom: 20 }}>
                  <Select placeholder="Chọn giới tính" allowClear style={{ borderRadius: 16, fontSize: 16 }}>
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="address" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Địa chỉ</span>} style={{ marginBottom: 20 }}>
                  <Input placeholder="Nhập địa chỉ" prefix={<HomeOutlined />} style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} style={{ paddingLeft: 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Form.Item name="experience" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Kinh nghiệm</span>} style={{ marginBottom: 20 }}>
                  <Input placeholder="Nhập kinh nghiệm" style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
                <Form.Item name="rating" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Đánh giá</span>} style={{ marginBottom: 20 }}>
                  <Input type="number" placeholder="Nhập đánh giá (0-5)" min={0} max={5} style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
                <Form.Item name="bio" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Giới thiệu</span>} style={{ marginBottom: 20 }}>
                  <Input.TextArea rows={2} placeholder="Giới thiệu ngắn về coach" style={{ borderRadius: 16, fontSize: 16 }} />
                </Form.Item>
                <Form.Item name="availability" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Thời gian làm việc</span>} style={{ marginBottom: 20 }}>
                  <Input placeholder="Nhập thời gian làm việc" style={{ borderRadius: 16, height: 44, fontSize: 16 }} />
                </Form.Item>
                <Form.Item
                  name="profilePictureUrl"
                  label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Ảnh đại diện (URL) <span style={{ color: 'red' }}>*</span></span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập URL ảnh đại diện!' },
                    {
                      pattern: /^(https?:\/\/).+/i,
                      message: 'URL phải bắt đầu bằng http:// hoặc https://',
                    },
                  ]}
                  style={{ marginBottom: 20 }}
                >
                  <Input
                    placeholder="Nhập URL ảnh đại diện"
                    style={{ borderRadius: 16, height: 44, fontSize: 16 }}
                    onChange={handleProfilePictureUrlChange}
                  />
                  {imagePreview && (
                    <div style={{ marginTop: 10, textAlign: 'center' }}>
                      <img
                        src={imagePreview}
                        alt="preview"
                        style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '2px solid #4fd1c5', boxShadow: '0 2px 8px #4fd1c544' }}
                      />
                    </div>
                  )}
                </Form.Item>
                <Form.Item name="active" label={<span style={{ color: '#38b2ac', fontWeight: 700, fontSize: 17 }}>Kích hoạt</span>} initialValue={true} style={{ marginBottom: 20 }}>
                  <Select style={{ borderRadius: 16, fontSize: 16 }}>
                    <Option value={true}>Hoạt động</Option>
                    <Option value={false}>Không hoạt động</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ textAlign: 'center', marginTop: 32 }}>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined style={{ fontSize: 22 }} />} size="large" style={{ minWidth: 200, background: 'linear-gradient(90deg, #4fd1c5 0%, #38b2ac 100%)', borderColor: '#4fd1c5', fontWeight: 800, borderRadius: 32, height: 50, fontSize: 20, boxShadow: '0 2px 8px #4fd1c544' }}>
                Thêm coach
              </Button>
            </Form.Item>
          </Form>
        </Card>
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

export default UserCoachManagement; 