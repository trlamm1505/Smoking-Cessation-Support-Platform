import React from 'react';
import { Typography, List, Card, Tag } from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.09);
  }
`;

const NotificationTag = styled(Tag)`
  margin-right: 8px;
`;

const NotificationsPage = () => {
  // Mock notification data for smoking cessation
  const notifications = [
    {
      id: 1,
      type: 'achievement',
      title: 'Chúc mừng bạn đã không hút thuốc trong 7 ngày! 🎉',
      description: 'Đây là một cột mốc quan trọng! Cơ thể bạn đang dần phục hồi. Hãy tiếp tục duy trì thói quen tốt này.',
      timestamp: '2024-03-20T10:00:00Z',
      read: false,
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Nhắc nhở: Buổi tư vấn với chuyên gia sắp tới',
      description: 'Bạn có lịch tư vấn với chuyên gia vào ngày mai lúc 15:00. Hãy chuẩn bị các câu hỏi và chia sẻ về tiến trình của bạn.',
      timestamp: '2024-03-19T15:30:00Z',
      read: false,
    },
    {
      id: 3,
      type: 'motivation',
      title: 'Mẹo vượt qua cơn thèm thuốc',
      description: 'Khi cảm thấy thèm thuốc, hãy thử: 1) Uống một ly nước lọc 2) Hít thở sâu 3) Đi bộ 5 phút. Bạn đang làm rất tốt!',
      timestamp: '2024-03-19T09:00:00Z',
      read: true,
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Thành tích: Tiết kiệm được 500,000đ',
      description: 'Từ khi bắt đầu hành trình bỏ thuốc, bạn đã tiết kiệm được một khoản đáng kể. Hãy dùng số tiền này để tự thưởng cho bản thân!',
      timestamp: '2024-03-18T14:00:00Z',
      read: true,
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Nhắc nhở: Cập nhật nhật ký hút thuốc',
      description: 'Đừng quên cập nhật nhật ký hút thuốc của bạn hôm nay. Theo dõi thường xuyên sẽ giúp bạn nhận biết các tác nhân gây thèm thuốc.',
      timestamp: '2024-03-18T10:00:00Z',
      read: true,
    },
    {
      id: 6,
      type: 'motivation',
      title: 'Sức khỏe của bạn đang cải thiện!',
      description: 'Sau 2 tuần không hút thuốc, chức năng phổi của bạn đã bắt đầu phục hồi. Hãy tiếp tục duy trì thói quen tốt này!',
      timestamp: '2024-03-17T16:00:00Z',
      read: true,
    }
  ];

  const getTagColor = (type) => {
    switch (type) {
      case 'achievement':
        return 'success';
      case 'reminder':
        return 'warning';
      case 'motivation':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getTagText = (type) => {
    switch (type) {
      case 'achievement':
        return 'Thành tích';
      case 'reminder':
        return 'Nhắc nhở';
      case 'motivation':
        return 'Động lực';
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN');
  };

  return (
    <PageContainer>
      <Title level={2}>Thông báo</Title>
      <List
        itemLayout="vertical"
        dataSource={notifications}
        renderItem={item => (
          <StyledCard key={item.id} size="small">
            <List.Item.Meta
              title={
                <div>
                  <NotificationTag color={getTagColor(item.type)}>
                    {getTagText(item.type)}
                  </NotificationTag>
                  <Text strong>{item.title}</Text>
                </div>
              }
              description={
                <>
                  <Text type="secondary">{formatTimestamp(item.timestamp)}</Text>
                  <p>{item.description}</p>
                </>
              }
            />
          </StyledCard>
        )}
      />
    </PageContainer>
  );
};

export default NotificationsPage; 