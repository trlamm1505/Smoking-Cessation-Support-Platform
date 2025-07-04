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
  HeartFilled,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import userApi from '../Axios/userAxios';

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
    align-items: center;
    gap: 16px;
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
  padding: 7px 10px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(90deg, #b7f8db 0%, #50a7c2 100%);
  border: none;
  color: #fff !important;
  box-shadow: 0 4px 18px #50a7c250, 0 2px 12px #b7f8db60;
  transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  cursor: pointer;
  margin: 6px 10px;
  .anticon {
    font-size: 26px;
    color: #fff;
    margin-right: 8px;
    filter: drop-shadow(0 2px 4px #50a7c250);
  }
  &:hover, &:focus {
    background: linear-gradient(90deg, #50a7c2 0%, #b7f8db 100%);
    color: #fff !important;
    box-shadow: 0 8px 32px #50a7c280, 0 4px 18px #b7f8db80;
    transform: scale(1.09);
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

const CreatePostBar = styled(Button)`
  width: 100%;
  height: 54px;
  background: #f8fafb;
  border: none;
  border-radius: 18px;
  box-shadow: 0 2px 12px #b7f8db30;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #7a8fa6;
  font-weight: 500;
  padding: 0 32px;
  margin-bottom: 24px;
  transition: box-shadow 0.18s, background 0.18s, color 0.18s;
  cursor: pointer;
  &:hover, &:focus {
    background: linear-gradient(90deg, #e6f7f6 0%, #b7f8db 100%);
    color: #1890ff;
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
  font-weight: 900;
  border-radius: 24px;
  padding: 16px 28px;
  cursor: pointer;
  border: 2px solid ${(props) => props.$isSelected ? '#5FB8B3' : props.$badgeColor || '#ccc'};
  color: ${(props) => props.$isSelected ? 'white' : props.$badgeColor || '#333'};
  background: ${(props) => props.$isSelected ? 'linear-gradient(90deg, #5FB8B3 0%, #4A90E2 100%)' : 'white'};
  box-shadow: 0 2px 12px rgba(95,184,179,0.10);
  transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  font-family: inherit;
  margin: 6px 8px;
  &:hover {
    background: linear-gradient(90deg, #e6f7f6 0%, #b2f0ec 100%);
    color: #1890ff;
    transform: scale(1.07);
    border-color: #5FB8B3;
    box-shadow: 0 4px 18px #5FB8B340;
  }
  &.selected, &[aria-pressed='true'] {
    background: linear-gradient(90deg, #5FB8B3 0%, #4A90E2 100%);
    color: white;
    border-color: #5FB8B3;
    box-shadow: 0 6px 24px #5FB8B340;
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
  const [posts, setPosts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [coachIds, setCoachIds] = useState([]);
  const [notifiedRejectedPosts, setNotifiedRejectedPosts] = useState(new Set());

  // Get userId from localStorage
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    async function fetchAllComments(posts) {
      const map = {};
      for (const post of posts) {
        const res = await userApi.getCommentsByPostId(post.id);
        map[post.id] = res.data || [];
      }
      setCommentsMap(map);
    }
    userApi.getCommunityPosts().then(res => {
      const mappedPosts = (res.data || []).map(post => ({
        id: post.postId,
        author: post.authorName,
        authorId: post.authorId,
        avatar: undefined,
        authorRole: undefined,
        content: post.content,
        achievements: (post.badges || '').split(',').map((name, idx) => name.trim() ? { id: idx, name: name.trim() } : null).filter(Boolean),
        likes: post.likeCount || 0,
        comments: [],
        timestamp: post.publishDate ? new Date(post.publishDate).toLocaleString('vi-VN') : '',
      showComments: false,
        postType: post.status === 'PUBLISHED' ? 'general' : post.status,
        title: post.title,
        featuredImage: post.featuredImageURL,
        status: post.status,
      }));
      setPosts(mappedPosts);
      // Đồng bộ likedByCurrentUser vào state likedPosts
      const likedSet = new Set();
      (res.data || []).forEach(post => {
        if (post.likedByCurrentUser) likedSet.add(post.postId);
      });
      setLikedPosts(likedSet);
      fetchAllComments(mappedPosts);

      // Thông báo nếu có bài bị từ chối
      mappedPosts.forEach(post => {
        if (post.status === 'REJECTED' && post.authorId === userId && !notifiedRejectedPosts.has(post.id)) {
          message.warning('Bài viết của bạn đã bị từ chối do vi phạm cộng đồng.');
          setNotifiedRejectedPosts(prev => new Set(prev).add(post.id));
        }
      });
    });
    // Fetch user achievements
    if (userId) {
      userApi.getUserAchievements(userId).then(res => {
        setAchievements((res.data || []).map(a => ({
          id: a.achievement.id,
          name: a.achievement.name,
          description: a.achievement.description,
          iconUrl: a.achievement.iconUrl,
          type: a.achievement.type,
        })));
      });
    }
    // Lấy danh sách coach
    userApi.getByRole && userApi.getByRole('coach').then(res => {
      setCoachIds((res.data || []).map(coach => coach.userId));
    });
  }, [userId]);

  const handleLike = async (postId) => {
    if (!likedPosts.has(postId)) {
      await userApi.likeCommunityPost(postId, userId);
      setLikedPosts(prev => new Set(prev).add(postId));
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { ...post, likes: post.likes + 1 };
          }
          return post;
        }));
      }
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

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedAchievements.length === 0 && (!['success_story', 'article', 'motivation', 'tip', 'question', 'general'].includes(postType) || (!postTitle.trim() && uploadedImageFile.length === 0))) {
      message.error('Vui lòng chọn ít nhất 1 huy hiệu, nhập nội dung, hoặc nhập tiêu đề/ảnh cho bài viết!');
      return;
    }

    // Prepare data for API
    const data = {
      authorId: userId,
      title: postTitle,
      content: postContent,
      badges: selectedAchievements.map(a => a.name).join(','),
      featuredImageURL: uploadedImageFile.length > 0 ? uploadedImageFile[0].url : undefined,
      status: 'PUBLISHED',
    };

    try {
      if (isEditMode && editedPost) {
        await userApi.updateCommunityPost(editedPost.id, data);
        message.success('Cập nhật bài viết thành công!');
      } else {
        await userApi.createCommunityPost(data);
        message.success('Đăng bài thành công!');
      }
      // Làm mới danh sách
      const res = await userApi.getCommunityPosts();
      setPosts((res.data || []).map(post => ({
        id: post.postId,
        author: post.authorName,
        authorId: post.authorId,
        avatar: undefined,
        authorRole: undefined,
        content: post.content,
        achievements: (post.badges || '').split(',').map((name, idx) => name.trim() ? { id: idx, name: name.trim() } : null).filter(Boolean),
        likes: post.likeCount || 0,
        comments: [],
        timestamp: post.publishDate ? new Date(post.publishDate).toLocaleString('vi-VN') : '',
        showComments: false,
        postType: post.status === 'PUBLISHED' ? 'general' : post.status,
        title: post.title,
        featuredImage: post.featuredImageURL,
      })));
    setIsPostModalVisible(false);
    setPostContent('');
    setSelectedAchievements([]);
    setPostType('general');
    setPostTitle('');
    setUploadedImageFile([]);
      setIsEditMode(false);
      setEditedPost(null);
    } catch (err) {
      message.error(isEditMode ? 'Cập nhật bài thất bại!' : 'Đăng bài thất bại!');
    }
  };

  const handleComment = async (postId, comment) => {
    if (!comment.trim()) return;
    try {
      await userApi.createComment({ postId, userId, content: comment });
      // Refresh comment list for this post
      const res = await userApi.getCommentsByPostId(postId);
      setCommentsMap(prev => ({ ...prev, [postId]: res.data || [] }));
      setCurrentComment('');
      message.success('Đã gửi bình luận!');
    } catch {
      message.error('Gửi bình luận thất bại!');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await userApi.deleteComment(commentId, userId);
      const res = await userApi.getCommentsByPostId(postId);
      setCommentsMap(prev => ({ ...prev, [postId]: res.data || [] }));
      message.success('Đã xóa bình luận!');
    } catch {
      message.error('Xóa bình luận thất bại!');
    }
  };

  const handleEditComment = async (postId, commentId, newContent) => {
    try {
      await userApi.updateComment(commentId, { content: newContent });
      const res = await userApi.getCommentsByPostId(postId);
      setCommentsMap(prev => ({ ...prev, [postId]: res.data || [] }));
      message.success('Đã sửa bình luận!');
    } catch {
      message.error('Sửa bình luận thất bại!');
    }
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
        <CreatePostBar onClick={() => setIsPostModalVisible(true)}>
          Chia sẻ thành tích của bạn...
        </CreatePostBar>
      </TopContentContainer>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Tất Cả Bài Viết" key="1">
          <List
            itemLayout="vertical"
            dataSource={posts}
            renderItem={post => (
              <AnimatedPostCard delay={`${post.id * 0.1}s`}>
                  {post.featuredImage && (
                  <div className="ant-card-cover" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px 0' }}>
                    <img 
                      alt="featured" 
                      src={post.featuredImage} 
                      style={{ maxWidth: 640, maxHeight: 360, borderRadius: 12, objectFit: 'cover', margin: '0 auto', boxShadow: '0 2px 8px #0001' }}
                    />
                    </div>
                  )}
                  <div className="ant-card-meta">
                    <Space>
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
                      disabled={likedPosts.has(post.id)}
                    >
                    {post.likes}
                    </Button>
                    <Button
                      type="text"
                    icon={<CommentOutlined />}
                      onClick={() => toggleComments(post.id)}
                    >
                    {commentsMap[post.id]?.length || 0}
                    </Button>
                </div>

                {post.showComments && (
                  <div className="comments-section">
                    <List
                      itemLayout="horizontal"
                      dataSource={commentsMap[post.id] || []}
                      renderItem={comment => (
                        <List.Item
                          actions={comment.userId === userId ? [
                            editingCommentId === comment.commentId ? (
                              <>
                                <Button size="small" type="primary" style={{ marginRight: 8, borderRadius: 8, fontWeight: 600 }} onClick={async () => {
                                  await handleEditComment(post.id, comment.commentId, editingCommentContent);
                                  setEditingCommentId(null);
                                  setEditingCommentContent('');
                                }}>Lưu</Button>
                                <Button size="small" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingCommentContent('');
                                }}>Hủy</Button>
                              </>
                            ) : (
                              <>
                                <Button size="small" type="link" style={{ color: '#1677ff', fontWeight: 600, marginRight: 8, borderRadius: 8 }} onClick={() => {
                                  setEditingCommentId(comment.commentId);
                                  setEditingCommentContent(comment.content);
                                }}>Sửa</Button>
                                <Button size="small" type="link" danger style={{ fontWeight: 600, borderRadius: 8 }} onClick={() => {
                                  console.log('Xóa comment:', comment.commentId, 'post:', post.id);
                                  handleDeleteComment(post.id, comment.commentId);
                                }}>Xóa</Button>
                              </>
                            )
                          ] : []}
                        >
                          <List.Item.Meta
                              avatar={<Avatar icon={<UserOutlined />} />}
                            title={
                              <span>
                                <CommentAuthor>{comment.userName || 'Người dùng'}</CommentAuthor>
                                {coachIds.includes(comment.userId) && <Tag color="gold" style={{ marginLeft: 8, fontWeight: 600 }}>Coach</Tag>}
                              </span>
                            }
                            description={
                              editingCommentId === comment.commentId ? (
                                <Input.TextArea
                                  value={editingCommentContent}
                                  onChange={e => setEditingCommentContent(e.target.value)}
                                  autoSize={{ minRows: 1, maxRows: 3 }}
                                  style={{ marginTop: 4 }}
                                />
                              ) : (
                                <CommentContent>{comment.content}</CommentContent>
                              )
                            }
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

                {post.authorId === userId && (
                  <div style={{ display: 'flex', gap: 16, marginBottom: 8, justifyContent: 'flex-end' }}>
                    <Button 
                      size="middle" 
                      style={{
                        background: 'linear-gradient(90deg, #5FB8B3 0%, #4A90E2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 18,
                        fontWeight: 700,
                        padding: '8px 28px',
                        boxShadow: '0 2px 8px #5FB8B340',
                        fontSize: 16,
                        transition: 'all 0.18s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #4A90E2 0%, #5FB8B3 100%)'}
                      onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #5FB8B3 0%, #4A90E2 100%)'}
                      icon={<EditOutlined />}
                      onClick={() => {
                        setIsEditMode(true);
                        setEditedPost(post);
                        setIsPostModalVisible(true);
                        setPostTitle(post.title || '');
                        setPostContent(post.content || '');
                        setUploadedImageFile(post.featuredImage ? [{ uid: '-1', url: post.featuredImage }] : []);
                        setSelectedAchievements(post.achievements || []);
                        setPostType(post.postType || 'general');
                      }}
                    >
                      Sửa
                    </Button>
                    <Button 
                      size="middle" 
                      style={{
                        background: 'linear-gradient(90deg, #ff7875 0%, #ffb86c 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 18,
                        fontWeight: 700,
                        padding: '8px 28px',
                        boxShadow: '0 2px 8px #ff787540',
                        fontSize: 16,
                        transition: 'all 0.18s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffb86c 0%, #ff7875 100%)'}
                      onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ff7875 0%, #ffb86c 100%)'}
                      icon={<DeleteOutlined />}
                      danger
                      onClick={async () => {
                        Modal.confirm({
                          title: 'Xác nhận xóa bài viết',
                          content: 'Bạn có chắc muốn xóa bài viết này không?',
                          okText: 'Xóa',
                          okType: 'danger',
                          cancelText: 'Hủy',
                          centered: true,
                          onOk: async () => {
                            await userApi.deleteCommunityPost(post.id);
                            message.success('Đã xóa bài viết!');
                            // Làm mới danh sách
                            const res = await userApi.getCommunityPosts();
                            setPosts((res.data || []).map(post => ({
                              id: post.postId,
                              author: post.authorName,
                              authorId: post.authorId,
                              avatar: undefined,
                              authorRole: undefined,
                              content: post.content,
                              achievements: (post.badges || '').split(',').map((name, idx) => name.trim() ? { id: idx, name: name.trim() } : null).filter(Boolean),
                              likes: post.likeCount || 0,
                              comments: [],
                              timestamp: post.publishDate ? new Date(post.publishDate).toLocaleString('vi-VN') : '',
                              showComments: false,
                              postType: post.status === 'PUBLISHED' ? 'general' : post.status,
                              title: post.title,
                              featuredImage: post.featuredImageURL,
                            })));
                          },
                        });
                      }}
                    >
                      Xóa
                    </Button>
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
          setIsEditMode(false);
          setEditedPost(null);
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
                <Form.Item label="Link ảnh nổi bật (URL)">
                  <Input
                    value={uploadedImageFile.length > 0 ? uploadedImageFile[0].url || uploadedImageFile[0].thumbUrl || '' : ''}
                    onChange={e => {
                      const url = e.target.value;
                      setUploadedImageFile(url ? [{ uid: '-1', url }] : []);
                    }}
                    placeholder="Nhập URL ảnh nổi bật cho bài viết"
                  />
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
            {achievements.map(achievement => (
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
                      {achievement.iconUrl && <img src={achievement.iconUrl} alt={achievement.name} style={{ width: 20, height: 20 }} />}
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