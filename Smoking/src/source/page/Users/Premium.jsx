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
  background: linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%);
  min-height: 100vh;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  background: none;
  padding: 0;
  border-radius: 0;
  border: none;
  
  .main-title {
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    
    .icon {
      color: #5FB8B3;
      margin-right: 16px;
      font-size: 32px;
      animation: shine 2s infinite;
    }
    @keyframes shine {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
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
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.featured && `
    transform: scale(1.05);
    border: 2px solid #5FB8B3;
    box-shadow: 0 8px 24px rgba(95, 184, 179, 0.15);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #5FB8B3, #4A90E2);
    }
    
    .ant-card-head {
      background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
      border-radius: 16px 16px 0 0;
      padding: 20px;
      
      .ant-card-head-title {
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
      }
    }
  `}
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.15);
  }
  
  .price {
    font-size: 2.8rem;
    color: #5FB8B3;
    margin: 24px 0;
    font-weight: 700;
    text-align: center;
    
    .duration {
      color: #666;
      font-size: 1rem;
      font-weight: 400;
    }
  }
  
  .feature-list {
    margin: 24px 0;
    padding: 0 16px;
    
    li {
      margin: 16px 0;
      display: flex;
      align-items: center;
      color: #2c3e50;
      font-size: 1rem;
      
      .anticon {
        color: #5FB8B3;
        margin-right: 12px;
        font-size: 16px;
      }
    }
  }

  .ant-card-extra {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
  }
`;

const StyledSteps = styled(Steps)`
  margin: 40px 0;
  
  .ant-steps-item-process .ant-steps-item-icon {
    background-color: #5FB8B3;
    border-color: #5FB8B3;
  }

  .ant-steps-item-finish .ant-steps-item-icon {
    border-color: #5FB8B3;
    
    .ant-steps-icon {
      color: #5FB8B3;
    }
  }

  .ant-steps-item-finish .ant-steps-item-tail::after {
    background-color: #5FB8B3;
  }
`;

const PaymentMethodCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  &.selected {
    border-color: #5FB8B3;
    background: rgba(95, 184, 179, 0.05);
  }

  .payment-icon {
    font-size: 24px;
    margin-right: 12px;
    color: #5FB8B3;
  }

  .payment-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const ConfirmationSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;

  h3 {
    color: #2c3e50;
    font-size: 1.2rem;
    margin-bottom: 16px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .label {
      color: #666;
    }

    .value {
      font-weight: 500;
      color: #2c3e50;
    }
  }

  .total-row {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #eee;
    font-weight: 600;
    font-size: 1.1rem;
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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const plans = [
        {
            title: 'Cơ Bản',
            price: '100,000',
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
            price: '550,000',
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
            price: '1000,000',
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

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        form.setFieldsValue({ paymentMethod: method.value });
    };

    const steps = [
        {
            title: 'Phương thức thanh toán',
            content: (
                <div>
                    <p style={{ marginBottom: '16px', color: '#666' }}>
                        Vui lòng chọn phương thức thanh toán phù hợp với bạn
                    </p>
                    {paymentMethods.map(method => (
                        <PaymentMethodCard
                            key={method.value}
                            className={selectedPaymentMethod?.value === method.value ? 'selected' : ''}
                            onClick={() => handlePaymentMethodSelect(method)}
                        >
                            <div className="payment-info">
                                <div>
                                    <DollarOutlined className="payment-icon" />
                                    <span>{method.label}</span>
                                </div>
                                {selectedPaymentMethod?.value === method.value && (
                                    <CheckOutlined style={{ color: '#5FB8B3' }} />
                                )}
                            </div>
                        </PaymentMethodCard>
                    ))}
                </div>
            )
        },
        {
            title: 'Xác nhận',
            content: (
                <ConfirmationSection>
                    <h3>Thông tin đăng ký</h3>
                    <div className="info-row">
                        <span className="label">Gói thành viên:</span>
                        <span className="value">{selectedPlan?.title}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Thời hạn:</span>
                        <span className="value">{selectedPlan?.duration}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Phương thức thanh toán:</span>
                        <span className="value">{selectedPaymentMethod?.label}</span>
                    </div>
                    <div className="info-row total-row">
                        <span className="label">Tổng thanh toán:</span>
                        <span className="value">{selectedPlan?.price}đ</span>
                    </div>
                    <Tag color="green" style={{ marginTop: '16px', padding: '8px 16px' }}>
                        <SafetyCertificateOutlined style={{ marginRight: '8px' }} />
                        Bạn sẽ được kích hoạt ngay sau khi thanh toán thành công
                    </Tag>
                </ConfirmationSection>
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
                title={
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <CrownOutlined style={{ fontSize: '32px', color: '#5FB8B3', marginBottom: '16px' }} />
                        <h2 style={{ margin: 0, color: '#2c3e50' }}>Đăng ký gói thành viên</h2>
                    </div>
                }
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setCurrentStep(0);
                    form.resetFields();
                    setSelectedPaymentMethod(null);
                }}
                footer={null}
                width={700}
                centered
            >
                <Form form={form} layout="vertical">
                    <StyledSteps current={currentStep}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </StyledSteps>

                    <div>{steps[currentStep].content}</div>

                    <div style={{ marginTop: '32px', textAlign: 'right' }}>
                        {currentStep > 0 && (
                            <Button
                                style={{ marginRight: '8px' }}
                                onClick={handlePrev}
                                size="large"
                            >
                                Quay lại
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button
                                type="primary"
                                onClick={handleNext}
                                size="large"
                                style={{
                                    backgroundColor: '#5FB8B3',
                                    borderColor: '#5FB8B3',
                                    padding: '0 32px'
                                }}
                            >
                                Tiếp tục
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button
                                type="primary"
                                onClick={handlePayment}
                                size="large"
                                style={{
                                    backgroundColor: '#5FB8B3',
                                    borderColor: '#5FB8B3',
                                    padding: '0 32px'
                                }}
                            >
                                Thanh toán ngay
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