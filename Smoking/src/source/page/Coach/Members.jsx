import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Modal, message, Typography, Card, Row, Col, Progress as AntProgress, List } from 'antd';
import styled from 'styled-components';
import { SearchOutlined, UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, CheckCircleOutlined, HeartOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SearchBar = styled(Input)`
  width: 300px;
  border-radius: 20px;
`;

const StatusTag = styled(Tag)`
  border-radius: 12px;
  padding: 4px 12px;
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
    .ant-card-head-title {
        font-size: 16px;
    }
`;

const JournalEntry = styled(Card)`
    margin-bottom: 12px;
    border-radius: 8px;
    .ant-card-body {
        padding: 12px;
    }
`;

const Members = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data - replace with API call
  const members = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0987654321', email: 'nguyenvana@example.com', status: 'active', lastConsultation: '2024-03-15', progress: 75,
       details: {
        startDate: '2024-01-01',
        targetDate: '2024-04-01',
        cigarettesPerDay: 20,
        quitReason: 'Vì sức khỏe gia đình',
        journal: [
          { date: '2024-03-20', entry: 'Ngày thứ 80 không hút thuốc. Cảm thấy tràn đầy năng lượng.' },
          { date: '2024-03-19', entry: 'Hơi thèm thuốc vào buổi sáng nhưng đã vượt qua.' },
        ],
        achievements: [
            'Đạt mốc 1 tháng không hút thuốc',
            'Tiết kiệm được 5 triệu đồng',
        ]
      }
     },
    { id: 2, name: 'Trần Thị B', phone: '0123456789', email: 'tranthib@example.com', status: 'paused', lastConsultation: '2024-03-10', progress: 30,
      details: {
        startDate: '2024-02-15',
        targetDate: '2024-05-15',
        cigarettesPerDay: 10,
        quitReason: 'Muốn sống khỏe hơn',
         journal: [
          { date: '2024-03-10', entry: 'Đang gặp khó khăn trong việc giảm số điếu hút.' },
        ],
         achievements: [
            'Giảm số điếu hút hàng ngày',
        ]
      }
    },
    // Add more mock data as needed
  ];

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <Space>
          <PhoneOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
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
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <StatusTag color={config.color}>{config.text}</StatusTag>;
      },
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <AntProgress percent={progress} size="small" />,
    },
    {
      title: 'Lần tư vấn cuối',
      dataIndex: 'lastConsultation',
      key: 'lastConsultation',
    },
     {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
          <Button type="link" onClick={() => handleScheduleConsultation(record)} disabled>
            Đặt lịch
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
        <Title level={2}>Danh sách thành viên</Title>
        <SearchBar
          placeholder="Tìm kiếm theo tên, số điện thoại, email..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Header>

      <Table
        columns={columns}
        dataSource={filteredMembers}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} thành viên`,
        }}
      />

      <Modal
        title={selectedMember ? `Chi tiết thành viên: ${selectedMember.name}` : 'Chi tiết thành viên'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="schedule" type="primary" onClick={() => handleScheduleConsultation(selectedMember)} disabled>
            Đặt lịch tư vấn
          </Button>,
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedMember && (
          <MemberDetailContainer>
            <Title level={4}>Thông tin cơ bản</Title>
             <Row gutter={[16, 16]}>
                <Col span={12}><Text>Ngày bắt đầu cai thuốc:</Text> {selectedMember.details.startDate}</Col>
                <Col span={12}><Text>Ngày mục tiêu:</Text> {selectedMember.details.targetDate}</Col>
                <Col span={12}><Text>Số điếu/ngày (ban đầu):</Text> {selectedMember.details.cigarettesPerDay}</Col>
                <Col span={12}><Text>Lý do cai thuốc:</Text> {selectedMember.details.quitReason}</Col>
             </Row>

             <Title level={4} style={{ marginTop: 20 }}>Thống kê và Tiến độ</Title>
             <MemberStatsGrid gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <StyledCard size="small" title="Tiến độ cai thuốc">
                         <AntProgress percent={selectedMember.progress} />
                         <Text>Đã đạt {selectedMember.progress}% mục tiêu.</Text>
                    </StyledCard>
                </Col>
                 <Col xs={24} sm={12}>
                    <StyledCard size="small" title="Thành tích">
                        <List
                           size="small"
                           dataSource={selectedMember.details.achievements}
                           renderItem={item => <List.Item><Space><TrophyOutlined style={{ color: '#fadb14' }} />{item}</Space></List.Item>}
                        />
                    </StyledCard>
                 </Col>
             </MemberStatsGrid>

             <Title level={4} style={{ marginTop: 20 }}>Nhật ký hàng ngày</Title>
              {
                selectedMember.details.journal.length > 0 ? (
                   <List
                      dataSource={selectedMember.details.journal}
                       renderItem={item => (
                         <JournalEntry size="small" title={item.date}>
                            <Text>{item.entry}</Text>
                         </JournalEntry>
                       )}
                   />
                ) : (
                   <Text type="secondary">Chưa có mục nhật ký nào.</Text>
                )
              }

            {/* TODO: Add more detailed member info, charts, etc. */}
          </MemberDetailContainer>
        )}
      </Modal>
    </Container>
  );
};

export default Members; 