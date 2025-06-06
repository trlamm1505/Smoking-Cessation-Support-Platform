import React, { useState } from 'react';
// Remove Ant Design imports
// import { Typography, Card, Form, Input, Button, Table, Space, Modal, message, Rate, Select, Option } from 'antd';
import styled from 'styled-components';
// Keep icons if needed
import { PlusOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';

// Define basic styled components
const Container = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
`;

const StyledCard = styled.div`
  margin-bottom: 24px;
  border-radius: 16px;
  padding: 24px;
  background: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(95, 184, 179, 0.12);
  }
`;

const Title = styled.h2`
  font-size: 32px;
  margin: 0;
  font-weight: 600;
  color: #222;
`;

const Button = styled.button` /* Simple Button */
  padding: 8px 16px;
  background-color: #1890ff; /* Example primary color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

// Remove Ant Design Modal and related state/functions
/*
const UserReviews = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [reviews, setReviews] = useState([
// ... rest of Ant Design specific code ...
    ]);

    return (
        <Container>
            <Header>
                <Title level={2}>Đánh giá của tôi</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateReview}
                >
                    Viết đánh giá mới
                </Button>
            </Header>

            <StyledCard>
                <Table
                    columns={columns}
                    dataSource={reviews}
                    rowKey="id"
                />
            </StyledCard>

            <Modal
                title="Viết đánh giá mới"
                open={isModalVisible}
                onCancel={handleCancelModal}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitReview}
                >
                    <Form.Item
                        name="coachId"
                        label="Chọn Huấn luyện viên"
                        rules={[{ required: true, message: 'Vui lòng chọn huấn luyện viên' }]}
                    >
                        <Select placeholder="Chọn huấn luyện viên">
                            {coachesForReview.map(coach => (
                                <Option key={coach.id} value={coach.id}>
                                    {coach.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="rating"
                        label="Số sao"
                        rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Nội dung đánh giá"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]}
                    >
                        <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn..." />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Gửi đánh giá
                            </Button>
                            <Button onClick={handleCancelModal}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Container>
    );
};

export default UserReviews;
*/

// Start rebuilding the component without Ant Design
const UserReviews = () => {
    // Keep state for reviews and coaches for review
    const [reviews, setReviews] = useState([
        {
            id: 1,
            coachName: 'Huấn luyện viên A',
            rating: 5,
            comment: 'HLV rất tốt, giúp tôi vượt qua giai đoạn khó khăn.',
            date: '2023-10-26',
        },
        {
            id: 2,
            coachName: 'Huấn luyện viên B',
            rating: 4,
            comment: 'Nhận được nhiều lời khuyên hữu ích.',
            date: '2023-10-20',
        },
    ]);

    const [coachesForReview, setCoachesForReview] = useState([
        { id: 1, name: 'Huấn luyện viên A' },
        { id: 2, name: 'Huấn luyện viên B' },
        { id: 3, name: 'Huấn luyện viên C' },
    ]);

    // State for modal visibility and form data (manual)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({
        coachId: '',
        rating: 0,
        comment: '',
    });

    // Remove state for delete confirmation
    // const [reviewToDelete, setReviewToDelete] = useState(null);
    // const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    // --- Functions (adapted from Ant Design version) ---
    const handleCreateReview = () => {
        setIsModalVisible(true);
    };

    // Handle form input changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setReviewFormData({ ...reviewFormData, [name]: value });
    };

    // Handle rating change (basic for now, need custom component for stars)
    const handleRatingChange = (value) => {
        setReviewFormData({ ...reviewFormData, rating: value });
    };

    const handleSubmitReview = () => {
        // Basic validation
        if (!reviewFormData.coachId || reviewFormData.rating === 0 || !reviewFormData.comment) {
            alert('Vui lòng điền đầy đủ thông tin!'); // Use simple alert
            return;
        }

        // Find coach name
        const selectedCoach = coachesForReview.find(coach => coach.id === parseInt(reviewFormData.coachId)); // Parse ID as it comes as string from select
        const coachName = selectedCoach ? selectedCoach.name : 'Không rõ';

        const newReview = {
            id: reviews.length + 1, // Simple mock ID
            coachName: coachName,
            rating: parseInt(reviewFormData.rating), // Parse rating
            comment: reviewFormData.comment,
            date: new Date().toISOString().split('T')[0], // Current date
        };

        // Note: In a real app, send this newReview data to your backend API
        console.log('Submitting review:', newReview); // Log for now

        // setReviews([...reviews, newReview]); // Don't add to local state if sending to backend
        alert('Đánh giá của bạn đã được gửi!'); // Use simple alert
        setIsModalVisible(false);
        // Reset form
        setReviewFormData({ coachId: '', rating: 0, comment: '' });
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
        // Reset form
        setReviewFormData({ coachId: '', rating: 0, comment: '' });
    };

    // Remove Delete confirmation logic
    // const handleDeleteReview = (reviewId) => {
    //     setReviewToDelete(reviewId);
    //     setIsDeleteModalVisible(true);
    // };

    // const handleConfirmDelete = () => {
    //      setReviews(reviews.filter(review => review.id !== reviewToDelete));
    //      alert('Đã xóa đánh giá thành công!'); // Use simple alert
    //      setIsDeleteModalVisible(false);
    //      setReviewToDelete(null);
    // };

    // const handleCancelDelete = () => {
    //     setIsDeleteModalVisible(false);
    //     setReviewToDelete(null);
    // };


    // --- Render functions (replace Ant Design components) ---

    // Basic Table rendering
    const renderReviewsTable = () => (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Huấn luyện viên</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Số sao</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Nội dung đánh giá</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Ngày đánh giá</th>
                    {/* Remove Thao tác column */}
                    {/* <th style={{ padding: '10px', textAlign: 'left' }}>Thao tác</th> */}
                </tr>
            </thead>
            <tbody>
                {reviews.map(review => (
                    <tr key={review.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{review.coachName}</td><td style={{ padding: '10px' }}>{review.rating} sao</td> {/* Simple display */}<td style={{ padding: '10px' }}>{review.comment}</td><td style={{ padding: '10px' }}>{review.date}</td>
                        {/* Remove action column cell */}
                        {/* <td style={{ padding: '10px' }}>
                            <button onClick={() => handleDeleteReview(review.id)}>Xóa</button>
                        </td> */}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // Basic Modal component (redefined)
    const CustomModal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    minWidth: '400px',
                    maxWidth: '90%',
                    zIndex: 1001,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>{title}</h3>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer' }}>&times;</button>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Container>
            <Header>
                <TitleRow>
                    <StarOutlined />
                    <Title>Đánh Giá Của Tôi</Title>
                </TitleRow>
                <Button
                    type="primary"
                    onClick={handleCreateReview}
                >
                    <PlusOutlined /> Viết đánh giá mới
                </Button>
            </Header>

            <StyledCard>
                {renderReviewsTable()}
            </StyledCard>

            {/* Modal for creating a new review */}
            <CustomModal
                isOpen={isModalVisible}
                onClose={handleCancelModal}
                title="Viết đánh giá mới"
            >
                {/* Form items for review */}
                <div>
                    {/* Coach Select (basic implementation) */}
                    <label htmlFor="coachId">Chọn Huấn luyện viên:</label><br />
                    <select name="coachId" id="coachId" value={reviewFormData.coachId} onChange={handleFormChange} style={{ marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required>
                        <option value="">-- Chọn huấn luyện viên --</option>
                        {coachesForReview.map(coach => (
                            <option key={coach.id} value={coach.id}>{coach.name}</option>
                        ))}
                    </select><br />

                    {/* Rating Input (basic number input, needs custom component for stars) */}
                    <label htmlFor="rating">Số sao (1-5):</label><br />
                    <input type="number" name="rating" id="rating" value={reviewFormData.rating} onChange={handleFormChange} min="1" max="5" style={{ marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required /><br />

                    {/* Comment TextArea */}
                    <label htmlFor="comment">Nội dung đánh giá:</label><br />
                    <textarea name="comment" id="comment" value={reviewFormData.comment} onChange={handleFormChange} rows="4" placeholder="Chia sẻ trải nghiệm của bạn..." style={{ marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} required></textarea><br />

                    <button onClick={handleSubmitReview} style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Gửi đánh giá</button>
                    <button onClick={handleCancelModal} style={{ padding: '10px 15px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
                </div>
            </CustomModal>

            {/* Remove Custom Delete Confirmation Modal */}
            {/*
            <CustomModal
                isOpen={isDeleteModalVisible}
                onClose={handleCancelDelete}
                title="Xác nhận xóa"
            >
                <p>Bạn có chắc chắn muốn xóa đánh giá này không?</p>
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <button onClick={handleConfirmDelete} style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                    <button onClick={handleCancelDelete} style={{ padding: '10px 15px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
                </div>
            </CustomModal>
             */}

        </Container>
    );
};

export default UserReviews;