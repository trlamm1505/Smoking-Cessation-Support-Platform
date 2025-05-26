import React, { useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, Radio, Steps, message, Tag, Descriptions, Alert, Typography, Divider } from 'antd';
import { CheckOutlined, CrownOutlined, DollarOutlined, SafetyCertificateOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Step } = Steps;
const { Title } = Typography;

const PageContainer = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: calc(100vh - 64px);
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  .main-title {
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    
    .icon {
      color: #5FB8B3;
      margin-right: 16px;
    }
  }
  
  .subtitle {
    color: #666;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const PremiumCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s;
  
  ${props => props.featured && `
    transform: scale(1.05);
    border: 2px solid #5FB8B3;
    
    .ant-card-head {
      background: #5FB8B3;
      border-radius: 12px 12px 0 0;
      
      .ant-card-head-title {
        color: white;
      }
    }
  `}
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  
  .price {
    font-size: 2.5rem;
    color: #5FB8B3;
    margin: 20px 0;
    font-weight: bold;
  }
  
  .duration {
    color: #666;
    font-size: 1rem;
  }
  
  .feature-list {
    margin: 20px 0;
    
    li {
      margin: 10px 0;
      display: flex;
      align-items: center;
      
      .anticon {
        color: #5FB8B3;
        margin-right: 10px;
      }
    }
  }
`;

const StyledSteps = styled(Steps)`
  margin: 40px 0;
  
  .ant-steps-item-process .ant-steps-item-icon {
    background-color: #5FB8B3;
    border-color: #5FB8B3;
  }
`;

const SubscriptionStatusCard = styled(Card)`
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 40px;
    border: none;
    overflow: hidden;

    .ant-card-body {
        padding: 0;
    }

    .header-section {
        background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
        padding: 24px;
        color: white;
        
        .title {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }

    .content-section {
        padding: 24px;
    }

    .ant-descriptions {
        background: white;
        border-radius: 12px;
    }

    .ant-descriptions-item {
        padding: 16px 24px;
    }

    .ant-descriptions-item-label {
        color: #666;
        font-weight: 500;
        width: 180px;
    }

    .ant-descriptions-item-content {
        color: #2c3e50;
        font-weight: 500;
    }

    .info-item {
        display: flex;
        align-items: center;
        gap: 12px;

        .icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: rgba(95, 184, 179, 0.1);
            color: #5FB8B3;
        }
    }

    .subscription-tag {
        background: rgba(95, 184, 179, 0.1);
        color: #5FB8B3;
        border: none;
        padding: 4px 12px;
        border-radius: 20px;
        margin-left: 12px;
        font-weight: 500;
    }

    .status-badge {
        margin-left: auto;
        padding: 6px 16px;
        border-radius: 20px;
        font-weight: 500;
        font-size: 0.9rem;
        background: rgba(255, 255, 255, 0.2);
    }

    .countdown-section {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .date {
            font-weight: 500;
            color: #2c3e50;
        }
        
        .days-tag {
            background: ${props => props.isNearExpiry ? 'rgba(250, 173, 20, 0.1)' : 'rgba(95, 184, 179, 0.1)'};
            color: ${props => props.isNearExpiry ? '#faad14' : '#5FB8B3'};
            border: none;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: 500;
        }
    }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  padding: 0 24px 24px;

  .action-button {
    flex: 1;
    height: 48px;
    border-radius: 24px;
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.4s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    z-index: 0;

    .anticon {
      font-size: 20px;
      color: inherit;
      transition: all 0.4s ease;
    }

    &.renew {
      background: #5FB8B3;
      color: white;
      border: 2px solid transparent;

      &:hover {
        background: linear-gradient(135deg, #5FB8B3, #4A90E2);
        color: #ffffff;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(95, 184, 179, 0.3);
      }
    }

    &.change {
      background: #ffffff;
      color: #5FB8B3;
      border: 2px solid #5FB8B3;

      &:hover {
        background: linear-gradient(135deg, #5FB8B3, #4A90E2);
        color: white;
        border-color: transparent;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(95, 184, 179, 0.2);
      }

      .anticon {
        transition: color 0.3s ease;
      }

      &:hover .anticon {
        color: white;
      }
    }
  }
`;



const StyledAlert = styled(Alert)`
    margin-top: 20px;
    border-radius: 12px;
    border: none;
    background: rgba(24, 144, 255, 0.1);

    .ant-alert-message {
        color: #1890ff;
        font-weight: 600;
    }

    .ant-alert-description {
        color: #666;
    }

    .ant-alert-action {
        margin-top: 12px;
    }

    .cancel-auto-renew {
        border-radius: 20px;
        border: 1px solid #1890ff;
        color: #1890ff;
        background: white;
        padding: 4px 16px;
        height: auto;
        transition: all 0.3s;

        &:hover {
            background: #1890ff;
            color: white;
        }
    }
`;

const SubscriptionInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  .info-item-wrapper {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 72px;

    .label {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      
      .icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(95, 184, 179, 0.1);
        color: #5FB8B3;
      }
    }

    .value {
      font-weight: 500;
      color: #2c3e50;
      font-size: 1.1rem;
    }
  }
`;

const Premium = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [form] = Form.useForm();
    const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);

    const plans = [
        {
            title: 'Cơ Bản',
            price: '99,000',
            duration: '1 tháng',
            features: [
                'Truy cập tất cả tính năng cơ bản',
                'Hỗ trợ qua email',
                'Tham gia cộng đồng',
                'Các tài liệu hướng dẫn'
            ]   
        },
        {
            title: 'Nâng Cao',
            price: '249,000',
            duration: '3 tháng',
            featured: true,
            features: [
                'Tất cả tính năng của gói Cơ Bản',
                'Hỗ trợ ưu tiên',
                'Tính năng nâng cao',
                'Báo cáo chi tiết',
                'Huy hiệu thành viên đặc biệt'
            ]
        },
        {
            title: 'Chuyên Nghiệp',
            price: '399,000',
            duration: '6 tháng',
            features: [
                'Tất cả tính năng của gói Nâng Cao',
                'Hỗ trợ 24/7',
                'Tính năng độc quyền',
                'Tài liệu premium',
                'Chứng nhận thành viên VIP'
            ]
        }
    ];

    const paymentMethods = [
        { value: 'momo', label: 'Ví MoMo' },
        { value: 'zalopay', label: 'ZaloPay' },
        { value: 'banking', label: 'Chuyển khoản ngân hàng' },
        { value: 'visa', label: 'Thẻ Visa/Mastercard' }
    ];

    const showModal = (plan) => {
        setSelectedPlan(plan);
        setIsModalVisible(true);
    };

    const handleNext = () => {
        form.validateFields().then(() => {
            setCurrentStep(currentStep + 1);
        });
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handlePayment = () => {
        message.success('Đăng ký thành công! Cảm ơn bạn đã tin tưởng SmokeFree');
        setIsModalVisible(false);
        setCurrentStep(0);
        form.resetFields();
    };

    const handleRenew = () => {
        if (getDaysRemaining(currentSubscription.endDate) > 0) {
            message.info('Gói của bạn vẫn còn hạn sử dụng');
            return;
        }
        showModal(plans.find(p => p.title === currentSubscription.plan));
    };

    const handleChangePlan = () => {
        setIsChangeModalVisible(true);
    };

    const steps = [
        {
            title: 'Thông tin cá nhân',
            content: (
                <Form.Item
                    name="userInfo"
                    rules={[{ required: true, message: 'Vui lòng điền thông tin!' }]}
                >
                    <Input.Group size="large">
                        <Form.Item
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
            )
        },
        {
            title: 'Phương thức thanh toán',
            content: (
                <Form.Item
                    name="paymentMethod"
                    rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                >
                    <Radio.Group>
                        {paymentMethods.map(method => (
                            <Radio.Button key={method.value} value={method.value}>
                                {method.label}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
            )
        },
        {
            title: 'Xác nhận',
            content: (
                <div>
                    <h3>Thông tin đăng ký:</h3>
                    <p>Gói: {selectedPlan?.title}</p>
                    <p>Giá: {selectedPlan?.price}đ/{selectedPlan?.duration}</p>
                    <Tag color="green">Bạn sẽ được kích hoạt ngay sau khi thanh toán thành công</Tag>
                </div>
            )
        }
    ];

    // Get renewal date (1 day after end date)
    const getRenewalDate = (endDate) => {
        const end = new Date(endDate);
        const renewal = new Date(end);
        renewal.setDate(renewal.getDate() + 1);
        return renewal.toISOString().split('T')[0];
    };

    // Mock data for current subscription - this should come from your backend
    const currentSubscription = {
        plan: 'Nâng Cao',
        startDate: '2024-03-01',
        endDate: '2024-06-01',
        renewalDate: getRenewalDate('2024-06-01'),
        status: 'active', // 'active', 'expired', 'pending'
        price: '249,000',
        duration: '3 tháng'
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className="status-badge active">Đang hoạt động</span>;
            case 'expired':
                return <span className="status-badge expired">Đã hết hạn</span>;
            case 'pending':
                return <span className="status-badge pending">Đang xử lý</span>;
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Calculate days remaining
    const getDaysRemaining = (endDate) => {
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays); // Return 0 if negative
    };

    return (
        <PageContainer>
            <PageHeader>
                <Title level={1} className="main-title">
                    <CrownOutlined className="icon" />
                    Gói Thành Viên Premium
                </Title>
                <p className="subtitle">
                    Nâng cấp tài khoản của bạn để trải nghiệm những tính năng độc quyền và nhận được nhiều ưu đãi đặc biệt.
                </p>
            </PageHeader>

            <SubscriptionStatusCard isNearExpiry={getDaysRemaining(currentSubscription.renewalDate) <= 7}>
                <div className="header-section">
                    <h2 className="title">
                        <CrownOutlined />
                        Thông tin đăng ký của bạn
                        <span className="status-badge">
                            {getStatusBadge(currentSubscription.status)}
                        </span>
                    </h2>
                </div>

                <div className="content-section">
                    <SubscriptionInfoGrid>
                        <div className="info-item-wrapper">
                            <div>
                                <div className="label">
                                    <span className="icon"><CrownOutlined /></span>
                                    Gói hiện tại
                                </div>
                                <div className="value">
                                    {currentSubscription.plan}
                                    <Tag className="subscription-tag">
                                        {currentSubscription.price}đ/{currentSubscription.duration}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                        <div className="info-item-wrapper">
                            <div>
                                <div className="label">
                                    <span className="icon"><CalendarOutlined /></span>
                                    Ngày bắt đầu
                                </div>
                                <div className="value">{formatDate(currentSubscription.startDate)}</div>
                            </div>
                        </div>
                        <div className="info-item-wrapper">
                            <div>
                                <div className="label">
                                    <span className="icon"><CalendarOutlined /></span>
                                    Ngày kết thúc
                                </div>
                                <div className="value">{formatDate(currentSubscription.endDate)}</div>
                            </div>
                        </div>
                        <div className="info-item-wrapper">
                            <div>
                                <div className="label">
                                    <span className="icon"><ClockCircleOutlined /></span>
                                    Ngày gia hạn
                                </div>
                                <div className="value">{formatDate(currentSubscription.renewalDate)}</div>
                            </div>
                        </div>
                    </SubscriptionInfoGrid>

                    <ActionButtons>
                        <Button
                            className="action-button renew"
                            icon={<SafetyCertificateOutlined />}
                            onClick={handleRenew}
                        >
                            Gia hạn gói hiện tại
                        </Button>
                        <Button
                            className="action-button change"
                            icon={<CrownOutlined />}
                            onClick={handleChangePlan}
                        >
                            Thay đổi gói
                        </Button>
                    </ActionButtons>
                </div>
            </SubscriptionStatusCard>

            <Row gutter={[24, 24]}>
                {plans.map((plan, index) => (
                    <Col xs={24} md={8} key={index}>
                        <PremiumCard
                            featured={plan.featured}
                            title={plan.title}
                            extra={plan.featured && <Tag color="#5FB8B3">Phổ biến nhất</Tag>}
                        >
                            <div className="price">
                                {plan.price}đ
                                <span className="duration">/{plan.duration}</span>
                            </div>
                            <ul className="feature-list">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>
                                        <CheckOutlined />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                type={plan.featured ? 'primary' : 'default'}
                                block
                                size="large"
                                onClick={() => showModal(plan)}
                                style={plan.featured ? { backgroundColor: '#5FB8B3', borderColor: '#5FB8B3' } : {}}
                            >
                                Đăng ký ngay
                            </Button>
                        </PremiumCard>
                    </Col>
                ))}
            </Row>

            <Modal
                title="Đăng ký gói thành viên"
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setCurrentStep(0);
                    form.resetFields();
                }}
                footer={null}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <StyledSteps current={currentStep}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </StyledSteps>

                    <div>{steps[currentStep].content}</div>

                    <div style={{ marginTop: '24px', textAlign: 'right' }}>
                        {currentStep > 0 && (
                            <Button style={{ marginRight: '8px' }} onClick={handlePrev}>
                                Quay lại
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button type="primary" onClick={handleNext}>
                                Tiếp tục
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button type="primary" onClick={handlePayment}>
                                Thanh toán
                            </Button>
                        )}
                    </div>
                </Form>
            </Modal>

            <Modal
                title="Thay đổi gói thành viên"
                visible={isChangeModalVisible}
                onCancel={() => setIsChangeModalVisible(false)}
                footer={null}
                width={900}
            >
                <div style={{ marginBottom: '24px' }}>
                    <Alert
                        message="Lưu ý khi thay đổi gói"
                        description={
                            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                <li>Nếu nâng cấp lên gói cao hơn, bạn chỉ cần trả thêm phần chênh lệch</li>
                                <li>Nếu hạ xuống gói thấp hơn, thay đổi sẽ có hiệu lực từ kỳ thanh toán tiếp theo</li>
                                <li>Mọi thay đổi về gói sẽ được cập nhật ngay sau khi xác nhận thanh toán</li>
                            </ul>
                        }
                        type="info"
                        showIcon
                    />
                </div>
                <Row gutter={[16, 16]}>
                    {plans.map((plan, index) => (
                        <Col key={index} xs={24} md={8}>
                            <PremiumCard
                                featured={plan.featured}
                                title={plan.title}
                                extra={plan.featured && <Tag color="#5FB8B3">Phổ biến nhất</Tag>}
                                style={{ opacity: plan.title === currentSubscription.plan ? 0.7 : 1 }}
                            >
                                <div className="price">
                                    {plan.price}đ
                                    <span className="duration">/{plan.duration}</span>
                                </div>
                                <ul className="feature-list">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <CheckOutlined />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    type={plan.featured ? 'primary' : 'default'}
                                    block
                                    size="large"
                                    disabled={plan.title === currentSubscription.plan}
                                    onClick={() => {
                                        setIsChangeModalVisible(false);
                                        showModal(plan);
                                    }}
                                    style={
                                        plan.featured
                                            ? { backgroundColor: '#5FB8B3', borderColor: '#5FB8B3', marginTop: '20px' }
                                            : { marginTop: '20px' }
                                    }
                                >
                                    {plan.title === currentSubscription.plan ? 'Gói hiện tại' : 'Chọn gói này'}
                                </Button>
                            </PremiumCard>
                        </Col>
                    ))}
                </Row>
            </Modal>
        </PageContainer>
    );
};

export default Premium; 