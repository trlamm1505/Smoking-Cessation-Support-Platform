import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Input, List, Space, Tag, Typography, Modal, message, Tabs, Badge, Select, Upload, Form } from 'antd';
import {
  CommentOutlined,
  TrophyOutlined,
  HeartOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  CheckOutlined,
  PlusOutlined,
  HeartFilled
} from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const PageContainer = styled.div`
  padding: 24px;
  max-width: 100%;
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
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background: white;
  border: 1px solid rgba(95, 184, 179, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 16px 8px;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(95, 184, 179, 0.2);
    border-color: rgba(95, 184, 179, 0.3);
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
    border-top: 1px solid #e0e0e0;
    margin-top: 16px;
  }

  .comments-section {
    margin-top: 16px;
    padding: 8px 0px;
    border-top: 1px solid #e0e0e0;
    background-color: #f9fdfc;
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
  color: #5FB8B3;
`;

const CommentContent = styled(Paragraph)`
  margin-bottom: 0;
  color: #2c3e50;
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
    background-color: #4AA19C;
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
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  padding: 24px 32px 20px 32px;
  border-radius: 32px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(95, 184, 179, 0.12);
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .ant-form-item-label {
    padding-bottom: 4px;
    label {
      font-size: 18px;
      font-weight: 700;
      color: #5FB8B3;
    }
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-select-selector, .ant-input, textarea {
    border-radius: 12px !important;
    font-size: 16px;
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    box-shadow: none;
    transition: all 0.3s ease-in-out;
    &:hover {
      border-color: #5FB8B3;
    }
    &:focus {
      border-color: #5FB8B3;
      box-shadow: 0 0 0 2px rgba(95, 184, 179, 0.2);
    }
  }

  textarea {
    min-height: 80px;
    max-height: 150px;
    resize: vertical;
  }

  textarea::placeholder {
    color: #b5c6d6;
    opacity: 1;
    font-size: 16px;
  }

  .badge-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
  }

  .ant-upload-list-picture-card .ant-upload-list-item {
    width: 100px;
    height: 100px;
  }

  .ant-upload.ant-upload-select-picture-card {
    width: 100px;
    height: 100px;
  }

  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 24px;
    width: 100%;
  }
  .modal-btn {
    padding: 10px 24px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.18s, border 0.2s;
    box-shadow: 0 2px 10px rgba(95,184,179,0.08);
    letter-spacing: 0.2px;
  }
  .modal-btn.cancel {
    background: transparent;
    color: #5FB8B3;
    border: 1.5px solid #5FB8B3;
  }
  .modal-btn.cancel:hover {
    background: #e6f7f6;
    color: #4AA19C;
    transform: scale(1.02);
    border-color: #4AA19C;
  }
  .modal-btn.submit {
    background: linear-gradient(90deg, #1890ff 0%, #5FB8B3 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(24,144,255,0.10);
  }
  .modal-btn.submit:hover {
    background: linear-gradient(90deg, #1677ff 0%, #4AA19C 100%);
    color: #fff;
    transform: scale(1.04);
    box-shadow: 0 6px 20px rgba(24,144,255,0.15);
  }
`;

const StyledBadgeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: ${(props) => (props.$isSelected ? '900' : '700')};
  border-radius: 16px;
  padding: 10px 20px;
  cursor: pointer;
  
  /* Styles for selected state */
  ${(props) =>
    props.$isSelected
      ? `
        border: 2.5px solid #222; /* Thicker black border when selected */
        color: white;
        background: ${props.$badgeColor};
        transform: scale(1.03);
        box-shadow: 0 4px 16px ${props.$badgeColor}40;
        .anticon {
          color: white;
  }
      `
      : `
        /* Styles for unselected state */
        border: 1.5px solid ${props.$badgeColor};
        color: ${props.$badgeColor};
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        .anticon {
          color: ${props.$badgeColor};
        }
      `}

  transition: all 0.2s ease-in-out;
  text-align: center;
  white-space: nowrap;
  max-width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => (props.$isSelected ? '#222' : props.$badgeColor)};
  }
`;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedPostCard = styled(PostCard)`
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
`;

const AnimatedCreatePostButton = styled(CreatePostButton)`
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const Community = () => {
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [postType, setPostType] = useState('general');
  const [postTitle, setPostTitle] = useState('');
  const [uploadedImageFile, setUploadedImageFile] = useState([]);
  const [currentRole, setCurrentRole] = useState('user');
  const [currentComment, setCurrentComment] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
      authorRole: 'user',
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
      showComments: false,
      postType: 'success_story',
      title: 'Hành Trình 7 Ngày Không Thuốc',
      featuredImage: 'https://source.unsplash.com/random/800x400/?success-quit-smoking'
    },
    {
      id: 2,
      author: 'Coach Minh',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
      authorRole: 'coach',
      content: 'Chào mừng các bạn đến với cộng đồng! Hãy cùng nhau chia sẻ để vượt qua thử thách này nhé.',
      achievements: [],
      likes: 25,
      comments: [
        { id: 3, author: 'Người dùng X', content: 'Cảm ơn Coach Minh!' }
      ],
      timestamp: '1 giờ trước',
      showComments: false,
      postType: 'motivation',
      title: 'Lời chào từ Coach Minh',
      featuredImage: 'https://source.unsplash.com/random/800x400/?motivation'
    }
  ]);

  const mockAchievements = [
    { id: 1, name: '7 Ngày Không Thuốc', icon: <CalendarOutlined />, color: '#52c41a' },
    { id: 2, name: 'Tiết Kiệm 500k', icon: <TrophyOutlined />, color: '#faad14' },
    { id: 3, name: 'Sức Khỏe Cải Thiện', icon: <HeartOutlined />, color: '#f5222d' },
    { id: 4, name: 'Người Truyền Cảm Hứng', icon: <UserOutlined />, color: '#1890ff' }
  ];

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { ...post, likes: post.likes - 1 };
          }
          return post;
        }));
      } else {
        newLikedPosts.add(postId);
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { ...post, likes: post.likes + 1 };
          }
          return post;
        }));
      }
      return newLikedPosts;
    });
  };

  const handleUploadChange = async ({ fileList: newFileList }) => {
    if (newFileList.length > 1) {
      message.warning('Chỉ có thể tải lên 1 ảnh');
      return;
    }
    setUploadedImageFile(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0];
      if (!file.url && !file.preview) {
        try {
          file.preview = await getBase64(file.originFileObj);
        } catch (error) {
          message.error('Lỗi khi xử lý ảnh');
        }
      }
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && selectedAchievements.length === 0 && (!['success_story', 'article', 'motivation', 'tip', 'question', 'general'].includes(postType) || (!postTitle.trim() && uploadedImageFile.length === 0))) {
      message.error('Vui lòng chọn ít nhất 1 huy hiệu, nhập nội dung, hoặc nhập tiêu đề/ảnh cho bài viết!');
      return;
    }

    const newPost = {
      id: posts.length + 1,
      author: currentRole === 'coach' ? 'Coach Mới' : 'Bạn',
      avatar: currentRole === 'coach' ? 'https://xsgames.co/randomusers/avatar.php?g=female' : 'https://xsgames.co/randomusers/avatar.php?g=male',
      authorRole: currentRole,
      content: postContent,
      achievements: selectedAchievements,
      likes: 0,
      comments: [],
      timestamp: 'Vừa xong',
      showComments: false,
      postType: postType,
      title: (currentRole === 'coach' || ['success_story', 'article', 'motivation', 'tip', 'question', 'general'].includes(postType)) ? postTitle : undefined,
      featuredImage: uploadedImageFile.length > 0 ? uploadedImageFile[0].preview : undefined,
    };

    setPosts([newPost, ...posts]);
    setIsPostModalVisible(false);
    setPostContent('');
    setSelectedAchievements([]);
    setPostType('general');
    setPostTitle('');
    setUploadedImageFile([]);
    message.success('Đăng bài thành công!');
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
        <IconEffect>
          <TeamOutlined />
        </IconEffect>
        <Title level={2} style={{ color: '#222', margin: 0 }}>Cộng Đồng Cai Thuốc</Title>
      </TitleRow>

      <TopContentContainer>
        <AnimatedCreatePostButton onClick={() => setIsPostModalVisible(true)}>
          <Avatar src={currentRole === 'coach' ? 'https://xsgames.co/randomusers/avatar.php?g=female' : 'https://xsgames.co/randomusers/avatar.php?g=male'} />
          <Text type="secondary">{currentRole === 'coach' ? 'Chia sẻ kinh nghiệm hoặc tạo động lực...' : 'Chia sẻ thành tích của bạn...'}</Text>
        </AnimatedCreatePostButton>
      </TopContentContainer>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Tất Cả Bài Viết" key="1">
          <List
            itemLayout="vertical"
            dataSource={posts}
            renderItem={post => (
              <AnimatedPostCard delay={`${post.id * 0.1}s`}>
                  {post.featuredImage && (
                    <div className="ant-card-cover">
                      <img alt="featured" src={post.featuredImage} />
                    </div>
                  )}
                  <div className="ant-card-meta">
                    <Space>
                      <Avatar src={post.avatar} />
                      <Space>
                        {post.author}
                        {post.authorRole === 'coach' && <Tag color="gold" bordered>Huấn luyện viên</Tag>}
                        {post.postType && (
                          <Tag color="#108ee9" bordered>
                            {
                              post.postType === 'general' ? 'Bài viết chung' :
                              post.postType === 'success_story' ? 'Câu chuyện thành công' :
                              post.postType === 'tip' ? 'Mẹo cai thuốc' :
                              post.postType === 'question' ? 'Hỏi đáp' :
                              post.postType === 'badge_share' ? 'Chia sẻ huy hiệu' :
                              post.postType === 'motivation' ? 'Tạo động lực' :
                              post.postType === 'article' ? 'Bài viết chuyên sâu' : ''
                            }
                          </Tag>
                        )}
                      </Space>
                      <Text type="secondary">{post.timestamp}</Text>
                    </Space>
                  </div>
                  {post.title && <Title level={4} style={{ marginTop: '0', marginBottom: '12px' }}>{post.title}</Title>}
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
                  <Button 
                    type="text" 
                    icon={likedPosts.has(post.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                    onClick={() => handleLike(post.id)}
                  >
                    {post.likes}
                  </Button>
                  <Button 
                    type="text" 
                    icon={<CommentOutlined />}
                    onClick={() => toggleComments(post.id)}
                  >
                    {post.comments.length}
                  </Button>
                </div>

                {post.showComments && (
                  <div className="comments-section">
                    <List
                      itemLayout="horizontal"
                      dataSource={post.comments}
                      renderItem={comment => (
                          <List.Item>
                          <List.Item.Meta
                              avatar={<Avatar icon={<UserOutlined />} />}
                            title={<CommentAuthor>{comment.author}</CommentAuthor>}
                            description={<CommentContent>{comment.content}</CommentContent>}
                          />
                        </List.Item>
                      )}
                    />
                      <Space style={{ width: '100%', marginTop: '12px' }}>
                    <Input.TextArea
                      placeholder="Viết bình luận..."
                      autoSize={{ minRows: 1, maxRows: 3 }}
                          value={currentComment}
                          onChange={(e) => setCurrentComment(e.target.value)}
                      onPressEnter={(e) => {
                            if (currentComment.trim()) {
                              handleComment(post.id, currentComment);
                              setCurrentComment('');
                            }
                          }}
                          style={{ flex: 1, borderColor: '#5FB8B3', padding: '10px 16px' }}
                        />
                        <Button
                          type="primary"
                          onClick={() => {
                            if (currentComment.trim()) {
                              handleComment(post.id, currentComment);
                              setCurrentComment('');
                        }
                      }}
                          style={{
                            backgroundColor: '#5FB8B3',
                            borderColor: '#5FB8B3',
                            borderRadius: '8px',
                            height: 'auto',
                            padding: '10px 20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          }}
                        >
                          Gửi
                        </Button>
                      </Space>
                  </div>
                )}
              </AnimatedPostCard>
            )}
          />
        </TabPane>
      </Tabs>

      <Modal
        title={
          <div className="modal-title">
            {currentRole === 'coach' ? 'Tạo Bài Viết Mới' : 'Chia Sẻ Bài Viết'}
          </div>
        }
        open={isPostModalVisible}
        onCancel={() => {
          setIsPostModalVisible(false);
          setPostContent('');
          setSelectedAchievements([]);
          setPostType('general');
          setPostTitle('');
          setUploadedImageFile([]);
        }}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreatePost} style={{ width: '100%' }}>
        <CustomModalContent>
            <Form.Item label="Chọn loại bài viết">
              <Select
                style={{ width: '100%' }}
                value={postType}
                onChange={(value) => {
                  setPostType(value);
                  if (!['success_story', 'article', 'motivation', 'tip', 'question'].includes(value)) {
                    setPostTitle('');
                    setUploadedImageFile([]);
                  }
                }}
                options={[
                  { value: 'general', label: 'Bài viết chung' },
                  { value: 'success_story', label: 'Câu chuyện thành công' },
                  { value: 'tip', label: 'Mẹo cai thuốc' },
                  { value: 'question', label: 'Hỏi đáp' },
                  { value: 'badge_share', label: 'Chia sẻ huy hiệu' },
                  { value: 'motivation', label: 'Tạo động lực' },
                  { value: 'article', label: 'Bài viết chuyên sâu' }
                ]}
              />
            </Form.Item>

            {(currentRole === 'coach' || ['success_story', 'article', 'motivation', 'tip', 'question', 'general'].includes(postType)) && (
              <>
                <Form.Item label="Tiêu đề bài viết">
                  <Input
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Nhập tiêu đề bài viết..."
                  />
                </Form.Item>
                <Form.Item label="Hình ảnh nổi bật (Tùy chọn)">
                  <Upload
                    listType="picture-card"
                    fileList={uploadedImageFile}
                    onChange={handleUploadChange}
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    {uploadedImageFile.length === 0 && <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                    </div>}
                  </Upload>
                </Form.Item>
              </>
            )}

            <Form.Item label="Nội dung">
              <TextArea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
                placeholder="Viết nội dung bài đăng của bạn..."
                autoSize={{ minRows: 4, maxRows: 8 }}
          />
            </Form.Item>

            {currentRole === 'user' && (
              <Form.Item label="Chọn huy hiệu (Tùy chọn)">
          <div className="badge-list">
            {mockAchievements.map(achievement => (
                    <StyledBadgeButton
                key={achievement.id}
                      $isSelected={selectedAchievements.includes(achievement)}
                      $badgeColor={achievement.color}
                onClick={() => {
                        if (selectedAchievements.includes(achievement)) {
                    setSelectedAchievements(selectedAchievements.filter(a => a.id !== achievement.id));
                  } else {
                    setSelectedAchievements([...selectedAchievements, achievement]);
                  }
                }}
              >
                      {achievement.icon}
                      {achievement.name}
                      {selectedAchievements.includes(achievement) && <CheckOutlined style={{ marginLeft: 8 }} />}
                    </StyledBadgeButton>
            ))}
          </div>
              </Form.Item>
            )}

          <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => {
              setIsPostModalVisible(false);
              setPostContent('');
              setSelectedAchievements([]);
                  setPostType('general');
                  setPostTitle('');
                  setUploadedImageFile([]);
                }}
              >
                Hủy
              </button>
              <button
                className="modal-btn submit"
                onClick={handleCreatePost}
              >
                Đăng bài
              </button>
          </div>
        </CustomModalContent>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Community; 