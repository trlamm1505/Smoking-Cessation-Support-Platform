import React, { useState } from 'react';
import { Card, Button, Table, Select, Input, Typography } from 'antd';
import { StarOutlined, UserOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

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
    // No sample data by default
    const [coachReviews, setCoachReviews] = useState([]);
    const [systemReviews, setSystemReviews] = useState([]);
    const [coachesForReview] = useState([
        { id: 1, name: 'Huấn luyện viên A' },
        { id: 2, name: 'Huấn luyện viên B' },
        { id: 3, name: 'Huấn luyện viên C' },
    ]);
    const [activeReviewType, setActiveReviewType] = useState('coach');
    const [coachReviewForm, setCoachReviewForm] = useState({ coachId: '', rating: 0, comment: '' });
    const [systemReviewForm, setSystemReviewForm] = useState({ rating: 0, comment: '' });

    // Handlers
    const handleCoachFormChange = (field, value) => {
        setCoachReviewForm({ ...coachReviewForm, [field]: value });
    };
    const handleSystemFormChange = (field, value) => {
        setSystemReviewForm({ ...systemReviewForm, [field]: value });
    };
    const handleSubmitCoachReview = () => {
        if (!coachReviewForm.coachId || coachReviewForm.rating < 1) {
            window.alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        const selectedCoach = coachesForReview.find(coach => coach.id === parseInt(coachReviewForm.coachId));
        const coachName = selectedCoach ? selectedCoach.name : 'Không rõ';
        setCoachReviews([
            ...coachReviews,
            {
                id: Date.now(),
                coachName,
                rating: parseInt(coachReviewForm.rating),
                comment: coachReviewForm.comment,
                date: new Date().toISOString().split('T')[0],
            },
        ]);
        setCoachReviewForm({ coachId: '', rating: 0, comment: '' });
    };
    const handleSubmitSystemReview = () => {
        if (systemReviewForm.rating < 1) {
            window.alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        setSystemReviews([
            ...systemReviews,
            {
                id: Date.now(),
                rating: parseInt(systemReviewForm.rating),
                comment: systemReviewForm.comment,
                date: new Date().toISOString().split('T')[0],
            },
        ]);
        setSystemReviewForm({ rating: 0, comment: '' });
    };

    // Table columns
    const coachColumns = [
        {
            title: 'Huấn luyện viên',
            dataIndex: 'coachName',
            key: 'coachName',
        },
        {
            title: 'Số sao',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => <>{Array.from({ length: rating }, (_, i) => <Star key={i} />)}</>,
        },
        {
            title: 'Nội dung đánh giá',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Ngày đánh giá',
            dataIndex: 'date',
            key: 'date',
        },
    ];
    const systemColumns = [
        {
            title: 'Số sao',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => <>{Array.from({ length: rating }, (_, i) => <Star key={i} />)}</>,
        },
        {
            title: 'Nội dung đánh giá',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Ngày đánh giá',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    return (
        <PageContainer>
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

            <AnimatedCard
                title={activeReviewType === 'coach' ? 'Viết đánh giá Huấn luyện viên' : 'Viết đánh giá Hệ thống'}
                style={{ marginBottom: 24, borderRadius: 12 }}
                delay="0.5s"
            >
                <ReviewForm>
                    {activeReviewType === 'coach' ? (
                        <>
                            <div style={{ marginBottom: 16 }}>
                                <label>Chọn Huấn luyện viên:</label>
                                <Select
                                    style={{ width: '100%' }}
                                    value={coachReviewForm.coachId}
                                    onChange={v => handleCoachFormChange('coachId', v)}
                                    placeholder="-- Chọn huấn luyện viên --"
                                >
                                    {coachesForReview.map(coach => (
                                        <Option key={coach.id} value={coach.id}>{coach.name}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Số sao (1-5):</label>
                                <Select
                                    style={{ width: '100%' }}
                                    value={coachReviewForm.rating || undefined}
                                    onChange={v => handleCoachFormChange('rating', v)}
                                    placeholder="Chọn số sao"
                                >
                                    {[1, 2, 3, 4, 5].map(star => <Option key={star} value={star}>{Array.from({ length: star }, (_, i) => <Star key={i} />)}</Option>)}
                                </Select>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Nội dung đánh giá:</label>
                                <Input.TextArea
                                    rows={4}
                                    value={coachReviewForm.comment}
                                    onChange={e => handleCoachFormChange('comment', e.target.value)}
                                    placeholder="Chia sẻ trải nghiệm của bạn với huấn luyện viên..."
                                />
                            </div>
                            <Button type="primary" onClick={handleSubmitCoachReview} icon={<PlusOutlined />}>Gửi đánh giá</Button>
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: 16 }}>
                                <label>Số sao (1-5):</label>
                                <Select
                                    style={{ width: '100%' }}
                                    value={systemReviewForm.rating || undefined}
                                    onChange={v => handleSystemFormChange('rating', v)}
                                    placeholder="Chọn số sao"
                                >
                                    {[1, 2, 3, 4, 5].map(star => <Option key={star} value={star}>{Array.from({ length: star }, (_, i) => <Star key={i} />)}</Option>)}
                                </Select>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Nội dung đánh giá:</label>
                                <Input.TextArea
                                    rows={4}
                                    value={systemReviewForm.comment}
                                    onChange={e => handleSystemFormChange('comment', e.target.value)}
                                    placeholder="Chia sẻ trải nghiệm của bạn với hệ thống..."
                                />
                            </div>
                            <Button type="primary" onClick={handleSubmitSystemReview} icon={<PlusOutlined />}>Gửi đánh giá</Button>
                        </>
                    )}
                </ReviewForm>
            </AnimatedCard>

            <AnimatedCard
                title={activeReviewType === 'coach' ? (
                    <span><UserOutlined style={{ color: '#5FB8B3', marginRight: 8 }} />Lịch sử đánh giá Huấn luyện viên</span>
                ) : (
                    <span><AppstoreOutlined style={{ color: '#5FB8B3', marginRight: 8 }} />Lịch sử đánh giá Hệ thống</span>
                )}
                style={{ borderRadius: 12 }}
                delay="0.5s"
            >
                <Table
                    columns={activeReviewType === 'coach' ? coachColumns : systemColumns}
                    dataSource={activeReviewType === 'coach' ? coachReviews : systemReviews}
                    rowKey="id"
                    locale={{ emptyText: 'Chưa có đánh giá nào' }}
                    pagination={{ pageSize: 5 }}
                />
            </AnimatedCard>
        </PageContainer>
    );
};

export default UserReviews;