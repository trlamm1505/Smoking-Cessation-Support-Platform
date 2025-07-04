import React, { useState } from 'react';
import { Card, Avatar, Button, Input, List, Space, Tag, Typography, Modal, message, Tabs, Badge, Table } from 'antd';
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
import axiosClient from '../Axios/AxiosCLients';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const PageBg = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0fcf8 0%, #f7fafd 100%);
  padding: 0;
`;

const MainCard = styled(Card)`
  box-shadow: 0 8px 32px rgba(79,209,197,0.12);
  border-radius: 32px !important;
  margin: 0 auto 32px auto;
  max-width: 1100px;
  background: #fff;
  padding: 0 0 32px 0;
`;

const BigTitle = styled.h2`
  text-align: center;
  font-size: 2.4rem;
  font-weight: 800;
  color: #20c997;
  margin: 0 0 24px 0;
  letter-spacing: 1px;
`;

const StyledTable = styled(Table)`
  border-radius: 32px !important;
  overflow: hidden;
  background: #f8fffe;
  .ant-table-thead > tr > th {
    background: linear-gradient(90deg, #e6f7f6 0%, #b7f8db 100%) !important;
    color: #2c7a75 !important;
    font-weight: 700;
    font-size: 17px;
    border-bottom: 2px solid #b7f8db !important;
    letter-spacing: 0.2px;
    padding: 18px 14px;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #E3F6F5;
    padding: 18px 14px;
    color: #2c3e50;
    font-size: 16px;
    background: #fff;
    transition: background 0.18s;
  }
  .ant-table-tbody > tr:hover > td {
    background: #e6f7f6;
    transition: background 0.18s;
  }
  .ant-table-pagination {
    margin: 18px 0 0 0;
  }
`;

const GradientBadge = styled(Tag)`
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #fff !important;
  border: none;
  font-weight: 600;
  font-size: 15px;
  border-radius: 16px;
  padding: 7px 18px;
  box-shadow: 0 2px 8px #38f9d720;
`;

const ActionButton = styled(Button)`
  border-radius: 12px !important;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 2px 8px #5fb8b340;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #5FB8B3 0%, #ffb86c 100%) !important;
    color: #fff !important;
    box-shadow: 0 4px 16px #5fb8b340;
  }
`;

const ApproveButton = styled(Button)`
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%) !important;
  color: #fff !important;
  font-weight: 700;
  font-size: 16px;
  border: none;
  border-radius: 16px !important;
  padding: 8px 28px !important;
  box-shadow: 0 2px 8px #43e97b30;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%) !important;
    color: #fff !important;
    box-shadow: 0 4px 16px #38f9d740;
    transform: scale(1.06);
  }
`;

const RejectButton = styled(Button)`
  background: linear-gradient(90deg, #ff7875 0%, #ffb86c 100%) !important;
  color: #fff !important;
  font-weight: 700;
  font-size: 16px;
  border: none;
  border-radius: 16px !important;
  padding: 8px 28px !important;
  box-shadow: 0 2px 8px #ff787540;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #ffb86c 0%, #ff7875 100%) !important;
    color: #fff !important;
    box-shadow: 0 4px 16px #ff787540;
    transform: scale(1.06);
  }
`;

const AdminCommunity = () => {
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ visible: false, type: '', post: null });

  const mockAchievements = [
    { id: 1, name: '7 Ngày Không Thuốc', icon: <CalendarOutlined />, color: '#52c41a' },
    { id: 2, name: 'Tiết Kiệm 500k', icon: <TrophyOutlined />, color: '#faad14' },
    { id: 3, name: 'Sức Khỏe Cải Thiện', icon: <HeartOutlined />, color: '#f5222d' },
    { id: 4, name: 'Người Truyền Cảm Hứng', icon: <UserOutlined />, color: '#1890ff' }
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/community-posts/admin');
      setPosts((res.data || []).map(post => ({
        id: post.postId,
        author: post.authorName,
        authorId: post.authorId,
        content: post.content,
        title: post.title,
        featuredImage: post.featuredImageURL,
        badges: (post.badges || '').split(',').map((name, idx) => name.trim() ? { id: idx, name: name.trim() } : null).filter(Boolean),
        status: post.status,
        publishDate: post.publishDate ? new Date(post.publishDate).toLocaleString('vi-VN') : '',
      })));
    } catch (err) {
      message.error('Lỗi tải danh sách bài viết!');
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosClient.put(`/api/community-posts/${id}/approve`);
      toast.success('Duyệt bài viết thành công!', { position: 'top-right', autoClose: 2000 });
      await fetchPosts();
    } catch {
      toast.error('Duyệt bài thất bại!', { position: 'top-right', autoClose: 2000 });
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosClient.put(`/api/community-posts/${id}/reject`);
      // Gửi thông báo cho user nếu có API, ví dụ:
      // await axiosClient.post('/api/notifications', { userId, message: 'Bài viết của bạn bị vi phạm cộng đồng nên admin đã gỡ.' });
      toast.error('Đã từ chối bài viết!', { position: 'top-right', autoClose: 2000 });
      // Hiển thị message cho user (nếu có cơ chế push hoặc reload phía user)
      // Hoặc có thể gửi socket/notification ở đây
      fetchPosts();
    } catch {
      toast.error('Từ chối bài thất bại!', { position: 'top-right', autoClose: 2000 });
    }
  };

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
      }
      return post;
    }));
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'featuredImage',
      key: 'featuredImage',
      render: url => url ? <img src={url} alt="featured" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px #b7f8db60' }} /> : null,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <b style={{ color: '#2c7a75', fontSize: 16 }}>{text}</b>,
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      render: author => <span style={{ color: '#5FB8B3', fontWeight: 600 }}>{author}</span>,
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'publishDate',
      key: 'publishDate',
    },
    {
      title: 'Badge',
      dataIndex: 'badges',
      key: 'badges',
      render: badges => badges && badges.length > 0 ? badges.map(b => <GradientBadge key={b.id}>{b.name}</GradientBadge>) : null,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag
          color={status === 'PUBLISHED' ? '#43e97b' : status === 'REJECTED' ? '#ff7875' : '#ffb86c'}
          style={{ fontWeight: 700, fontSize: 15, borderRadius: 12, padding: '4px 16px', letterSpacing: 1 }}
        >
          {status === 'PUBLISHED' ? 'PUBLISHED' : status === 'REJECTED' ? 'REJECTED' : status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <ActionButton size="small" onClick={() => { setSelectedPost(record); setDetailModalVisible(true); }}>Chi tiết</ActionButton>
          <ApproveButton size="small" onClick={() => setConfirmModal({ visible: true, type: 'approve', post: record })}>Duyệt</ApproveButton>
          <RejectButton size="small" onClick={() => setConfirmModal({ visible: true, type: 'reject', post: record })}>Từ chối</RejectButton>
        </Space>
      ),
    },
  ];

  return (
    <PageBg>
      <MainCard bordered={false}>
        <BigTitle>Quản lý bài viết cộng đồng</BigTitle>
        <StyledTable
          columns={columns}
          dataSource={posts
            .slice()
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
          }
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          bordered
        />
        {/* Modal chi tiết bài viết */}
        <Modal
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          title="Chi tiết bài viết"
          width={600}
        >
          {selectedPost && (
            <div>
              {selectedPost.featuredImage && <img src={selectedPost.featuredImage} alt="featured" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />}
              <Title level={4}>{selectedPost.title}</Title>
              <div><b>Tác giả:</b> {selectedPost.author}</div>
              <div><b>Ngày đăng:</b> {selectedPost.publishDate}</div>
              <div><b>Trạng thái:</b> <Tag color={selectedPost.status === 'PUBLISHED' ? 'blue' : selectedPost.status === 'REJECTED' ? 'red' : 'orange'}>{selectedPost.status}</Tag></div>
              <div style={{ margin: '12px 0' }}><b>Badge:</b> {selectedPost.badges && selectedPost.badges.length > 0 ? selectedPost.badges.map(b => <Tag key={b.id}>{b.name}</Tag>) : 'Không có'}</div>
              <Paragraph><b>Nội dung:</b><br />{selectedPost.content}</Paragraph>
            </div>
          )}
        </Modal>
        {/* Modal xác nhận duyệt/từ chối */}
        <Modal
          open={confirmModal.visible}
          onCancel={() => setConfirmModal({ visible: false, type: '', post: null })}
          onOk={async () => {
            if (confirmModal.type === 'approve') await handleApprove(confirmModal.post.id);
            if (confirmModal.type === 'reject') await handleReject(confirmModal.post.id);
            setConfirmModal({ visible: false, type: '', post: null });
          }}
          okText={confirmModal.type === 'approve' ? 'Duyệt' : 'Từ chối'}
          okButtonProps={confirmModal.type === 'approve' ? { type: 'primary', style: { borderRadius: 10, fontWeight: 700 } } : { danger: true, style: { borderRadius: 10, fontWeight: 700 } }}
          cancelText="Hủy"
          title={<span style={{ color: '#2c7a75', fontWeight: 700 }}>{confirmModal.type === 'approve' ? 'Xác nhận duyệt bài viết' : 'Xác nhận từ chối bài viết'}</span>}
          style={{ borderRadius: 18 }}
          bodyStyle={{ fontSize: 17, color: '#2c3e50', borderRadius: 18 }}
        >
          <div style={{ marginBottom: 8 }}>Bạn có chắc chắn muốn {confirmModal.type === 'approve' ? 'duyệt' : 'từ chối'} bài viết này không?</div>
          {confirmModal.post && <div style={{ marginTop: 12, color: '#ff7875', fontWeight: 700 }}><b>{confirmModal.post.title}</b></div>}
        </Modal>
        <ToastContainer />
      </MainCard>
    </PageBg>
  );

};

export default AdminCommunity; 