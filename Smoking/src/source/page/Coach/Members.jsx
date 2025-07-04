import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tag, Space, Modal, message, Typography, Card, Row, Col, Progress as AntProgress, List, Spin } from 'antd';
import styled from 'styled-components';
import { SearchOutlined, UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, CheckCircleOutlined, HeartOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import coachApi from '../Axios/coachApi';

const { Title, Text } = Typography;

const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
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

const SearchBar = styled(Input)`
  width: 300px;
  border-radius: 20px;
  border-color: #d9d9d9;
  &:hover {
    border-color: #40a9ff;
  }
`;

const StatusTag = styled(Tag)`
  border-radius: 12px;
  padding: 4px 12px;
  font-weight: 500;
`;

const MemberDetailContainer = styled.div`
  padding: 16px;
`;

const MemberStatsGrid = styled(Row)`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const StyledCard = styled(Card)`
    margin-bottom: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);

    .ant-card-head-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }
    .ant-card-body {
      padding: 20px;
    }
`;

const JournalEntry = styled(Card)`
    margin-bottom: 12px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    .ant-card-body {
        padding: 12px;
    }
    .ant-card-head-title {
      font-size: 14px;
      font-weight: 500;
      color: #555;
    }
`;

const Members = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch consultation data from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const coachId = localStorage.getItem('coachId');
        if (!coachId) {
          message.error('Không tìm thấy coachId!');
          setLoading(false);
          return;
        }

        const response = await coachApi.getCoachConsultations(coachId);
        const consultations = response.data || [];

        // Transform consultation data to match the table structure
        // Lọc trùng thành viên theo email, chỉ lấy lịch tư vấn gần nhất
        const memberMap = new Map();
        consultations.forEach(consultation => {
          const key = consultation.email || consultation.userId;
          // Nếu đã có, chỉ giữ lại lịch tư vấn mới nhất (so sánh scheduledTime)
          if (!memberMap.has(key) || dayjs(consultation.scheduledTime).isAfter(dayjs(memberMap.get(key).scheduledTime))) {
            memberMap.set(key, consultation);
          }
        });
        const uniqueConsultations = Array.from(memberMap.values());
        const transformedMembers = uniqueConsultations.map(consultation => ({
          id: consultation.consultationId,
          name: consultation.fullName,
          phone: consultation.phoneNumber,
          email: consultation.email,
          status: consultation.status === 'approved' ? 'approved' : consultation.status === 'pending' ? 'pending' : 'cancelled',
          lastConsultation: dayjs(consultation.scheduledTime).format('YYYY-MM-DD'),
          progress: consultation.status === 'approved' ? 75 : consultation.status === 'pending' ? 30 : consultation.status === 'cancelled' ? 0 : 100,
          meetingLink: consultation.meetingLink,
          details: {
            startDate: dayjs(consultation.scheduledTime).format('YYYY-MM-DD'),
            targetDate: dayjs(consultation.endTime).format('YYYY-MM-DD'),
            cigarettesPerDay: 20, // Default value since API doesn't provide this
            quitReason: 'Vì sức khỏe gia đình', // Default value since API doesn't provide this
            journal: [
              { date: dayjs(consultation.scheduledTime).format('YYYY-MM-DD'), entry: `Buổi tư vấn với ${consultation.fullName} - ${consultation.notes || 'Không có ghi chú'}` },
            ],
            achievements: [
              'Đặt lịch tư vấn thành công',
              consultation.status === 'approved' ? 'Buổi tư vấn đã được xác nhận' : 'Đang chờ xác nhận',
            ]
          }
        }));

        setMembers(transformedMembers);
      } catch (error) {
        console.error('Error fetching consultations:', error);
        message.error('Lỗi khi tải danh sách thành viên!');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#5FB8B3' }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <Space>
          <PhoneOutlined style={{ color: '#5FB8B3' }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <MailOutlined style={{ color: '#5FB8B3' }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          active: { color: 'success', text: 'Đang tư vấn' },
          completed: { color: 'default', text: 'Hoàn thành' },
          paused: { color: 'warning', text: 'Tạm dừng' },
          approved: { color: 'success', text: 'Đã xác nhận' },
          pending: { color: 'warning', text: 'Chờ xác nhận' },
          cancelled: { color: 'error', text: 'Đã hủy' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <StatusTag color={config.color}>{config.text}</StatusTag>;
      },
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <AntProgress percent={progress} size="small" showInfo={false} />,
    },
    {
      title: 'Lần tư vấn cuối',
      dataIndex: 'lastConsultation',
      key: 'lastConsultation',
      render: (date) => <Text>{date}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setIsModalVisible(true);
  };

  const handleScheduleConsultation = (member) => {
    message.info(`Đặt lịch tư vấn cho ${member.name} - Chức năng này sẽ được triển khai.`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.phone.includes(searchText) ||
      member.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <div className="header-title">
          {/* Placeholder for Logo */}
          {/* <img src="/path/to/your/logo.png" alt="Logo" style={{ height: '30px' }} /> */}
          <UserOutlined />
          <Title level={2} style={{ margin: 0 }}>Danh sách thành viên</Title>
        </div>
        <SearchBar
          placeholder="Tìm kiếm theo tên, số điện thoại, email..."
          prefix={<SearchOutlined style={{ color: '#5FB8B3' }} />}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Đang tải danh sách thành viên...</div>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={filteredMembers
              .slice()
              .sort((a, b) => new Date(b.lastConsultation) - new Date(a.lastConsultation))
            }
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} thành viên`,
            }}
            bordered={false}
            locale={{
              emptyText: 'Chưa có thành viên nào đặt lịch tư vấn'
            }}
          />
        </>
      )}

      <Modal
        title={selectedMember ? `Chi tiết thành viên: ${selectedMember.name}` : 'Chi tiết thành viên'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="schedule" type="primary" onClick={() => handleScheduleConsultation(selectedMember)} disabled>
            Đặt lịch tư vấn
          </Button>,
        ]}
        width={800}
        centered
        bodyStyle={{ padding: '24px' }}
      >
        {selectedMember && (
          <MemberDetailContainer>
            <Title level={4}>Thông tin cơ bản</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}><Text strong>Ngày bắt đầu cai thuốc:</Text> {selectedMember.details.startDate}</Col>
              <Col span={12}><Text strong>Ngày mục tiêu:</Text> {selectedMember.details.targetDate}</Col>
              <Col span={12}><Text strong>Số điếu/ngày (ban đầu):</Text> {selectedMember.details.cigarettesPerDay}</Col>
              <Col span={12}><Text strong>Lý do cai thuốc:</Text> {selectedMember.details.quitReason}</Col>
            </Row>

            <Title level={4} style={{ marginTop: 20 }}>Thống kê và Tiến độ</Title>
            <MemberStatsGrid gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <StyledCard size="small" title="Tiến độ cai thuốc">
                  <AntProgress percent={selectedMember.progress} showInfo={true} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                  <Text>{selectedMember.progress}% hoàn thành</Text>
                </StyledCard>
              </Col>
              <Col xs={24} sm={12}>
                <StyledCard size="small" title="Thành tích">
                  <List
                    size="small"
                    dataSource={selectedMember.details.achievements}
                    renderItem={(item, index) => <List.Item key={index}><TrophyOutlined style={{ color: '#faad14' }} /> {item}</List.Item>}
                  />
                </StyledCard>
              </Col>
            </MemberStatsGrid>

            <Title level={4} style={{ marginTop: 20 }}>Nhật ký hàng ngày</Title>
            {selectedMember.details.journal && selectedMember.details.journal.length > 0 ? (
              <List
                dataSource={selectedMember.details.journal}
                renderItem={(item, index) => (
                  <JournalEntry key={index} title={dayjs(item.date).format('DD/MM/YYYY')}>
                    <Text>{item.entry}</Text>
                  </JournalEntry>
                )}
              />
            ) : (
              <Text type="secondary">Chưa có mục nhật ký nào.</Text>
            )}


          </MemberDetailContainer>
        )}
      </Modal>
    </Container>
  );
};

export default Members; 