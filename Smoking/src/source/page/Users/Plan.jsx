import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    InputNumber,
    Select,
    Button,
    Typography,
    DatePicker,
    Space,
    Input,
    Row,
    Col,
    Divider,
    message,
    Radio,
    Checkbox
} from 'antd';
import {
    SaveOutlined,
    CalendarOutlined,
    HeartOutlined,
    DollarOutlined,
    UserOutlined,
    TrophyOutlined,
    EditOutlined,
    FileTextOutlined,
    AimOutlined,
    BulbOutlined,
    GiftOutlined
} from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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
  box-shadow: 0 4px 15px rgba(95, 184, 179, 0.1);
  margin-bottom: 24px;
  border: 1px solid #E3F6F5;
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
      font-size: 24px;
      animation: shine 2s infinite;
    }

    @keyframes shine {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
  }

  .plan-form-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(95, 184, 179, 0.1);
    margin-bottom: 24px;
    border: 1px solid #E3F6F5;
  }

  .section-header {
    margin: 20px 0 16px 0;
    padding: 12px 16px;
    border-radius: 8px;
    background: linear-gradient(135deg, #5FB8B3 0%, #70C1BC 100%);
    color: white;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(95, 184, 179, 0.2);
  }

  .form-item-with-icon {
    .ant-form-item-label > label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #000000;
    }
  }

  .date-range-container {
    background: #e8f4f3;
    padding: 16px;
    border-radius: 8px;
    margin: 16px 0;
    border: 1px solid #BEE3E2;
  }

  .goal-container {
    background: linear-gradient(135deg, #70C1BC, #5FB8B3);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin: 16px 0;
    box-shadow: 0 4px 12px rgba(95, 184, 179, 0.2);
  }

  .reasons-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 20px 0;
    width: 100%;
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  .reason-item {
    .ant-checkbox-wrapper {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid #E3F6F5;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 15px;
      font-weight: 500;
      text-align: left;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      min-height: 56px;
      background: linear-gradient(135deg, #ffffff 0%, #f8fdfc 100%);
      position: relative;
      cursor: pointer;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 10px;
        background: linear-gradient(135deg, #5FB8B3, #2c7a75);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
      }
      
      &:hover {
        border-color: #5FB8B3;
        background: #f0f8f7;
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(95, 184, 179, 0.2);
        color: #2c7a75;
      }
      
      .ant-checkbox {
        margin-right: 12px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        
        .ant-checkbox-inner {
          border-radius: 6px;
          border: 2px solid #70C1BC;
          width: 18px;
          height: 18px;
          
          &::after {
            border-radius: 2px;
          }
        }
        
        &.ant-checkbox-checked .ant-checkbox-inner {
          background-color: #5FB8B3;
          border-color: #5FB8B3;
        }
      }
      
      span:last-child {
        flex: 1;
        line-height: 1.4;
        display: flex;
        align-items: center;
      }
    }
    
    .ant-checkbox-wrapper-checked {
      border-color: #5FB8B3;
      background: linear-gradient(135deg, #f0f8f7 0%, #e8f4f3 100%);
      color: #2c7a75;
      font-weight: 600;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(95, 184, 179, 0.15);
      
      &::before {
        opacity: 0.1;
      }
    }
  }

  .plan-section {
    background: #e8f4f3;
    padding: 24px;
    border-radius: 12px;
    margin: 16px 0;
    border: 1px solid #BEE3E2;
  }
`;

// Thêm component MoneyInput
const MoneyInput = ({ value, onChange, ...props }) => {
    const formatNumber = (val) => val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const handleChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        onChange && onChange(raw ? Number(raw) : undefined);
    };
    return (
        <Input
            {...props}
            value={value !== undefined && value !== null ? formatNumber(String(value)) : ''}
            onChange={handleChange}
            placeholder="Ví dụ: 20000"
            addonAfter="VNĐ/ngày"
            inputMode="numeric"
        />
    );
};

const Plan = () => {
    const [form] = Form.useForm();
    const [planData, setPlanData] = useState(null);
    const [isEditing, setIsEditing] = useState(true);

    const reasons = [
        { value: 'health', label: 'Cải thiện sức khỏe' },
        { value: 'money', label: 'Tiết kiệm tiền' },
        { value: 'family', label: 'Vì gia đình' },
        { value: 'children', label: 'Làm gương cho con' },
        { value: 'appearance', label: 'Cải thiện ngoại hình' },
        { value: 'fitness', label: 'Tăng cường thể lực' },
        { value: 'social', label: 'Áp lực xã hội' },
        { value: 'pregnancy', label: 'Mang thai/cho con bú' },
        { value: 'smell', label: 'Khác' }
    ];

    useEffect(() => {
        const userId = Number(localStorage.getItem('userId')) || 1;
        fetch(`http://localhost:8080/api/cessation-plans/user/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const plan = data[0];
                    setPlanData({
                        planID: plan.planID,
                        yearsSmoking: plan.smokingFrequency || '',
                        cigarettesPerDay: plan.cigarettesPerDay,
                        moneyPerDay: plan.costPerPack,
                        startDate: plan.startDate ? dayjs(plan.startDate) : null,
                        endDate: plan.targetQuitDate ? dayjs(plan.targetQuitDate) : null,
                        endDays: plan.targetQuitDate && plan.startDate ? dayjs(plan.targetQuitDate).diff(dayjs(plan.startDate), 'day') : 10,
                        quitReasons: plan.reasonToQuit ? plan.reasonToQuit.split(',').map(s => s.trim()) : [],
                        additionalNotes: plan.notes || ''
                    });
                    setIsEditing(false);
                }
            })
            .catch(() => { });
    }, []);

    const onFinish = async (values) => {
        const userId = Number(localStorage.getItem('userId')) || 1;
        const startDate = values.startDate ? values.startDate.format('YYYY-MM-DD') : '';
        const endDays = values.endDays || 10;
        const targetQuitDate = values.startDate ? values.startDate.clone().add(endDays, 'day').format('YYYY-MM-DD') : '';
        const planPayload = {
            userId,
            smokingFrequency: values.yearsSmoking,
            reasonToQuit: (values.quitReasons || []).join(', '),
            startDate,
            targetQuitDate,
            cigarettesPerDay: values.cigarettesPerDay,
            costPerPack: values.moneyPerDay || 0,
            notes: values.additionalNotes || '',
            customDetails: '',
            isActive: true,
            active: true
        };
        try {
            let res;
            if (planData && planData.planID) {
                // Update (PUT)
                res = await fetch(`http://localhost:8080/api/cessation-plans/${planData.planID}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(planPayload)
                });
            } else {
                // Create (POST)
                res = await fetch('http://localhost:8080/api/cessation-plans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(planPayload)
                });
            }
            if (!res.ok) throw new Error('Lưu kế hoạch thất bại!');
            // Tính lại ngày kết thúc cho state hiển thị
            const calcEndDate = values.startDate && values.endDays !== undefined
                ? values.startDate.clone().add(values.endDays, 'day')
                : undefined;
            setPlanData({
                ...values,
                planID: planData?.planID,
                startDate: values.startDate,
                endDate: calcEndDate,
                targetQuitDate: calcEndDate ? calcEndDate.format('YYYY-MM-DD') : undefined
            });
            setIsEditing(false);
            message.success('Kế hoạch cai thuốc đã được lưu thành công!');
        } catch (err) {
            message.error(err.message || 'Lỗi khi lưu kế hoạch!');
        }
    };

    return (
        <PageContainer>
            <Title level={2} className="page-title">
                <CalendarOutlined />
                Lập Kế Hoạch Cai Thuốc
            </Title>

            {isEditing ? (
                <AnimatedCard title="Thông Tin Kế Hoạch Cai Thuốc" className="plan-form-card" delay="0.5s">
                    <Form
                        form={form}
                        name="smoking_cessation_plan"
                        onFinish={onFinish}
                        layout="vertical"
                        initialValues={{
                            yearsSmoking: undefined,
                            cigarettesPerDay: undefined,
                            moneyPerDay: undefined,
                            goalType: 'temporary',
                            goalDays: 2,
                            startDate: undefined
                        }}
                    >
                        {/* Lịch Sử Hút Thuốc */}
                        <div className="section-header">
                            <FileTextOutlined />
                            Lịch Sử Hút Thuốc
                        </div>
                        <div style={{
                            padding: '24px',
                            background: '#e8f4f3',
                            borderRadius: '8px',
                            border: '1px solid #BEE3E2',
                            marginBottom: '24px'
                        }}>
                            <Row gutter={[24, 24]}>
                                <Col span={8}>
                                    <Form.Item
                                        name="yearsSmoking"
                                        label={<span><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>Số năm hút thuốc</span>}
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số năm hút thuốc!' },
                                            { type: 'number', min: 1, message: 'Số năm hút thuốc phải là số lớn hơn 0!' }
                                        ]}
                                    >
                                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 5" addonAfter="năm" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="cigarettesPerDay"
                                        label={<span><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>Số điếu mỗi ngày</span>}
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điếu mỗi ngày!' },
                                            { type: 'number', min: 1, message: 'Số điếu mỗi ngày phải là số lớn hơn 0!' }
                                        ]}
                                    >
                                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 20" addonAfter="điếu" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="moneyPerDay"
                                        label={<span><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>Số tiền mỗi ngày</span>}
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số tiền mỗi ngày!' },
                                            { type: 'number', min: 1, message: 'Số tiền mỗi ngày phải là số lớn hơn 0!' }
                                        ]}
                                    >
                                        <MoneyInput />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        {/* Kế hoạch cai thuốc */}
                        <div className="section-header">
                            <CalendarOutlined />
                            Kế Hoạch Cai Thuốc
                        </div>

                        <div style={{
                            padding: '24px',
                            background: '#e8f4f3',
                            borderRadius: '8px',
                            border: '1px solid #BEE3E2'
                        }}>
                            <Row gutter={[24, 24]}>
                                <Col span={24}>
                                    {/* Chọn ngày */}
                                    <Row gutter={16} style={{ marginBottom: '24px' }}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="startDate"
                                                label={
                                                    <span style={{ color: '#000000' }}>
                                                        <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                                                        Ngày bắt đầu
                                                    </span>
                                                }
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                                            >
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    format="DD/MM/YYYY"
                                                    placeholder="Chọn ngày bắt đầu"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="endDays"
                                                label={
                                                    <span style={{ color: '#000000' }}>
                                                        <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                                                        Thời gian kết thúc
                                                    </span>
                                                }
                                                rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
                                            >
                                                <Select placeholder="Chọn thời gian kết thúc">
                                                    <Option value={10}>10 ngày</Option>
                                                    <Option value={20}>20 ngày</Option>
                                                    <Option value={30}>30 ngày</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        {/* Lý do cai thuốc */}
                        <div className="section-header">
                            <HeartOutlined />
                            Lý Do Cai Thuốc
                        </div>

                        <Form.Item
                            name="quitReasons"
                            label="Chọn lý do thúc đẩy bạn cai thuốc (có thể chọn nhiều)"
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một lý do!' }]}
                        >
                            <Checkbox.Group style={{ width: '100%' }}>
                                <div className="reasons-grid">
                                    {reasons.map(reason => (
                                        <div key={reason.value} className="reason-item">
                                            <Checkbox value={reason.value}>
                                                {reason.label}
                                            </Checkbox>
                                        </div>
                                    ))}
                                </div>
                            </Checkbox.Group>
                        </Form.Item>

                        {/* Ghi chú thêm */}
                        <Divider />

                        <Form.Item
                            name="additionalNotes"
                            label="Ghi chú thêm"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Ghi chú thêm về kế hoạch, động lực, mối quan tâm..."
                            />
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    size="large"
                                    style={{
                                        background: '#5FB8B3',
                                        borderColor: '#5FB8B3',
                                        boxShadow: '0 2px 8px rgba(95, 184, 179, 0.2)'
                                    }}
                                >
                                    Lưu Kế Hoạch Cai Thuốc
                                </Button>
                                <Button
                                    icon={<EditOutlined />}
                                    size="large"
                                    onClick={() => form.resetFields()}
                                >
                                    Làm Mới
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </AnimatedCard>
            ) : (
                <AnimatedCard
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <TrophyOutlined style={{ color: '#5FB8B3', fontSize: '20px' }} />
                            <span>Kế Hoạch Đã Lưu</span>
                        </div>
                    }
                    className="plan-form-card"
                    style={{
                        background: 'white',
                        border: '1px solid #E3F6F5',
                        boxShadow: '0 4px 12px rgba(95, 184, 179, 0.1)'
                    }}
                    delay="0.5s"
                >
                    {/* Lịch Sử Hút Thuốc */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#5FB8B3',
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '16px'
                        }}>
                            <FileTextOutlined />
                            <span>Lịch Sử Hút Thuốc</span>
                        </div>
                        <div style={{
                            background: '#f8fdfc',
                            padding: '16px',
                            borderRadius: '8px',
                            color: '#444'
                        }}>
                            <p>• Số năm hút thuốc: {planData.yearsSmoking} năm</p>
                            <p>• Số điếu mỗi ngày: {planData.cigarettesPerDay} điếu</p>
                            <p>• Số tiền mỗi ngày: {planData.moneyPerDay?.toLocaleString()} VNĐ</p>
                        </div>
                    </div>

                    {/* Kế hoạch cai thuốc */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#5FB8B3',
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '16px'
                        }}>
                            <CalendarOutlined />
                            <span>Kế Hoạch Cai Thuốc</span>
                        </div>
                        <div style={{
                            background: '#f8fdfc',
                            padding: '16px',
                            borderRadius: '8px'
                        }}>
                            <div style={{

                                padding: '0 16px',
                                borderRadius: '8px',
                                color: '#2c7a75'
                            }}>
                                {/* Đã bỏ phần hiển thị mục tiêu số ngày không hút */}
                            </div>
                            <div style={{ color: '#444' }}>
                                <p>• Ngày bắt đầu: {planData.startDate?.format('DD/MM/YYYY')}</p>
                                <p>• Ngày kết thúc: {planData.endDate?.format('DD/MM/YYYY') || (planData.targetQuitDate && dayjs(planData.targetQuitDate).format('DD/MM/YYYY'))}</p>
                            </div>
                        </div>
                    </div>

                    {/* Lý do cai thuốc */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#5FB8B3',
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '16px'
                        }}>
                            <HeartOutlined />
                            <span>Lý Do Cai Thuốc</span>
                        </div>
                        <div style={{
                            background: '#f8fdfc',
                            padding: '16px',
                            borderRadius: '8px'
                        }}>
                            {planData.quitReasons && planData.quitReasons.length > 0 && (
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ marginBottom: '8px', color: '#444' }}>Lý do đã chọn:</div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '8px'
                                    }}>
                                        {planData.quitReasons.map(reasonValue => {
                                            const reason = reasons.find(r => r.value === reasonValue);
                                            return (
                                                <div key={reasonValue} style={{
                                                    padding: '8px 12px',
                                                    background: 'rgba(95, 184, 179, 0.1)',
                                                    borderRadius: '6px',
                                                    color: '#2c7a75'
                                                }}>
                                                    • {reason?.label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ghi chú thêm */}
                    {planData.additionalNotes && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#5FB8B3',
                                fontSize: '16px',
                                fontWeight: '500',
                                marginBottom: '16px'
                            }}>
                                <EditOutlined />
                                <span>Ghi Chú Thêm</span>
                            </div>
                            <div style={{
                                background: '#f8fdfc',
                                padding: '16px',
                                borderRadius: '8px',
                                color: '#444'
                            }}>
                                {planData.additionalNotes}
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div style={{
                        marginTop: '24px',
                        paddingTop: '20px',
                        borderTop: '1px solid #e8f4f3',
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center'
                    }}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                form.setFieldsValue({
                                    ...planData,
                                    endDays: planData.endDate && planData.startDate
                                        ? planData.endDate.diff(planData.startDate, 'day')
                                        : 10
                                });
                                setIsEditing(true);
                            }}
                            style={{
                                background: '#5FB8B3',
                                borderColor: '#5FB8B3'
                            }}
                        >
                            Chỉnh Sửa Kế Hoạch
                        </Button>
                        <Button
                            icon={<SaveOutlined />}
                            onClick={() => {
                                message.success('Kế hoạch đã được lưu vào hệ thống!');
                            }}
                        >
                            Lưu Vào Hệ Thống
                        </Button>
                    </div>
                </AnimatedCard>
            )}
        </PageContainer>
    );
};

export default Plan;
