import React from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import styled from 'styled-components';
import { UserOutlined, CalendarOutlined, SmileOutlined, LineChartOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
// You might need charting libraries like Chart.js or Recharts here
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: #e0f2f1;
  padding: 16px 24px;
  border-radius: 8px;
  border: 1px solid #b2dfdb;

  .header-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #2c7a75;
    font-size: 24px;
    font-weight: 600;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  .ant-card-body {
      padding: 20px; /* Slightly more padding */
  }
`;

const Statistics = () => {
  // Mock data - replace with API calls
  const stats = [
    { icon: <UserOutlined style={{ color: '#1890ff' }} />, title: 'Tổng số thành viên', value: 150 },
    { icon: <CalendarOutlined style={{ color: '#52c41a' }} />, title: 'Buổi tư vấn đã hoàn thành', value: 320 },
    { icon: <SmileOutlined style={{ color: '#faad14' }} />, title: 'Tỷ lệ thành công (ước tính)', value: '85%' },
    { icon: <LineChartOutlined style={{ color: '#eb2f96' }} />, title: 'Trung bình thời gian đồng hành', value: '60 ngày' },
  ];

  // Mock data for charts - replace with API calls
  const weeklyConsultations = [
    { week: 'Tuần 1', consultations: 12 },
    { week: 'Tuần 2', consultations: 15 },
    { week: 'Tuần 3', consultations: 10 },
    { week: 'Tuần 4', consultations: 18 },
  ];

  return (
    <Container>
      <Header>
        <div className="header-title">
          {/* Placeholder for Logo */}
          {/* <img src="/path/to/your/logo.png" alt="Logo" style={{ height: '30px' }} /> */}
          <BarChartOutlined /> {/* Icon for Statistics/Reports */}
          <Title level={2} style={{ margin: 0 }}>Báo cáo và Thống kê</Title>
        </div>
        {/* Optional: Add buttons or other elements on the right side of the header */}
      </Header>

      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Tổng quan</Title>
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <StyledCard>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  valueStyle={{ color: '#3f8600' }} // Example value color
                />
              </StyledCard>
            </Col>
          ))}
        </Row>
      </div>

      <div>
        <Title level={3}>Biểu đồ hoạt động</Title>
        <StyledCard>
          {/* Placeholder for charts */}
          {/* <div style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#999' }}>
            Khu vực hiển thị biểu đồ (Ví dụ: số buổi tư vấn theo tuần, tỷ lệ bỏ thuốc theo thời gian...)<br/>(Cần tích hợp thư viện biểu đồ)
            
          </div> */}
            <ResponsiveContainer width="100%" height={300}> {/* Set specific height */}
              <BarChart data={weeklyConsultations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                {/* <Tooltip /> */}
                <Legend />
                <Bar dataKey="consultations" fill="#8884d8" name="Số buổi tư vấn" />
              </BarChart>
            </ResponsiveContainer>
          
        </StyledCard>
      </div>

      {/* Add more sections for different reports/statistics */}

    </Container>
  );
};

export default Statistics; 