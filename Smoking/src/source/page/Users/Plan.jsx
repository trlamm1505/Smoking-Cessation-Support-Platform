import React, { useState } from 'react';
import { Form, Input, Button, Card, Steps, DatePicker, InputNumber, Select, Row, Col, Timeline } from 'antd';
import { CalendarOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const PlanContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 24px;
`;

const StepContent = styled.div`
  margin-top: 24px;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
`;

const Plan = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();

    const steps = [
        {
            title: 'Thông tin cơ bản',
            content: (
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="startDate"
                                label="Ngày bắt đầu"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="targetDate"
                                label="Ngày mục tiêu"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày mục tiêu' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="currentConsumption"
                        label="Số điếu thuốc hiện tại/ngày"
                        rules={[{ required: true, message: 'Vui lòng nhập số điếu thuốc' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="quitReason"
                        label="Lý do cai thuốc"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do cai thuốc' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Lập kế hoạch',
            content: (
                <Form layout="vertical">
                    <Form.Item
                        name="quitMethod"
                        label="Phương pháp cai thuốc"
                        rules={[{ required: true, message: 'Vui lòng chọn phương pháp' }]}
                    >
                        <Select>
                            <Option value="cold_turkey">Cai hoàn toàn</Option>
                            <Option value="gradual">Cai dần dần</Option>
                            <Option value="nicotine_replacement">Sử dụng sản phẩm thay thế nicotine</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dailyReduction"
                        label="Kế hoạch giảm số điếu/ngày"
                    >
                        <Timeline>
                            <Timeline.Item>Tuần 1: Giảm 25%</Timeline.Item>
                            <Timeline.Item>Tuần 2: Giảm 50%</Timeline.Item>
                            <Timeline.Item>Tuần 3: Giảm 75%</Timeline.Item>
                            <Timeline.Item>Tuần 4: Ngừng hoàn toàn</Timeline.Item>
                        </Timeline>
                    </Form.Item>

                    <Form.Item
                        name="triggers"
                        label="Các yếu tố kích thích hút thuốc"
                    >
                        <Select mode="multiple">
                            <Option value="stress">Stress</Option>
                            <Option value="social">Gặp gỡ bạn bè</Option>
                            <Option value="coffee">Uống cà phê</Option>
                            <Option value="alcohol">Uống rượu bia</Option>
                            <Option value="after_meal">Sau bữa ăn</Option>
                        </Select>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Hỗ trợ & Theo dõi',
            content: (
                <Form layout="vertical">
                    <Form.Item
                        name="supportMethod"
                        label="Phương pháp hỗ trợ"
                    >
                        <Select mode="multiple">
                            <Option value="counseling">Tư vấn trực tuyến</Option>
                            <Option value="community">Cộng đồng hỗ trợ</Option>
                            <Option value="family">Hỗ trợ từ gia đình</Option>
                            <Option value="medication">Thuốc hỗ trợ</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="trackingPreference"
                        label="Tần suất theo dõi"
                    >
                        <Select>
                            <Option value="daily">Hàng ngày</Option>
                            <Option value="weekly">Hàng tuần</Option>
                            <Option value="biweekly">2 tuần/lần</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="reminderTime"
                        label="Thời gian nhắc nhở"
                    >
                        <Input type="time" />
                    </Form.Item>
                </Form>
            ),
        },
    ];

    const next = () => {
        setCurrentStep(currentStep + 1);
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <PlanContainer>
            <StyledCard>
                <Steps current={currentStep}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <StepContent>
                    {steps[currentStep].content}
                </StepContent>
                <div style={{ marginTop: 24 }}>
                    {currentStep < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Tiếp theo
                        </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <Button type="primary" onClick={() => console.log('Hoàn thành')}>
                            Hoàn thành
                        </Button>
                    )}
                    {currentStep > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Quay lại
                        </Button>
                    )}
                </div>
            </StyledCard>

            <StyledCard title="Tiến trình thực hiện">
                <Timeline mode="left">
                    <Timeline.Item dot={<CalendarOutlined />}>Bắt đầu kế hoạch cai thuốc</Timeline.Item>
                    <Timeline.Item dot={<CheckOutlined />}>Hoàn thành tuần đầu tiên</Timeline.Item>
                    <Timeline.Item dot={<ClockCircleOutlined />}>Đang thực hiện giai đoạn 2</Timeline.Item>
                </Timeline>
            </StyledCard>
        </PlanContainer>
    );
};

export default Plan; 