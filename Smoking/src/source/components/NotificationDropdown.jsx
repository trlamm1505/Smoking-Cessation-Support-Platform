import React, { useState } from 'react';
import { Badge, Dropdown, List, Typography, Divider } from 'antd';
import { BellOutlined, CheckCircleOutlined, ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

const StyledNotificationItem = styled(List.Item)`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  .ant-list-item-meta-avatar {
    margin-top: 4px;
  }

  .notification-icon {
    font-size: 20px;
    margin-right: 12px;
  }

  &.unread {
    background-color: #e6f7ff; // Light blue for unread
  }
`;

const NotificationTitle = styled(Text)`
  font-weight: 600;
`;

const NotificationDescription = styled(Text)`
  color: #595959;
`;

const NotificationTimestamp = styled(Text)`
  display: block;
  font-size: 0.8rem;
  color: #8c8c8c;
  margin-top: 4px;
`;

const NotificationDropdown = () => {
  // Mock notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning', // 'info', 'warning', 'error', 'success'
      title: 'Video P1 của buổi học 8 hết hạn!',
      description: 'Bạn tranh thủ xem video và code lại nhé trước khi vào bài học mới.',
      timestamp: '2023-10-27T10:00:00Z',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Video P2 của buổi học 8 hết hạn!',
      description: 'Bạn tranh thủ xem video và code lại nhé trước khi vào bài học mới.',
      timestamp: '2023-10-27T10:00:00Z',
      read: false,
    },
    {
      id: 3,
      type: 'error',
      title: 'Bài tập Trắc nghiệm JS5 quá hạn nộp!',
      description: 'Giờ này vẫn còn ngồi chơi hả Chánh, làm mau lên giúp Cyber đi chứ!',
      timestamp: '2023-10-27T09:00:00Z',
      read: true,
    },
     {
      id: 4,
      type: 'info',
      title: 'Nhắc nhở xem video bài học tiếp theo',
      description: 'Võ Minh Chánh ơi! Buổi học tiếp theo có video xem trước, bạn nhớ xem video xem trước nhé!',
      timestamp: '2023-10-26T18:00:00Z',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(notification => !notification.read).length;
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
    // Optional: Mark all notifications as read when the dropdown is opened
    // setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Implement navigation or other actions based on notification type
    // For example, if type is 'task', navigate to the task page.
    // Mark as read upon clicking
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <ExclamationCircleOutlined style={{ color: '#f5222d' }} />;
      case 'info':
      default:
        return <QuestionCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  // Format timestamp (simple example)
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN'); // Adjust locale as needed
  };

  const menu = (
    <div style={{ width: 350, maxHeight: 400, overflowY: 'auto' }}>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={item => (
          <StyledNotificationItem
            className={!item.read ? 'unread' : ''}
            onClick={() => handleNotificationClick(item)}
          >
            <List.Item.Meta
              avatar={getNotificationIcon(item.type)}
              title={<NotificationTitle>{item.title}</NotificationTitle>}
              description={
                <>
                  <NotificationDescription>{item.description}</NotificationDescription>
                  <NotificationTimestamp>{formatTimestamp(item.timestamp)}</NotificationTimestamp>
                </>
              }
            />
          </StyledNotificationItem>
        )}
      />
      <Divider style={{ margin: '0' }} />
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
         {/* Optional: Add a button to view all notifications */}
         {/* <Button type="link">Xem tất cả</Button> */}
         <Text type="secondary">Không có thông báo mới</Text>
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={handleVisibleChange}
      placement="bottomRight"
    >
      <Badge count={unreadCount} size="small" offset={[0, 0]}>
        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer', color: '#000' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown; 