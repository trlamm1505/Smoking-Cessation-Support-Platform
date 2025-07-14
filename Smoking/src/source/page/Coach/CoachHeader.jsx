import React, { useState, useEffect } from 'react';
import CoachNavIcons from './CoachNavIcons';
import { BellOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import Notification from './Notification';
import axiosClient from '../Axios/AxiosCLients';

const CoachHeader = ({ className }) => {
  const [notiOpen, setNotiOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    axiosClient.get(`/api/notifications/unread-count/${userId}`)
      .then(res => setUnreadCount(res.data.unreadCount));

    const interval = setInterval(() => {
      axiosClient.get(`/api/notifications/unread-count/${userId}`)
        .then(res => setUnreadCount(res.data.unreadCount));
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  const updateUnreadCount = () => {
    axiosClient.get(`/api/notifications/unread-count/${userId}`)
      .then(res => setUnreadCount(res.data.unreadCount));
  };

  return (
    <header className={`bg-white p-4 flex items-center justify-end shadow-md ${className}`}>
      <div className="flex items-center gap-6">
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => setNotiOpen((open) => !open)}
          aria-label="Thông báo"
        >
          <Badge count={Number(unreadCount)} showZero style={{ backgroundColor: '#5FB8B3' }}>
            <BellOutlined style={{ color: notiOpen ? '#5FB8B3' : '#666' }} className="text-2xl" />
          </Badge>
        </button>
        <CoachNavIcons />
      </div>
      <Notification
        visible={notiOpen}
        onClose={() => setNotiOpen(false)}
        userId={userId}
        onUpdateUnreadCount={updateUnreadCount}
      />
    </header>
  );
};

export default CoachHeader;