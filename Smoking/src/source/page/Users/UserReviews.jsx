import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Select, Input, Typography, Popconfirm, Modal, Form } from 'antd';
import { StarOutlined, UserOutlined, AppstoreOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import userApi from '../Axios/userAxios';
import { message } from 'antd';
import coachApi from '../Axios/coachApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;
const { Option } = Select;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedCard = styled(Card)`
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
  border-radius: 12px;
`;

const PageContainer = styled.div`
  padding: 24px;
  background: #e8f4f3;
  min-height: 100vh;

  .page-title {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1a1a1a;
    .anticon {
      color: #5FB8B3;
      font-size: 28px;
      animation: shine 2s infinite;
    }
    @keyframes shine {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  gap: 16px;
`;

const ToggleButton = styled(Button)`
  font-weight: 600;
  border-radius: 8px !important;
  padding: 0 24px;
  height: 40px;
  display: flex;
  align-items: center;
  background: ${({ active }) => (active ? 'linear-gradient(90deg, #5FB8B3 30%, #1890ff 100%)' : '#f0f0f0')};
  color: ${({ active }) => (active ? 'white' : '#666')};
  border: none;
  &:hover, &:focus {
    background: ${({ active }) => (active ? 'linear-gradient(90deg, #1890ff 10%, #5FB8B3 90%)' : '#e0e0e0')};
    color: ${({ active }) => (active ? 'white' : '#1890ff')};
  }
`;

const ReviewForm = styled.div`
  .ant-form-item-label > label {
    color: #2c7a75;
    font-weight: 500;
    font-size: 15px;
  }
  .ant-input, .ant-select-selector, .ant-input-number {
    border-radius: 8px !important;
    border: 1px solid #E3F6F5 !important;
    padding: 8px 12px;
    height: auto;
    transition: all 0.3s ease;
    &:hover, &:focus {
      border-color: #5FB8B3 !important;
      box-shadow: 0 0 0 2px rgba(95, 184, 179, 0.1);
    }
  }
`;

const Star = () => <span style={{ color: '#FFD700', fontSize: '1.2em', marginRight: 2 }}>★</span>;

const AnimatedToggleContainer = styled(ToggleContainer)`
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const UserReviews = () => {
    const [coachReviews, setCoachReviews] = useState([]);
    const [systemReviews, setSystemReviews] = useState([]);
    const [coachesForReview, setCoachesForReview] = useState([]);
    const [activeReviewType, setActiveReviewType] = useState('coach');
    const [coachReviewForm, setCoachReviewForm] = useState({ coachId: '', rating: 0, comment: '', title: '' });
    const [systemReviewForm, setSystemReviewForm] = useState({ rating: 0, comment: '' });
    const [loading, setLoading] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const userId = Number(localStorage.getItem('userId'));

    // Fetch feedbacks for coach
    useEffect(() => {
        if (activeReviewType === 'coach') {
            setLoading(true);
            userApi.getFeedbacks({ targetType: 'coach', userId }).then(res => {
                setCoachReviews((res.data || []).map(fb => ({ ...fb, id: fb.feedbackId })));
            }).catch(() => message.error('Lỗi tải feedback')).finally(() => setLoading(false));
        }
    }, [activeReviewType, userId]);

    // Lấy danh sách coach thực tế
    useEffect(() => {
        coachApi.getAll().then(res => {
            // Giả sử mỗi coach có id: coachId hoặc id, tên: fullName hoặc name
            setCoachesForReview((res.data || []).map(c => ({
                id: c.coachId || c.id,
                name: c.fullName || c.name || c.username || 'Coach',
            })));
        });
    }, []);

    // Fetch feedbacks for system
    useEffect(() => {
        if (activeReviewType === 'system') {
            setLoading(true);
            userApi.getFeedbacks({ targetType: 'system', userId }).then(res => {
                setSystemReviews((res.data || []).map(fb => ({ ...fb, id: fb.feedbackId })));
            }).catch(() => message.error('Lỗi tải feedback hệ thống')).finally(() => setLoading(false));
        }
    }, [activeReviewType, userId]);

    // Gửi feedback mới hoặc cập nhật
    const handleSubmitCoachReview = (values) => {
        if (editingReview) {
            userApi.updateFeedback(editingReview.id, {
                ...editingReview,
                ...values,
                userId,
                targetType: 'coach',
                targetId: values.coachId,
            }).then(() => {
                toast.success('Cập nhật feedback thành công!');
                setEditingReview(null);
                setIsModalVisible(false);
                setCoachReviewForm({ coachId: '', rating: 0, comment: '', title: '' });
                // Reload
                userApi.getFeedbacks({ targetType: 'coach', userId }).then(res => setCoachReviews((res.data || []).map(fb => ({ ...fb, id: fb.feedbackId }))));
            });
        } else {
            userApi.createFeedback({
                userId,
                targetType: 'coach',
                targetId: values.coachId,
                rating: values.rating,
                comment: values.comment,
                title: values.title || '',
                status: 'active',
            }).then(() => {
                toast.success('Gửi feedback thành công!');
                setIsModalVisible(false);
                setCoachReviewForm({ coachId: '', rating: 0, comment: '', title: '' });
                userApi.getFeedbacks({ targetType: 'coach', userId }).then(res => setCoachReviews((res.data || []).map(fb => ({ ...fb, id: fb.feedbackId }))));
            });
        }
    };

    // Xóa feedback
    const handleDeleteFeedback = (id) => {
        userApi.deleteFeedback(id).then(() => {
            toast.success('Xóa feedback thành công!');
            userApi.getFeedbacks({ targetType: 'coach', userId }).then(res => setCoachReviews((res.data || []).map(fb => ({ ...fb, id: fb.feedbackId }))));
        });
    };

    // Sửa feedback
    const handleEditFeedback = (record) => {
        setEditingReview(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            coachId: record.targetId,
            rating: record.rating,
            comment: record.comment,
            title: record.title,
        });
    };

    // Hiển thị form modal
    const showModal = () => {
        setEditingReview(null);
        setIsModalVisible(true);
        form.resetFields();
    };

    // Gửi feedback hệ thống mới hoặc cập nhật
    const [editingSystemReview, setEditingSystemReview] = useState(null);
    const [isSystemModalVisible, setIsSystemModalVisible] = useState(false);
    const [systemForm] = Form.useForm();
    const handleSubmitSystemReview = (values) => {
        if (editingSystemReview) {
            userApi.updateFeedback(editingSystemReview.id, {
                ...editingSystemReview,
                ...values,
                userId,
                targetType: 'system',
                targetId: 0,
            }).then(() => {
                toast.success('Cập nhật feedback hệ thống thành công!');
                setEditingSystemReview(null);
                setIsSystemModalVisible(false);
                systemForm.resetFields();
                userApi.getFeedbacks({ targetType: 'system', userId }).then(res => setSystemReviews((res.data || []).map(fb => ({ ...fb, id: fb.feedbackId }))));
            });
        } else {
            userApi.createFeedback({
                userId,
                targetType: 'system',
                targetId: 0,
                rating: values.rating,
                comment: values.comment,
                title: values.title || '',
                status: 'active',
            }).then(() => {
                toast.success('Gửi feedback hệ thống thành công!');
                setIsSystemModalVisible(false);
                systemForm.resetFields();
                userApi.getFeedbacks({ targetType: 'system', userId }).then(res => setSystemReviews((res.data || []).map(fb => ({ ...fb, id: fb.feedbackId }))));
            });
        }
    };
    // Xóa feedback hệ thống
    const handleDeleteSystemFeedback = (id) => {
        userApi.deleteFeedback(id).then(() => {
            toast.success('Xóa feedback hệ thống thành công!');
            userApi.getFeedbacks({ targetType: 'system', userId }).then(res => setSystemReviews((res.data || []).map(fb => ({ ...fb, id: fb.feedbackId }))));
        });
    };
    // Sửa feedback hệ thống
    const handleEditSystemFeedback = (record) => {
        setEditingSystemReview(record);
        setIsSystemModalVisible(true);
        systemForm.setFieldsValue({
            rating: record.rating,
            comment: record.comment,
            title: record.title,
        });
    };
    // Hiển thị form modal system
    const showSystemModal = () => {
        setEditingSystemReview(null);
        setIsSystemModalVisible(true);
        systemForm.resetFields();
    };
    // Columns cho feedback hệ thống
    const systemColumns = [
        {
            title: 'Số sao',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => <>{Array.from({ length: rating }, (_, i) => <Star key={i} />)}</>,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Nội dung',
            dataIndex: 'comment',
            key: 'comment',
        },
    ];

    // Columns cho feedback coach
    const coachColumns = [
        {
            title: 'Huấn luyện viên',
            dataIndex: 'targetId',
            key: 'coachName',
            render: (id) => {
                const coach = coachesForReview.find(c => c.id === id);
                return coach ? coach.name : id;
            }
        },
        {
            title: 'Số sao',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => <>{Array.from({ length: rating }, (_, i) => <Star key={i} />)}</>,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Nội dung',
            dataIndex: 'comment',
            key: 'comment',
        },
    ];

    return (
        <PageContainer>
            <ToastContainer position="top-right" autoClose={2000} />
            <Title level={2} className="page-title">
                <StarOutlined /> Đánh Giá Của Tôi
            </Title>
            <AnimatedToggleContainer>
                <ToggleButton
                    active={activeReviewType === 'coach'}
                    onClick={() => setActiveReviewType('coach')}
                >
                    <UserOutlined style={{ marginRight: 8 }} /> Đánh giá Huấn luyện viên
                </ToggleButton>
                <ToggleButton
                    active={activeReviewType === 'system'}
                    onClick={() => setActiveReviewType('system')}
                >
                    <AppstoreOutlined style={{ marginRight: 8 }} /> Đánh giá Hệ thống
                </ToggleButton>
            </AnimatedToggleContainer>

            {activeReviewType === 'coach' && (
                <>
                    <Button type="primary" style={{ marginBottom: 16 }} onClick={showModal} icon={<PlusOutlined />}>Gửi feedback mới</Button>
            <AnimatedCard
                        title={<span><UserOutlined style={{ color: '#5FB8B3', marginRight: 8 }} />Lịch sử feedback Huấn luyện viên</span>}
                        style={{ borderRadius: 12 }}
                delay="0.5s"
            >
                        <Table
                            columns={coachColumns}
                            dataSource={coachReviews
                                .filter(fb => fb.targetType === 'coach' && fb.userId === userId)
                                .slice()
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            }
                            rowKey="id"
                            loading={loading}
                            locale={{ emptyText: 'Chưa có feedback nào' }}
                            pagination={{ pageSize: 5 }}
                        />
                    </AnimatedCard>
                    <Modal
                        title={editingReview ? 'Sửa feedback' : 'Gửi feedback mới'}
                        open={isModalVisible}
                        onCancel={() => { setIsModalVisible(false); setEditingReview(null); }}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={coachReviewForm}
                            onFinish={handleSubmitCoachReview}
                        >
                            <Form.Item
                                name="coachId"
                                label="Chọn Huấn luyện viên"
                                rules={[{ required: true, message: 'Vui lòng chọn huấn luyện viên!' }]}
                            >
                                <Select placeholder="-- Chọn huấn luyện viên --">
                                    {coachesForReview.map(coach => (
                                        <Option key={coach.id} value={coach.id}>{coach.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="rating"
                                label="Số sao (1-5)"
                                rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                            >
                                <Select placeholder="Chọn số sao">
                                    {[1, 2, 3, 4, 5].map(star => <Option key={star} value={star}>{Array.from({ length: star }, (_, i) => <Star key={i} />)}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                rules={[{ required: false }]}
                            >
                                <Input placeholder="Nhập tiêu đề (nếu có)" />
                            </Form.Item>
                            <Form.Item
                                name="comment"
                                label="Nội dung đánh giá"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn với huấn luyện viên..." />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    {editingReview ? 'Cập nhật' : 'Gửi feedback'}
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={() => { setIsModalVisible(false); setEditingReview(null); }}>Hủy</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                        </>
                    )}

            {activeReviewType === 'system' && (
                <>
                    <Button type="primary" style={{ marginBottom: 16 }} onClick={showSystemModal} icon={<PlusOutlined />}>Gửi feedback hệ thống</Button>
            <AnimatedCard
                        title={<span><AppstoreOutlined style={{ color: '#5FB8B3', marginRight: 8 }} />Lịch sử feedback hệ thống</span>}
                style={{ borderRadius: 12 }}
                delay="0.5s"
            >
                <Table
                            columns={systemColumns}
                            dataSource={systemReviews
                                .filter(fb => fb.targetType === 'system' && fb.userId === userId)
                                .slice()
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            }
                    rowKey="id"
                            loading={loading}
                            locale={{ emptyText: 'Chưa có feedback nào' }}
                    pagination={{ pageSize: 5 }}
                />
            </AnimatedCard>
                    <Modal
                        title={editingSystemReview ? 'Sửa feedback hệ thống' : 'Gửi feedback hệ thống'}
                        open={isSystemModalVisible}
                        onCancel={() => { setIsSystemModalVisible(false); setEditingSystemReview(null); }}
                        footer={null}
                    >
                        <Form
                            form={systemForm}
                            layout="vertical"
                            onFinish={handleSubmitSystemReview}
                        >
                            <Form.Item
                                name="rating"
                                label="Số sao (1-5)"
                                rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                            >
                                <Select placeholder="Chọn số sao">
                                    {[1, 2, 3, 4, 5].map(star => <Option key={star} value={star}>{Array.from({ length: star }, (_, i) => <Star key={i} />)}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                rules={[{ required: false }]}
                            >
                                <Input placeholder="Nhập tiêu đề (nếu có)" />
                            </Form.Item>
                            <Form.Item
                                name="comment"
                                label="Nội dung feedback"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn với hệ thống..." />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    {editingSystemReview ? 'Cập nhật' : 'Gửi feedback'}
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={() => { setIsSystemModalVisible(false); setEditingSystemReview(null); }}>Hủy</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </PageContainer>
    );
};

export default UserReviews;