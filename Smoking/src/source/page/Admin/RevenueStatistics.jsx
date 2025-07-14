import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Statistic, Spin, message } from 'antd';
import styled from 'styled-components';
import { DollarOutlined, UserOutlined, LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import coachApi from '../Axios/coachApi';

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
  const [loading, setLoading] = useState(true);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [revenueSubscribers, setRevenueSubscribers] = useState(0);
  const [revenueAvg, setRevenueAvg] = useState(0);
  const [mostPopularPackage, setMostPopularPackage] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyUsers, setMonthlyUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      coachApi.getRevenueTotal(),
      coachApi.getRevenueSubscribers(),
      coachApi.getRevenueAvgPerMember(),
      coachApi.getMostPopularPackage(),
      coachApi.getRevenueMonthly(),
      coachApi.getUsersMonthly()
    ])
      .then(([
        revenueTotalRes,
        revenueSubscribersRes,
        revenueAvgRes,
        mostPopularPackageRes,
        monthlyRevenueRes,
        monthlyUsersRes
      ]) => {
        setRevenueTotal(revenueTotalRes.data);
        setRevenueSubscribers(revenueSubscribersRes.data);
        setRevenueAvg(revenueAvgRes.data);
        setMostPopularPackage(mostPopularPackageRes.data);
        setMonthlyRevenue(monthlyRevenueRes.data);
        setMonthlyUsers(monthlyUsersRes.data);
      })
      .catch(() => {
        message.error('Lỗi khi tải dữ liệu thống kê doanh thu!');
      })
      .finally(() => setLoading(false));
  }, []);

  // Dữ liệu tổng quan
  const overallStats = [
    { icon: <DollarOutlined style={{ color: '#52c41a' }} />, title: 'Tổng Doanh Thu', value: revenueTotal, suffix: 'VNĐ' },
    { icon: <UserOutlined style={{ color: '#1890ff' }} />, title: 'Tổng Người Dùng Premium', value: revenueSubscribers },
    { icon: <LineChartOutlined style={{ color: '#eb2f96' }} />, title: 'Doanh thu trung bình / người', value: revenueAvg ? revenueAvg.toLocaleString() + ' VNĐ' : '', suffix: '' },
    { icon: <BarChartOutlined style={{ color: '#faad14' }} />, title: 'Gói Premium phổ biến nhất', value: mostPopularPackage ? mostPopularPackage.packageName : '', suffix: '' },
  ];

  // Dữ liệu biểu đồ doanh thu theo tháng
  const chartRevenue = monthlyRevenue.map(item => ({
    month: `${item.month}/${item.year}`,
    total: item.total
  }));
  // Dữ liệu biểu đồ số người tham gia theo tháng
  const chartUsers = monthlyUsers.map(item => ({
    month: `${item.month}/${item.year}`,
    total: item.total
  }));

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

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : (
        <>
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
                      valueStyle={{ color: '#3f8600' }}
                      suffix={stat.suffix}
                    />
                  </StyledCard>
                </Col>
              ))}
            </Row>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={3}>Doanh thu theo tháng</Title>
            <StyledCard>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} VNĐ`} />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </StyledCard>
          </div>

          <div>
            <Title level={3}>Số người tham gia theo tháng</Title>
            <StyledCard>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#82ca9d" name="Số người tham gia" />
                </BarChart>
              </ResponsiveContainer>
            </StyledCard>
          </div>
        </>
      )}
    </Container>
  );
};

export default RevenueStatistics; 