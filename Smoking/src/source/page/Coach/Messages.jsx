import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Avatar, Space, Typography } from 'antd';
import styled from 'styled-components';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const Container = styled.div`
  display: flex;
  height: calc(100vh - 100px); /* Adjusted height */
  background: #f8f8f8; /* Light grey background for container */
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #ffffff; /* White background for sidebar */
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 16px 0; /* Add vertical padding */
`;

const SidebarHeader = styled.div`
  padding: 0 16px 16px 16px; /* Padding bottom */
  font-weight: bold;
  font-size: 18px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px; /* Space after border */
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff; /* White background for chat area */
`;

const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: bold;
  font-size: 18px;
  background-color: #f8f8f8; /* Light grey background for header */
`;

const MessageList = styled.div`
  flex-grow: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column; /* Arrange messages vertically */
`;

const MessageInputArea = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
  background-color: #f8f8f8; /* Light grey background for input area */
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px 14px; /* Slightly more padding */
  border-radius: 18px; /* More rounded corners */
  margin-bottom: 12px; /* More space between messages */
  word-wrap: break-word;
  align-self: ${props => props.isCoach ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isCoach ? '#1890ff' : '#e9e9eb'}; /* Ant Design primary blue vs Light grey */
  color: ${props => props.isCoach ? 'white' : '#333'};

  /* Add a small tail */
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    ${props => props.isCoach ? 'right: -7px;' : 'left: -7px;'}
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-bottom-color: ${props => props.isCoach ? '#1890ff' : '#e9e9eb'};
    border-bottom-width: 8px;
    border-radius: 0 0 0 18px;
    transform: ${props => props.isCoach ? 'translateX(5px) rotate(-35deg)' : 'translateX(-5px) rotate(35deg)'}; /* Adjusted rotation */
  }
`;

const Messages = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  // State to hold messages for the selected member
  const [currentMessages, setCurrentMessages] = useState([]);

  // Ref for the message list to enable scrolling
  const messageListRef = useRef(null);

  // Mock data: List of members
  const members = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' },
  ];

  // Mock data: Sample messages (keyed by memberId)
  const allMockMessages = {
    1: [
      { id: 1, text: 'Chào Coach! Em có một vài thắc mắc về kế hoạch tuần này.', sender: 'member', timestamp: '10:00' },
      { id: 2, text: 'Chào bạn, bạn cứ hỏi nhé. Tôi ở đây để hỗ trợ.', sender: 'coach', timestamp: '10:05' },
      { id: 3, text: 'Em thấy việc ghi nhật ký hàng ngày hơi khó khăn.', sender: 'member', timestamp: '10:10' },
      { id: 4, text: 'Đừng lo lắng. Hãy cố gắng viết ngắn gọn những điểm chính thôi.', sender: 'coach', timestamp: '10:15' },
      { id: 5, text: 'Feedback: Tôi thấy bạn đang làm rất tốt. Hãy duy trì đều đặn việc theo dõi tiến độ mỗi ngày nhé!', sender: 'coach', timestamp: '10:20', isFeedback: true },
    ],
    2: [
        { id: 6, text: 'Coach ơi, em muốn hỏi về cách vượt qua cơn thèm thuốc đột ngột.', sender: 'member', timestamp: '09:30' },
         { id: 7, text: 'Chào bạn, khi cảm thấy thèm thuốc, hãy thử uống một ngụm nước hoặc hít thở sâu nhé.', sender: 'coach', timestamp: '09:35' },
    ],
     3: [
        { id: 8, text: 'Chào Coach, em đã hoàn thành mục tiêu tuần này!', sender: 'member', timestamp: '11:00' },
        { id: 9, text: 'Chúc mừng bạn! Rất tuyệt vời!', sender: 'coach', timestamp: '11:05' },
    ]
  };

  // Effect to load messages when a member is selected and scroll to bottom
  useEffect(() => {
    if (selectedMember) {
      // In a real app, fetch messages for selectedMember.id from backend
      setCurrentMessages(allMockMessages[selectedMember.id] || []);
      // Scroll to bottom when messages load
      scrollToBottom();
    } else {
       setCurrentMessages([]);
    }
  }, [selectedMember]); // Rerun when selectedMember changes

   // Effect to scroll to bottom when new messages are added
   useEffect(() => {
       scrollToBottom();
   }, [currentMessages]); // Rerun when currentMessages changes

   const scrollToBottom = () => {
       if (messageListRef.current) {
           messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
       }
   };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedMember) {
      // TODO: Implement send message logic (API call)
      console.log(`Sending message to ${selectedMember.name}: ${messageInput}`);

      const newMessage = {
          id: currentMessages.length + 1, // Simple mock ID
          text: messageInput,
          sender: 'coach', // Sent by coach
          timestamp: dayjs().format('HH:mm'), // Current time
      };

      // For mock, add the new message to the current messages state
      // In a real app, you'd add the message to state AFTER successful API response
      setCurrentMessages(prevMessages => [...prevMessages, newMessage]);

      setMessageInput(''); // Clear input
    }
  };

   const renderMessage = (msg) => (
       <MessageBubble key={msg.id} isCoach={msg.sender === 'coach'}>
           {/* Optional: Add sender name/avatar for group chats */}
           <Text>{msg.text}</Text>
            <div style={{ fontSize: '10px', color: msg.isCoach ? 'rgba(255, 255, 255, 0.7)' : '#666', textAlign: msg.isCoach ? 'right' : 'left', marginTop: '4px' }}>
              {msg.timestamp}
            </div>
       </MessageBubble>
   );

    // Function to generate avatar background color based on name (simple hash)
    const getAvatarColor = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    };

    // Function to get initials for avatar
    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length > 1) {
            return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
        } else if (name.length > 0) {
            return name.charAt(0);
        }
        return '';
    };



  return (
    <Container>
      <Sidebar>
        <SidebarHeader>Danh sách thành viên</SidebarHeader>
        <List
          itemLayout="horizontal"
          dataSource={members}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              onClick={() => setSelectedMember(item)}
              style={{ cursor: 'pointer', background: selectedMember?.id === item.id ? '#e6f7ff' : 'transparent', padding: '12px 16px' }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: getAvatarColor(item.name), verticalAlign: 'middle' }} size="default">
                      {getInitials(item.name)}
                  </Avatar>
                 }
                title={<Text strong>{item.name}</Text>}
              />
            </List.Item>
          )}
        />
      </Sidebar>
      <Content>
        {selectedMember ? (
          <>
            <ChatHeader>{selectedMember.name}</ChatHeader>
            <MessageList ref={messageListRef}> {/* Attach ref here */}
              {currentMessages.map(msg => renderMessage(msg))}
            </MessageList>
            <MessageInputArea>
              <Input.TextArea
                rows={1}
                placeholder="Nhập tin nhắn hoặc feedback..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onPressEnter={(e) => {
                  e.preventDefault(); // Prevent new line
                  handleSendMessage();
                }}
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{ borderRadius: '20px', padding: '8px 16px' }}
              />
              <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={handleSendMessage} />
            </MessageInputArea>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, color: '#999', fontSize: '18px' }}>
            Chọn một thành viên để bắt đầu trò chuyện
          </div>
        )}
      </Content>
    </Container>
  );
};

export default Messages; 