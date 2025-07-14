import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Table, Button, Space, Modal, Form, Input, Select, Statistic, Row, Col, Tabs } from 'antd';
import {
    DashboardOutlined,
    FileTextOutlined,
    TeamOutlined,
    DollarOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    BarChartOutlined,
    UserOutlined,
    BookOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import UserCoachManagement from './UserCoachManagement';
import coachApi from '../Axios/coachApi';
import AdminCallManagement from './AdminCallManagement';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const Logo = styled.div`
  height: 64px;
  padding: 16px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  background: #001529;
`;

const StyledContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
`;

const StatisticCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Admin = () => {
    const [selectedKey, setSelectedKey] = useState('1');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [form] = Form.useForm();

    // Tổng quan: fetch API
    const [revenueTotal, setRevenueTotal] = useState(0);
    const [revenueSubscribers, setRevenueSubscribers] = useState(0);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        setLoadingStats(true);
        Promise.all([
            coachApi.getRevenueTotal(),
            coachApi.getRevenueSubscribers()
        ])
        .then(([
            revenueTotalRes,
            revenueSubscribersRes
        ]) => {
            setRevenueTotal(revenueTotalRes.data);
            setRevenueSubscribers(revenueSubscribersRes.data);
        })
        .catch(() => {})
        .finally(() => setLoadingStats(false));
    }, []);

    // Mock data for community posts
    const communityPosts = [
        {
            id: 1,
            author: 'Nguyễn Văn A',
            content: 'Vừa đạt được 7 ngày không hút thuốc!',
            likes: 12,
            comments: 5,
            status: 'active'
        },
        // Add more mock data as needed
    ];

    // Mock data for blog posts
    const blogPosts = [
        {
            id: 1,
            title: 'Top 10 Phương Pháp Cai Thuốc Lá',
            author: 'TS. Nguyễn Văn A',
            views: 1520,
            status: 'published'
        },
        // Add more mock data as needed
    ];

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

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

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return (
                    <>
                        <Title level={2}>Tổng Quan</Title>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <StatisticCard>
                                    <Statistic
                                        title="Tổng Doanh Thu"
                                        value={revenueTotal}
                                        prefix={<DollarOutlined />}
                                        suffix="VNĐ"
                                        loading={loadingStats}
                                    />
                                </StatisticCard>
                            </Col>
                            <Col span={8}>
                                <StatisticCard>
                                    <Statistic
                                        title="Tổng Người Dùng Premium"
                                        value={revenueSubscribers}
                                        prefix={<UserOutlined />}
                                        loading={loadingStats}
                                    />
                                </StatisticCard>
                            </Col>
                        </Row>
                    </>
                );
            case '2':
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Title level={2}>Quản lý bài viết cộng đồng</Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('community')}>
                                Thêm bài viết
                            </Button>
                        </div>
                        <Table
                            dataSource={communityPosts}
                            columns={[
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
                                },
                                {
                                    title: 'Thao tác',
                                    key: 'action',
                                    render: (_, record) => (
                                        <Space>
                                            <Button icon={<EditOutlined />} onClick={() => showModal('edit-community')} />
                                            <Button icon={<DeleteOutlined />} danger />
                                        </Space>
                                    ),
                                },
                            ]}
                        />
                    </>
                );
            case '3':
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Title level={2}>Quản lý blog</Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('blog')}>
                                Thêm bài viết
                            </Button>
                        </div>
                        <Table
                            dataSource={blogPosts}
                            columns={[
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
                                },
                                {
                                    title: 'Thao tác',
                                    key: 'action',
                                    render: (_, record) => (
                                        <Space>
                                            <Button icon={<EditOutlined />} onClick={() => showModal('edit-blog')} />
                                            <Button icon={<DeleteOutlined />} danger />
                                        </Space>
                                    ),
                                },
                            ]}
                        />
                    </>
                );
            case '4':
                return (
                    <>
                        <Title level={2}>Thống kê doanh thu</Title>
                        <Card>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Theo ngày" key="1">
                                    {/* Add daily revenue chart here */}
                                </TabPane>
                                <TabPane tab="Theo tháng" key="2">
                                    {/* Add monthly revenue chart here */}
                                </TabPane>
                                <TabPane tab="Theo năm" key="3">
                                    {/* Add yearly revenue chart here */}
                                </TabPane>
                            </Tabs>
                        </Card>
                    </>
                );
            case 'user-coach':
                return <UserCoachManagement />;
            case 'calls':
                return <AdminCallManagement />;
            default:
                return null;
        }
    };

    return (
        <StyledLayout>
            <Sider width={250}>
                <Logo>Admin Dashboard</Logo>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                >
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        Tổng quan
                    </Menu.Item>
                    <Menu.Item key="2" icon={<TeamOutlined />}>
                        Quản lý bài viết cộng đồng
                    </Menu.Item>
                    <Menu.Item key="3" icon={<BookOutlined />}>
                        Quản lý blog
                    </Menu.Item>
                    <Menu.Item key="4" icon={<DollarOutlined />}>
                        Thống kê doanh thu
                    </Menu.Item>
                    <Menu.Item key="user-coach" icon={<UserOutlined />}>
                        Quản lý người dùng & coach
                    </Menu.Item>
                    <Menu.Item key="calls" icon={<BarChartOutlined />}>
                        Quản lý cuộc gọi
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }} />
                <StyledContent>
                    {renderContent()}
                </StyledContent>
            </Layout>

            <Modal
                title={modalType === 'community' ? 'Thêm bài viết cộng đồng' : 'Thêm bài viết blog'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={800}
            >
                <Form form={form} layout="vertical">
                    {modalType === 'community' ? (
                        <>
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
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </Form>
            </Modal>
        </StyledLayout>
    );
};

export default Admin; 