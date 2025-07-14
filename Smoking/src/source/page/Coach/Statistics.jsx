import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Statistic, Spin, message } from 'antd';
import styled from 'styled-components';
import { UserOutlined, CalendarOutlined, SmileOutlined, LineChartOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
// You might need charting libraries like Chart.js or Recharts here
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
  // Lấy coachId từ localStorage
  const coachId = Number(localStorage.getItem('coachId') || localStorage.getItem('userId'));
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coachId) {
      message.error('Không tìm thấy thông tin coach');
      return;
    }
    
    setLoading(true);
    Promise.all([
      coachApi.getConsultationSummary(coachId),
      coachApi.getMonthlyConsultations(coachId)
    ])
      .then(([summaryRes, monthlyRes]) => {
        setSummary(summaryRes.data);
        setMonthlyData(monthlyRes.data);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu thống kê:', err);
        message.error('Lỗi khi tải dữ liệu thống kê');
      })
      .finally(() => setLoading(false));
  }, [coachId]);

  // Chuyển đổi dữ liệu cho biểu đồ
  const chartData = monthlyData.map(item => ({
    month: `${item.month}/${item.year}`,
    totalConsultations: item.totalConsultations
  }));

  const stats = summary ? [
    { icon: <UserOutlined style={{ color: '#1890ff' }} />, title: 'Tổng số thành viên', value: summary.totalMembers },
    { icon: <CalendarOutlined style={{ color: '#52c41a' }} />, title: 'Tổng số buổi tư vấn', value: summary.totalSessions },
    { icon: <SmileOutlined style={{ color: '#faad14' }} />, title: 'Buổi tư vấn đã hoàn thành', value: summary.completedSessions },
    { icon: <LineChartOutlined style={{ color: '#eb2f96' }} />, title: 'Tỷ lệ hoàn thành (%)', value: summary.completionRate },
  ] : [];

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

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : (
        <>
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
                      valueStyle={{ color: '#3f8600' }}
                />
              </StyledCard>
            </Col>
          ))}
        </Row>
      </div>

      <div>
            <Title level={3}>Biểu đồ số buổi tư vấn theo tháng</Title>
        <StyledCard>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                <Legend />
                  <Bar dataKey="totalConsultations" fill="#8884d8" name="Số buổi tư vấn" />
              </BarChart>
            </ResponsiveContainer>
        </StyledCard>
      </div>
        </>
      )}

      {/* Add more sections for different reports/statistics */}

    </Container>
  );
};

export default Statistics; 