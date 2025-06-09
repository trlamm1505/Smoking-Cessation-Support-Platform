import React, { useState } from 'react';
import { Tabs, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

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

// Demo data mới
const notifications = [
    {
        id: 1,
        name: 'Hệ thống',
        content: 'Chúc mừng bạn đã đạt thành tích "7 ngày không hút thuốc"! Tiếp tục cố gắng nhé!',
        time: '2 giờ trước',
        avatar: '',
        unread: true,
        section: 'today',
        type: 'achievement',
    },
    {
        id: 2,
        name: 'Bác sĩ Nguyễn Văn A',
        content: 'đã xác nhận lịch hẹn tư vấn của bạn vào 15:00 ngày 20/06/2024.',
        time: '4 giờ trước',
        avatar: '',
        unread: true,
        section: 'today',
        type: 'appointment',
    },
    {
        id: 3,
        name: 'Blog SmokeFree',
        content: 'vừa đăng bài viết mới: "5 mẹo vượt qua cơn thèm thuốc hiệu quả".',
        time: '1 ngày trước',
        avatar: '',
        unread: false,
        section: 'before',
        type: 'blog',
    },
    // Thêm 3 thông báo hôm nay mới
    {
        id: 9,
        name: 'Hệ thống',
        content: 'Bạn vừa hoàn thành mục tiêu không hút thuốc trong 24 giờ! Hãy tiếp tục phát huy!',
        time: '30 phút trước',
        avatar: '',
        unread: true,
        section: 'today',
        type: 'achievement',
    },
    {
        id: 10,
        name: 'Bác sĩ Trần Thị B',
        content: 'đã xác nhận lại lịch hẹn tư vấn của bạn vào 17:00 hôm nay.',
        time: '1 giờ trước',
        avatar: '',
        unread: true,
        section: 'today',
        type: 'appointment',
    },
    {
        id: 11,
        name: 'Blog SmokeFree',
        content: 'vừa đăng bài viết mới: "Cách kiểm soát cảm xúc khi cai thuốc".',
        time: '10 phút trước',
        avatar: '',
        unread: true,
        section: 'today',
        type: 'blog',
    },
    // Demo thêm nhiều thông báo cũ để test load more
    {
        id: 4,
        name: 'Hệ thống',
        content: 'Bạn đã đạt thành tích "30 ngày không hút thuốc"! Tuyệt vời!',
        time: '3 ngày trước',
        avatar: '',
        unread: false,
        section: 'before',
        type: 'achievement',
    },
    {
        id: 5,
        name: 'Blog SmokeFree',
        content: 'vừa đăng bài viết mới: "Làm sao vượt qua stress khi cai thuốc?".',
        time: '5 ngày trước',
        avatar: '',
        unread: false,
        section: 'before',
        type: 'blog',
    },
    {
        id: 6,
        name: 'Hệ thống',
        content: 'Bạn đã xác nhận lịch hẹn với chuyên gia vào 10:00 ngày 10/06/2024.',
        time: '7 ngày trước',
        avatar: '',
        unread: false,
        section: 'before',
        type: 'appointment',
    },
    {
        id: 7,
        name: 'Blog SmokeFree',
        content: 'vừa đăng bài viết mới: "Những lợi ích bất ngờ khi bỏ thuốc lá".',
        time: '10 ngày trước',
        avatar: '',
        unread: false,
        section: 'before',
        type: 'blog',
    },
    {
        id: 8,
        name: 'Hệ thống',
        content: 'Bạn đã đạt thành tích "100 ngày không hút thuốc"! Bạn là người truyền cảm hứng!',
        time: '20 ngày trước',
        avatar: '',
        unread: false,
        section: 'before',
        type: 'achievement',
    },
];

const Notification = ({ visible, onClose }) => {
    const [beforeCount, setBeforeCount] = useState(1); // Số trang thông báo cũ đã load
    const PAGE_SIZE = 3;

    if (!visible) return null;

    // Luôn lấy tất cả thông báo (không filter theo tab)
    const today = notifications.filter((n) => n.section === 'today');
    const beforeAll = notifications.filter((n) => n.section === 'before');
    const before = beforeAll.slice(0, beforeCount * PAGE_SIZE);
    const hasMore = before.length < beforeAll.length;

    return (
        <PanelWrapper>
            <PanelHeader>
                <div style={{ color: '#2c7a75', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Thông báo</div>
            </PanelHeader>
            <PanelBody>
                {today.length > 0 && <SectionTitle>Hôm nay</SectionTitle>}
                {today.map((n) => (
                    <NotificationItem key={n.id} unread={n.unread}>
                        <Avatar size={44} icon={<UserOutlined />} src={n.avatar} />
                        <div style={{ flex: 1 }}>
                            <div>
                                <Name>{n.name}</Name> <Content>{n.content}</Content>
                            </div>
                            <Time>{n.time}</Time>
                        </div>
                        {n.unread && <Dot />}
                    </NotificationItem>
                ))}
                {before.length > 0 && <SectionTitle>Trước đó</SectionTitle>}
                {before.map((n) => (
                    <NotificationItem key={n.id} unread={n.unread}>
                        <Avatar size={44} icon={<UserOutlined />} src={n.avatar} />
                        <div style={{ flex: 1 }}>
                            <div>
                                <Name>{n.name}</Name> <Content>{n.content}</Content>
                            </div>
                            <Time>{n.time}</Time>
                        </div>
                        {n.unread && <Dot />}
                    </NotificationItem>
                ))}
                {hasMore && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 0 0' }}>
                        <LoadMoreButton onClick={() => setBeforeCount(beforeCount + 1)}>
                            Xem thông báo trước đó
                        </LoadMoreButton>
                    </div>
                )}
                {today.length === 0 && before.length === 0 && (
                    <div style={{ color: '#b0b3b8', textAlign: 'center', marginTop: 40 }}>Không có thông báo nào.</div>
                )}
            </PanelBody>
        </PanelWrapper>
    );
};

export default Notification; 