import React, { useState, useEffect } from 'react';
import { Tabs, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axiosClient from '../Axios/AxiosCLients';

const { TabPane } = Tabs;

const PanelWrapper = styled.div`
  position: fixed;
  top: 72px;
  right: 32px;
  width: 400px;
  height: calc(100vh - 88px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(95, 184, 179, 0.10);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  border: 1.5px solid #E3F6F5;
  animation: fadeInNoti 0.18s;
  @keyframes fadeInNoti {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: none; }
  }
`;

const SectionTitle = styled.div`
  color: #2c7a75;
  font-size: 1rem;
  font-weight: 700;
  margin: 1.2rem 0 0.5rem 0.5rem;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 0.9rem 0.7rem 0.9rem 0.7rem;
  border-radius: 10px;
  background: ${({ unread }) => (unread ? '#f0f8f7' : '#fff')};
  margin-bottom: 8px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  border-left: 5px solid ${({ unread }) => (unread ? '#5FB8B3' : 'transparent')};
  box-shadow: ${({ unread }) => (unread ? '0 2px 8px rgba(95,184,179,0.08)' : 'none')};
  &:hover {
    background: #e8f4f3;
    box-shadow: 0 4px 16px rgba(95,184,179,0.10);
  }
`;

const Name = styled.span`
  color: #2c3e50;
  font-weight: 700;
`;
const Content = styled.span`
  color: #2c3e50;
`;
const Time = styled.div`
  color: #5FB8B3;
  font-size: 0.95rem;
  margin-top: 2px;
`;
const Dot = styled.span`
  width: 10px;
  height: 10px;
  background: #5FB8B3;
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
`;
const ActionButtons = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const PanelHeader = styled.div`
  padding: 1.2rem 1.5rem 0.5rem 1.5rem;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const PanelBody = styled.div`
  padding: 0 0.5rem 1rem 0.5rem;
  overflow-y: auto;
  flex: 1;
`;

const LoadMoreButton = styled.button`
  background: linear-gradient(135deg, #5FB8B3, #4A90E2);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(95,184,179,0.12);
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  margin-top: 8px;
  &:hover {
    background: linear-gradient(135deg, #4A90E2, #5FB8B3);
    box-shadow: 0 4px 16px rgba(95,184,179,0.18);
    transform: translateY(-2px) scale(1.03);
  }
`;

// Thêm hàm formatTimeAgo
function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000); // giây

  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;

  // Nếu quá 30 ngày thì hiện ngày/tháng/năm
  return date.toLocaleDateString('vi-VN');
}

const Notification = ({ visible, onClose, userId, onUpdateUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [beforeCount, setBeforeCount] = useState(1); // Số trang thông báo cũ đã load
  const PAGE_SIZE = 3;
  // Nếu không truyền userId qua prop thì lấy từ localStorage
  const realUserId = userId || localStorage.getItem('userId');

  useEffect(() => {
    if (!visible || !realUserId) return;
    setLoading(true);
    axiosClient.get(`/api/notifications/inbox/${realUserId}`)
      .then(res => {
        console.log('Notification API data:', res.data);
        const notifications = Array.isArray(res.data)
          ? res.data.map(n => ({
            ...n.notification, // flatten các trường trong notification ra ngoài
            unread: n.read === false,
            readAt: n.readAt
          }))
          : [];
        setNotifications(notifications);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Notification API error:', err);
        setLoading(false);
      });
  }, [visible, realUserId]);

  // Bỏ filter theo section, chỉ hiển thị tất cả thông báo
  const allNotifications = notifications;

  const handleMarkRead = (notification) => {
    if (!notification.unread) return;
    const userId = notification.recipientId || localStorage.getItem('userId');
    axiosClient.post('/api/notifications/mark-read', {
      notificationId: notification.id,
      userId: userId,
    }).then(res => {
      setNotifications((prev) => prev.map(n => n.id === notification.id ? { ...n, unread: false } : n));
      if (onUpdateUnreadCount) onUpdateUnreadCount();
    });
  };

  if (!visible) return null;

  return (
    <PanelWrapper>
      <PanelHeader>
        <div style={{ color: '#2c7a75', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Thông báo</div>
      </PanelHeader>
      <PanelBody>
        {loading && <div style={{ color: '#b0b3b8', textAlign: 'center', marginTop: 40 }}>Đang tải...</div>}
        {!loading && (
          <>
            {allNotifications.length > 0 ? (
              allNotifications.map((n) => (
                <NotificationItem key={n.id} unread={n.unread} onClick={() => handleMarkRead(n)}>
                  <div style={{ flex: 1 }}>
                    <div>
                      <Name>{n.title || n.name}</Name> <Content>{n.content}</Content>
                    </div>
                    <Time>{formatTimeAgo(n.createdAt || n.time)}</Time>
                  </div>
                  {n.unread && <Dot />}
                </NotificationItem>
              ))
            ) : (
              <div style={{ color: '#b0b3b8', textAlign: 'center', marginTop: 40 }}>Không có thông báo nào.</div>
            )}
          </>
        )}
      </PanelBody>
    </PanelWrapper>
  );
};

export default Notification; 