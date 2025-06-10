import React, { useState } from 'react';
import { Card, Avatar, Button, Input, List, Space, Tag, Typography, Modal, message, Tabs, Badge } from 'antd';
import {
    LikeOutlined,
    CommentOutlined,
    ShareAltOutlined,
    TrophyOutlined,
    HeartOutlined,
    UserOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PostCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

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
  background-color: white; /* White background */
  padding: 24px; /* Add padding */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
  margin-bottom: 24px; /* Space below the container */
`;

const AdminCommunity = () => {
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
            showComments: false,
            isAdmin: true
        }
    ]);

    const mockAchievements = [
        { id: 1, name: '7 Ngày Không Thuốc', icon: <CalendarOutlined />, color: '#52c41a' },
        { id: 2, name: 'Tiết Kiệm 500k', icon: <TrophyOutlined />, color: '#faad14' },
        { id: 3, name: 'Sức Khỏe Cải Thiện', icon: <HeartOutlined />, color: '#f5222d' },
        { id: 4, name: 'Người Truyền Cảm Hứng', icon: <UserOutlined />, color: '#1890ff' }
    ];

    const handleCreatePost = () => {
        if (!postContent.trim()) {
            message.error('Vui lòng nhập nội dung bài viết!');
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
            showComments: false,
            isAdmin: true
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
                    comments: [...post.comments, { id: post.comments.length + 1, author: 'Bạn', content: comment }]
                };
            }
            return post;
        }));
    };

    const toggleComments = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return { ...post, showComments: !post.showComments };
            } thumbnailUrl
            return post;
        }));
    };

    return (
        <PageContainer>
            {/* Removing the Title here as it will be provided by AdminLayout */}
            {/* <Title level={2}>Cộng Đồng Cai Thuốc</Title> */}

            <TopContentContainer>
                <Space style={{ marginBottom: '24px' }}>
                    <AchievementStatButton
                        icon={<TrophyOutlined />}
                        // onClick={...} // Add your click handler here
                    >
                        Thời Gian Không Hút Thuốc
                    </AchievementStatButton>
                </Space>

                {/* Hiding the Create Post button for Admin view */}
                {/* <CreatePostButton onClick={() => setIsPostModalVisible(true)}>
                    <Avatar src="https://xsgames.co/randomusers/avatar.php?g=male" />
                    <Text type="secondary">Chia sẻ thành tích của bạn...</Text>
                </CreatePostButton> */}
            </TopContentContainer>

            <Tabs defaultActiveKey="1">
                <TabPane tab="Tất Cả Bài Viết" key="1">
                    <List
                        itemLayout="vertical"
                        dataSource={posts}
                        renderItem={post => (
                            <PostCard>
                                <Card.Meta
                                    avatar={<Avatar src={post.avatar} />}
                                    title={
                                        <span>
                                            {post.author}
                                            {post.isAdmin && (
                                                <Tag color="gold" style={{ marginLeft: 8 }}>
                                                    <UserOutlined style={{ marginRight: 4 }} />
                                                    Admin
                                                </Tag>
                                            )}
                                        </span>
                                    }
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

            {/* Hiding the Create Post Modal for Admin view */}
            {/* <Modal
                title="Tạo Bài Viết Mới"
                visible={isPostModalVisible}
                onOk={handleCreatePost}
                onCancel={() => {
                    setIsPostModalVisible(false);
                    setPostContent('');
                    setSelectedAchievements([]);
                }}
                okText="Đăng bài"
                cancelText="Hủy"
            >
                <TextArea
                    placeholder="Chia sẻ thành tích của bạn..."
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    style={{ marginBottom: 16 }}
                />

                <Title level={5}>Chọn Huy Hiệu Thành Tích:</Title>
                <Space wrap>
                    {mockAchievements.map(achievement => (
                        <AchievementBadge
                            key={achievement.id}
                            color={achievement.color}
                            icon={achievement.icon}
                            style={{
                                cursor: 'pointer',
                                opacity: selectedAchievements.includes(achievement) ? 1 : 0.5
                            }}
                            onClick={() => {
                                if (selectedAchievements.includes(achievement)) {
                                    setSelectedAchievements(selectedAchievements.filter(a => a.id !== achievement.id));
                                } else {
                                    setSelectedAchievements([...selectedAchievements, achievement]);
                                }
                            }}
                        >
                            {achievement.name}
                        </AchievementBadge>
                    ))}
                </Space>
            </Modal> */}
        </PageContainer>
    );
};

export default AdminCommunity; 