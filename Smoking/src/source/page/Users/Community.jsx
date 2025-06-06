import React, { useState } from 'react';
import { Card, Avatar, Button, Input, List, Space, Tag, Typography, Modal, message, Tabs, Badge } from 'antd';
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  TrophyOutlined,
  HeartOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  CheckOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%);
  min-height: 100vh;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  .anticon {
    color: #5FB8B3;
    font-size: 28px;
    animation: shine 2s infinite;
  }
  @keyframes shine {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(5deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
`;

const IconEffect = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e6f7f4;
  box-shadow: 0 4px 16px rgba(95, 184, 179, 0.15);
  transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s;
  .anticon {
    color: #5FB8B3;
    font-size: 28px;
    transition: color 0.2s;
  }
  &:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 24px rgba(95, 184, 179, 0.25);
  }
`;

const PostCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  background: white;
  border: none;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(95, 184, 179, 0.12);
  }

  .ant-card-meta {
    margin-bottom: 16px;
  }

  .achievement-badges {
    display: flex;
    gap: 8px;
    margin: 16px 0;
    flex-wrap: wrap;
  }

  .post-stats {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-top: 1px solid #5FB8B3;
    margin-top: 16px;
  }

  .comments-section {
    margin-top: 16px;
    padding: 16px;
    border-top: 1px solid #5FB8B3;
    background-color: rgba(95, 184, 179, 0.05);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const AchievementBadge = styled(Tag)`
  padding: 8px 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  .anticon {
    font-size: 16px;
  }
`;

const CommentAuthor = styled(Text)`
  font-weight: 600;
  color: #5FB8B3; /* Using theme color for author */
`;

const CommentContent = styled(Paragraph)`
  margin-bottom: 0;
  color: #2c3e50; /* A slightly darker color for content */
`;

const AchievementStatButton = styled(Button)`
  background-color: #5FB8B3;
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  height: auto;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  &:hover {
    background-color: #4AA19C; /* Slightly darker shade on hover */
    color: white;
  }

  .anticon {
    font-size: 20px;
  }
`;

const CreatePostButton = styled(Button)`
  margin-bottom: 24px;
  width: 100%;
  height: auto;
  padding: 16px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TopContentContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const CustomModalContent = styled.div`
  padding: 36px 32px 28px 32px;
  border-radius: 32px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(95, 184, 179, 0.12);
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .modal-title {
    font-size: 36px;
    font-weight: 900;
    margin-bottom: 36px;
    background: linear-gradient(90deg, #1890ff 0%, #5FB8B3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    text-align: center;
    letter-spacing: 0.5px;
  }

  .modal-label {
    font-size: 20px;
    font-weight: 700;
    margin: 36px 0 20px 0;
    color: #1a2a3a;
    text-align: center;
    width: 100%;
  }

  textarea {
    border-radius: 22px !important;
    font-size: 19px;
    padding: 24px;
    margin-bottom: 22px;
    border: 1.5px solid #e6f7f6;
    box-shadow: 0 2px 16px rgba(95,184,179,0.10);
    transition: border 0.2s, box-shadow 0.2s;
    width: 100%;
    resize: none;
    color: #222;
    background: #fcfeff;
    min-height: 90px;
    max-height: 180px;
    font-family: inherit;
    display: block;
  }
  textarea::placeholder {
    color: #b5c6d6;
    opacity: 1;
    font-size: 18px;
  }
  textarea:focus {
    border: 1.5px solid #1890ff;
    box-shadow: 0 4px 18px rgba(24,144,255,0.10);
    background: #f6fcff;
  }

  .badge-list {
    display: flex;
    flex-wrap: wrap;
    gap: 18px 16px;
    margin-bottom: 36px;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
  }

  .badge-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 700;
    border-radius: 32px;
    padding: 12px 24px;
    margin: 0 6px 12px 6px;
    cursor: pointer;
    border: none;
    color: #fff;
    box-shadow: 0 2px 12px rgba(24,144,255,0.10);
    background: linear-gradient(90deg, #41c41c 0%, #5FB8B3 100%);
    transition: box-shadow 0.18s, transform 0.18s, background 0.2s, color 0.2s, font-weight 0.2s, filter 0.2s;
    text-align: center;
    white-space: nowrap;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
  }
  .badge-item.badge-green { background: linear-gradient(90deg, #41c41c 0%, #5FB8B3 100%); }
  .badge-item.badge-yellow { background: linear-gradient(90deg, #ffb300 0%, #ffd54f 100%); }
  .badge-item.badge-red { background: linear-gradient(90deg, #ff5c5c 0%, #ffb199 100%); }
  .badge-item.badge-blue { background: linear-gradient(90deg, #4db6ff 0%, #1890ff 100%); }
  .badge-item.selected {
    box-shadow: 0 6px 24px rgba(24,144,255,0.18);
    transform: scale(1.06);
    font-weight: 900;
    border: 1px solid #222;
  }
  .badge-item:hover {
    filter: brightness(1.08);
    box-shadow: 0 8px 28px rgba(24,144,255,0.18);
  }
  .badge-item .anticon {
    font-size: 22px;
    color: #fff;
  }

  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 28px;
    margin-top: 44px;
    width: 100%;
  }
  .modal-btn {
    padding: 12px 28px;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 800;
    border: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.18s;
    box-shadow: 0 2px 12px rgba(95,184,179,0.10);
    margin: 0 8px;
    letter-spacing: 0.5px;
  }
  .modal-btn.cancel {
    background: #f5f5f5;
    color: #333;
  }
  .modal-btn.cancel:hover {
    background: #e0e0e0;
    color: #111;
    transform: scale(1.04);
  }
  .modal-btn.submit {
    background: linear-gradient(90deg, #1890ff 0%, #5FB8B3 100%);
    color: #fff;
    box-shadow: 0 4px 16px rgba(24,144,255,0.10);
  }
  .modal-btn.submit:hover {
    background: linear-gradient(90deg, #1677ff 0%, #4AA19C 100%);
    color: #fff;
    transform: scale(1.06);
    box-shadow: 0 8px 28px rgba(24,144,255,0.18);
  }
`;

const Community = () => {
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
      content: 'Vừa đạt được 7 ngày không hút thuốc! Cảm ơn mọi người đã động viên và chia sẻ kinh nghiệm.',
      achievements: [
        { id: 1, name: '7 Ngày Không Thuốc', icon: <CalendarOutlined />, color: '#52c41a' },
        { id: 2, name: 'Tiết Kiệm 500k', icon: <TrophyOutlined />, color: '#faad14' }
      ],
      likes: 12,
      comments: [
        { id: 1, author: 'Trần B', content: 'Chúc mừng bạn! Cố gắng duy trì nhé!' },
        { id: 2, author: 'Lê C', content: 'Tuyệt vời! Mình cũng đang cố gắng đạt được thành tích này.' }
      ],
      timestamp: '2 giờ trước',
      showComments: false
    }
  ]);

  const mockAchievements = [
    { id: 1, name: '7 Ngày Không Thuốc', icon: <CalendarOutlined />, color: '#52c41a' },
    { id: 2, name: 'Tiết Kiệm 500k', icon: <TrophyOutlined />, color: '#faad14' },
    { id: 3, name: 'Sức Khỏe Cải Thiện', icon: <HeartOutlined />, color: '#f5222d' },
    { id: 4, name: 'Người Truyền Cảm Hứng', icon: <UserOutlined />, color: '#1890ff' }
  ];

  const handleCreatePost = () => {
    if (!postContent.trim() && selectedAchievements.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 huy hiệu hoặc nhập nội dung!');
      return;
    }

    const newPost = {
      id: posts.length + 1,
      author: 'Bạn',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
      content: postContent,
      achievements: selectedAchievements,
      likes: 0,
      comments: [],
      timestamp: 'Vừa xong',
      showComments: false
    };

    setPosts([newPost, ...posts]);
    setIsPostModalVisible(false);
    setPostContent('');
    setSelectedAchievements([]);
    message.success('Đăng bài thành công!');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleComment = (postId, comment) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: post.comments.length + 1,
            author: 'Bạn',
            content: comment
          }]
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, showComments: !post.showComments };
      }
      return post;
    }));
  };

  return (
    <PageContainer>
      <TitleRow>
        <TeamOutlined />
        <Title level={2} style={{ color: '#222', margin: 0 }}>Cộng Đồng Cai Thuốc</Title>
      </TitleRow>

      <CreatePostButton onClick={() => setIsPostModalVisible(true)}>
        <Avatar src="https://xsgames.co/randomusers/avatar.php?g=male" />
        <Text type="secondary">Chia sẻ thành tích của bạn...</Text>
      </CreatePostButton>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Tất Cả Bài Viết" key="1">
          <List
            itemLayout="vertical"
            dataSource={posts}
            renderItem={post => (
              <PostCard>
                <Card.Meta
                  avatar={<Avatar src={post.avatar} />}
                  title={post.author}
                  description={post.timestamp}
                />
                <Paragraph>{post.content}</Paragraph>

                {post.achievements.length > 0 && (
                  <div className="achievement-badges">
                    {post.achievements.map(achievement => (
                      <AchievementBadge
                        key={achievement.id}
                        color={achievement.color}
                        icon={achievement.icon}
                      >
                        {achievement.name}
                      </AchievementBadge>
                    ))}
                  </div>
                )}

                <div className="post-stats">
                  <Space>
                    <Button
                      type="text"
                      icon={<LikeOutlined style={{ color: '#5FB8B3' }} />}
                      onClick={() => handleLike(post.id)}
                      style={{ color: '#5FB8B3' }}
                    >
                      {post.likes} Thích
                    </Button>
                    <Button
                      type="text"
                      icon={<CommentOutlined style={{ color: '#5FB8B3' }} />}
                      onClick={() => toggleComments(post.id)}
                      style={{ color: '#5FB8B3' }}
                    >
                      {post.comments.length} Bình luận
                    </Button>
                    <Button
                      type="text"
                      icon={<ShareAltOutlined style={{ color: '#5FB8B3' }} />}
                      style={{ color: '#5FB8B3' }}
                    >
                      Chia sẻ
                    </Button>
                  </Space>
                </div>

                {post.showComments && (
                  <div className="comments-section">
                    <List
                      itemLayout="horizontal"
                      dataSource={post.comments}
                      renderItem={comment => (
                        <List.Item style={{ borderColor: '#5FB8B3' }}>
                          <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined style={{ color: '#5FB8B3' }} />} style={{ backgroundColor: '#e6f7ff' }} />}
                            title={<CommentAuthor>{comment.author}</CommentAuthor>}
                            description={<CommentContent>{comment.content}</CommentContent>}
                          />
                        </List.Item>
                      )}
                    />
                    <Input.TextArea
                      placeholder="Viết bình luận..."
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      onPressEnter={(e) => {
                        if (e.target.value.trim()) {
                          handleComment(post.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      style={{ marginTop: '12px', borderColor: '#5FB8B3' }}
                    />
                  </div>
                )}
              </PostCard>
            )}
          />
        </TabPane>
        <TabPane tab="Thành Tích Nổi Bật" key="2">
          {/* Có thể thêm nội dung cho tab này sau */}
        </TabPane>
      </Tabs>

      <Modal
        title={null}
        visible={isPostModalVisible}
        onOk={handleCreatePost}
        onCancel={() => {
          setIsPostModalVisible(false);
          setPostContent('');
          setSelectedAchievements([]);
        }}
        footer={null}
        width={750}
        centered
      >
        <CustomModalContent>
          <div className="modal-title">Tạo Bài Viết Mới</div>
          <textarea
            placeholder="Chia sẻ thành tích của bạn..."
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            style={{ width: '100%', resize: 'none' }}
          />
          <div className="modal-label">Chọn Huy Hiệu Thành Tích:</div>
          <div className="badge-list">
            {mockAchievements.map(achievement => (
              <div
                key={achievement.id}
                className={`badge-item badge-${achievement.color === '#52c41a' ? 'green' : achievement.color === '#faad14' ? 'yellow' : achievement.color === '#f5222d' ? 'red' : 'blue'}${selectedAchievements.some(a => a.id === achievement.id) ? ' selected' : ''}`}
                onClick={() => {
                  if (selectedAchievements.some(a => a.id === achievement.id)) {
                    setSelectedAchievements(selectedAchievements.filter(a => a.id !== achievement.id));
                  } else {
                    setSelectedAchievements([...selectedAchievements, achievement]);
                  }
                }}
              >
                {achievement.icon} {achievement.name}
              </div>
            ))}
          </div>
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={() => {
              setIsPostModalVisible(false);
              setPostContent('');
              setSelectedAchievements([]);
            }}>Hủy</button>
            <button className="modal-btn submit" onClick={handleCreatePost}>Đăng bài</button>
          </div>
        </CustomModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Community; 