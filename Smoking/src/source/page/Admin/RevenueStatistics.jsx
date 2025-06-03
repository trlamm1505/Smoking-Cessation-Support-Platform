import React from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import styled from 'styled-components';
import { DollarOutlined, UserOutlined, LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

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
  background-color: #e0f2f1; /* Light teal background */
  padding: 16px 24px;
  border-radius: 8px;
  border: 1px solid #b2dfdb; /* Teal border */

  .header-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #2c7a75; /* Dark teal color */
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

const RevenueStatistics = () => {
  // Mock data for overall revenue statistics
  const overallStats = [
    { icon: <DollarOutlined style={{ color: '#52c41a' }} />, title: 'Tổng Doanh Thu', value: 15000000, suffix: 'VNĐ' },
    { icon: <UserOutlined style={{ color: '#1890ff' }} />, title: 'Tổng Người Dùng Premium', value: 250 },
    { icon: <LineChartOutlined style={{ color: '#eb2f96' }} />, title: 'Doanh thu trung bình / người', value: '60,000 VNĐ' },
    { icon: <BarChartOutlined style={{ color: '#faad14' }} />, title: 'Gói Premium phổ biến nhất', value: 'Gói 3 tháng' },
  ];

   // Mock data for daily revenue and user participation
   const dailyData = [
      { date: '01/03', revenue: 500000, users: 10 },
      { date: '02/03', revenue: 750000, users: 15 },
      { date: '03/03', revenue: 600000, users: 12 },
      { date: '04/03', revenue: 900000, users: 18 },
      { date: '05/03', revenue: 800000, users: 14 },
      { date: '06/03', revenue: 1200000, users: 25 },
      { date: '07/03', revenue: 1100000, users: 22 },
   ];

    // Mock data for weekly user participation
    const weeklyUserData = [
        { week: 'Tuần 1', users: 70 },
        { week: 'Tuần 2', users: 90 },
        { week: 'Tuần 3', users: 65 },
        { week: 'Tuần 4', users: 110 },
    ];

  return (
    <Container>
      <Header>
        <div className="header-title">
          {/* Placeholder for Logo */}
          {/* <img src="/path/to/your/logo.png" alt="Logo" style={{ height: '30px' }} /> */}
          <DollarOutlined /> {/* Icon for Revenue Statistics */}
          <Title level={2} style={{ margin: 0 }}>Thống kê Doanh thu</Title>
        </div>
      </Header>

      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Tổng quan doanh thu</Title>
        <Row gutter={[16, 16]}>
          {overallStats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <StyledCard>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  valueStyle={{ color: '#3f8600' }} // Example value color (green for positive)
                  suffix={stat.suffix}
                />
              </StyledCard>
            </Col>
          ))}
        </Row>
      </div>

      <div style={{ marginBottom: 24 }}>
         <Title level={3}>Doanh thu theo ngày</Title>
         <StyledCard>
             <ResponsiveContainer width="100%" height={300}>
                 <LineChart data={dailyData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="date" />
                     <YAxis />
                     <Tooltip formatter={(value) => `${value.toLocaleString()} VNĐ`} />
                     <Legend />
                     <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
                 </LineChart>
             </ResponsiveContainer>
         </StyledCard>
      </div>

      <div>
        <Title level={3}>Số người tham gia theo tuần</Title>
         <StyledCard>
            <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={weeklyUserData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="week" />
                     <YAxis />
                     <Tooltip />
                     <Legend />
                     <Bar dataKey="users" fill="#82ca9d" name="Số người tham gia" />
                 </BarChart>
            </ResponsiveContainer>
         </StyledCard>
      </div>

    </Container>
  );
};

export default RevenueStatistics; 