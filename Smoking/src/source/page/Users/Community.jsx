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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

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
    border-top: 1px solid #f0f0f0;
    margin-top: 16px;
  }

  .comments-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
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
            timestamp: '2 giờ trước'
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
            timestamp: 'Vừa xong'
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

    return (
        <PageContainer>
            <Title level={2}>Cộng Đồng Cai Thuốc</Title>

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
                                            icon={<LikeOutlined />}
                                            onClick={() => handleLike(post.id)}
                                        >
                                            {post.likes} Thích
                                        </Button>
                                        <Button
                                            type="text"
                                            icon={<CommentOutlined />}
                                        >
                                            {post.comments.length} Bình luận
                                        </Button>
                                        <Button
                                            type="text"
                                            icon={<ShareAltOutlined />}
                                        >
                                            Chia sẻ
                                        </Button>
                                    </Space>
                                </div>

                                <div className="comments-section">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={post.comments}
                                        renderItem={comment => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={<UserOutlined />} />}
                                                    title={comment.author}
                                                    description={comment.content}
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
                                    />
                                </div>
                            </PostCard>
                        )}
                    />
                </TabPane>
                <TabPane tab="Thành Tích Nổi Bật" key="2">
                    {/* Có thể thêm nội dung cho tab này sau */}
                </TabPane>
            </Tabs>

            <Modal
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
            </Modal>
        </PageContainer>
    );
};

export default Community; 