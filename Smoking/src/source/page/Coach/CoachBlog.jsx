import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Space, Typography, Modal, Button, Form, Input, Select, DatePicker, Upload, message } from 'antd';
import { CalendarOutlined, EyeOutlined, ReadOutlined, UserOutlined as AntUserOutlined, PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import coachApi from '../Axios/coachApi';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { Option } = Select;

const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: #e0f2f1;
  padding: 16px 24px;
  border-radius: 8px;
  border: 1px solid #b2dfdb;

  .header-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #2c7a75;
    font-size: 24px;
    font-weight: 600;
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const CategoryTag = styled(Tag)`
  padding: 6px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  margin: 0;
  border: none;
`;

const ArticleCard = styled(Card)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  height: 100%;
  border: none;
  
  .ant-card-cover {
    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const CategoryLabel = styled(Tag)`
  font-size: 14px;
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const ArticleTitle = styled.h3`
  font-size: 20px;
  line-height: 1.4;
  margin: 0 0 12px 0;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
`;

const ArticleExcerpt = styled(Text)`
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  display: block;
  margin-bottom: 16px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .author-details {
    .author-name {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      margin-bottom: 2px;
    }

    .author-title {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  gap: 24px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin-bottom: 16px;
`;

const ReadMoreButton = styled.a`
  display: block;
  text-align: center;
  padding: 8px;
  background: #4096ff;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #1677ff;
    color: white;
  }
`;

const ArticleModalContent = styled.div`
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;

  .modal-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
  }

  .modal-meta-info {
    color: rgba(0, 0, 0, 0.55);
    font-size: 14px;
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    align-items: center;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

   .modal-author-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .author-details {
      .author-name {
        font-size: 15px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        margin-bottom: 2px;
      }

      .author-title {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.55);
      }
    }
  }

  .full-content {
    color: rgba(0, 0, 0, 0.75);
    line-height: 1.7;
    font-size: 15px;
  }
`;

const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 24px 0 32px 0;
`;

const BlogFormModalContent = styled.div`
  padding: 32px 24px 24px 24px;
  border-radius: 18px;
  background: #f8f9fa;
  box-shadow: 0 4px 32px rgba(95,184,179,0.10);
  max-width: 540px;
  margin: 0 auto;

  .form-title {
    text-align: center;
    font-size: 26px;
    font-weight: 700;
    color: #2c7a75;
    margin-bottom: 28px;
    letter-spacing: 0.5px;
  }
  .ant-form-item {
    margin-bottom: 18px;
  }
  .ant-input, .ant-select-selector, .ant-input-textarea {
    border-radius: 10px !important;
    font-size: 15px;
    padding: 8px 12px;
  }
  .ant-upload-picture-card-wrapper {
    display: flex;
    justify-content: center;
  }
  .ant-upload.ant-upload-select-picture-card {
    border-radius: 12px;
    border: 2px dashed #5FB8B3;
    background: #fff;
    transition: border-color 0.2s;
  }
  .ant-upload.ant-upload-select-picture-card:hover {
    border-color: #4A90E2;
  }
  .ant-btn-primary {
    background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
    border: none;
    font-weight: 600;
    font-size: 16px;
    border-radius: 10px;
    padding: 8px 32px;
    box-shadow: 0 2px 8px rgba(95,184,179,0.10);
  }
  .ant-btn-primary:hover {
    background: linear-gradient(135deg, #4A90E2 0%, #5FB8B3 100%);
  }
  .ant-btn {
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
  }
`;

const CoachBlog = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [isArticleModalVisible, setIsArticleModalVisible] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [articleList, setArticleList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editArticle, setEditArticle] = useState(null);
    const [editForm] = Form.useForm();

    // Get current coach ID
    const currentCoachId = Number(localStorage.getItem('coachId') || localStorage.getItem('userId'));

    // Fetch all blog posts on mount
    useEffect(() => {
        fetchArticles();
        // Polling mỗi 1 giây
        const interval = setInterval(() => {
            fetchArticles();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const res = await coachApi.getAllBlogPosts();
            const data = res.data || res;
            // Hiển thị tất cả bài viết của tất cả coach
            setArticleList(data);
            // Lấy danh sách category duy nhất từ tất cả bài viết
            const cats = Array.from(new Set(data.map(a => a.category).filter(Boolean)));
            setCategories([
                { key: 'all', label: 'Tất cả', color: '#4A90E2' },
                ...cats.map((cat, idx) => ({ key: cat, label: cat, color: '#5FB8B3' }))
            ]);
        } catch (err) {
            toast.error('Lỗi tải danh sách bài viết!');
        }
        setLoading(false);
    };

    const filteredArticles = activeCategory === 'all'
        ? articleList
        : articleList.filter(article => article.category === activeCategory);

    const handleReadMore = (article) => {
        setSelectedArticle(article);
        setIsArticleModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsArticleModalVisible(false);
        setSelectedArticle(null);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalVisible(true);
    };
    const handleCloseCreateModal = () => {
        setIsCreateModalVisible(false);
        form.resetFields();
        setImagePreview(null);
        setImageFile(null);
    };

    const handleCreateArticle = async (values) => {
        setLoading(true);
        try {
            const authorId = localStorage.getItem('coachId') || localStorage.getItem('userId') || 0;
            const payload = {
                ...values,
                authorId: Number(authorId),
                tags: values.tags || '',
                content: values.excerpt,
            };
            await coachApi.createBlogPost(payload);
            toast.success('Tạo bài viết thành công!');
            handleCloseCreateModal();
            fetchArticles();
        } catch (err) {
            // Hiển thị lỗi chi tiết nếu có từ API
            let errorMsg = 'Tạo bài viết thất bại!';
            if (err?.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (err?.message) {
                errorMsg = err.message;
            }
            toast.error(errorMsg);
        }
        setLoading(false);
    };

    // Xử lý xóa bài viết
    const handleDeleteArticle = async (articleId) => {
        try {
            await coachApi.deleteBlogPost(articleId);
            toast.success('Đã xoá bài viết!');
            fetchArticles();
        } catch (err) {
            toast.error('Xoá bài viết thất bại!');
        }
    };

    // Xử lý mở modal chỉnh sửa
    const handleOpenEditModal = (article) => {
        setEditArticle(article);
        editForm.setFieldsValue({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            category: article.category,
            tags: article.tags,
            status: article.status,
            featuredImageURL: article.featuredImageURL,
        });
        setIsEditModalVisible(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalVisible(false);
        setEditArticle(null);
        editForm.resetFields();
    };
    // Xử lý cập nhật bài viết
    const handleUpdateArticle = async (values) => {
        try {
            const authorId = localStorage.getItem('coachId') || localStorage.getItem('userId') || 0;
            const payload = {
                ...values,
                authorId: Number(authorId),
                tags: values.tags || '',
                content: values.excerpt,
            };
            await coachApi.updateBlogPost(editArticle.postId, payload);
            toast.success('Cập nhật bài viết thành công!');
            handleCloseEditModal();
            fetchArticles();
        } catch (err) {
            toast.error('Cập nhật bài viết thất bại!');
        }
    };

    const renderArticleCard = (article) => {
        // Kiểm tra xem bài viết có phải của coach hiện tại không
        const isMyArticle = article.authorId === currentCoachId;
        
        return (
        <Col xs={24} md={8} style={{ marginBottom: 24 }} key={article.postId || article.id}>
            <ArticleCard
                cover={<img alt={article.title} src={article.featuredImageURL || 'https://source.unsplash.com/random/800x400/?blog'} />}
                actions={isMyArticle ? [
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        style={{
                            background: '#e6f7ff',
                            color: '#1890ff',
                            border: 'none',
                            borderRadius: 16,
                            fontWeight: 600,
                            padding: '0 18px',
                            boxShadow: '0 2px 8px #1890ff22',
                        }}
                        onClick={() => handleOpenEditModal(article)}
                        key="edit"
                    >
                        Sửa
                    </Button>,
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        style={{
                            background: '#fff1f0',
                            color: '#ff4d4f',
                            border: 'none',
                            borderRadius: 16,
                            fontWeight: 600,
                            padding: '0 18px',
                            boxShadow: '0 2px 8px #ff4d4f22',
                        }}
                        onClick={() => handleDeleteArticle(article.postId || article.id)}
                        key="delete"
                    >
                        Xoá
                    </Button>,
                ] : []}
            >
                <CategoryLabel color={categories.find(cat => cat.key === article.category)?.color}>
                    {categories.find(cat => cat.key === article.category)?.label || article.category}
                </CategoryLabel>

                <ArticleTitle>{article.title}</ArticleTitle>

                <AuthorInfo>
                    <div className="author-details">
                        <div className="author-name">{article.authorName || 'Coach'}</div>
                        <div className="author-title">Coach</div>
                    </div>
                </AuthorInfo>

                <ArticleMeta>
                    <Space>
                        <CalendarOutlined /> {article.publishDate ? new Date(article.publishDate).toLocaleDateString('vi-VN') : ''}
                    </Space>

                    <Text>{article.readTime || ''}</Text>
                </ArticleMeta>

                <ReadMoreButton onClick={() => handleReadMore(article)}>
                    Đọc Thêm
                </ReadMoreButton>
            </ArticleCard>
        </Col>
        );
    };

    return (
        <BlogContainer>
            <Header>
                <div className="header-title">
                    <ReadOutlined />
                    <Title level={2} style={{ margin: 0 }}>Blog Cai Thuốc Lá</Title>
                </div>
            </Header>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '24px 0 32px 0'
            }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{
                        background: '#ff7a45',
                        borderColor: '#ff7a45',
                        fontWeight: 600,
                        fontSize: 18,
                        padding: '0 32px'
                    }}
                    onClick={handleOpenCreateModal}
                >
                    Thêm bài blog
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {filteredArticles.map(renderArticleCard)}
            </Row>

            <Modal
                title={null}
                open={isArticleModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
                centered
                styles={{ body: { padding: 0 } }}
            >
                {selectedArticle && (
                    <ArticleModalContent>
                        <div className="modal-title">{selectedArticle.title}</div>

                        <div className="modal-meta-info">
                            <div className="meta-item"><CalendarOutlined /> {selectedArticle.publishDate ? new Date(selectedArticle.publishDate).toLocaleDateString('vi-VN') : ''}</div>
                            <div className="meta-item"><EyeOutlined /> {selectedArticle.views || 0}</div>
                            <div className="meta-item"><Text>{selectedArticle.readTime || ''}</Text></div>
                        </div>

                        <div className="modal-author-info">
                            <div className="author-details">
                                <div className="author-name">{selectedArticle.authorName || 'Coach'}</div>
                                <div className="author-title">Coach</div>
                            </div>
                        </div>

                        <div className="full-content">{selectedArticle.excerpt}</div>
                    </ArticleModalContent>
                )}
            </Modal>

            <Modal
                title={null}
                open={isCreateModalVisible}
                onCancel={handleCloseCreateModal}
                footer={null}
                width={600}
                centered
                styles={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
            >
                <BlogFormModalContent>
                    <div className="form-title">Tạo bài viết mới</div>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateArticle}
                        onFinishFailed={(err) => { toast.error('Vui lòng điền đầy đủ thông tin!') }}
                    >
                        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                            <Input placeholder="Nhập tiêu đề bài viết" />
                        </Form.Item>
                        <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}>
                            <Input placeholder="Ví dụ: cach-cai-thuoc-la-hieu-qua" />
                        </Form.Item>
                        <Form.Item name="excerpt" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                            <Input.TextArea rows={6} placeholder="Nhập nội dung bài viết" />
                        </Form.Item>
                        <Form.Item name="category" label="Thể loại" rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}>
                            <Select placeholder="Chọn thể loại">
                                <Option value="Sức khỏe">Sức khỏe</Option>
                                <Option value="Động lực">Động lực</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="tags" label="Tags">
                            <Input placeholder="Nhập tags, cách nhau bởi dấu phẩy" />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái" initialValue="draft">
                            <Select>
                                <Option value="draft">Nháp</Option>
                                <Option value="published">Công khai</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="featuredImageURL" label="Ảnh đại diện bài viết (URL)" rules={[{ required: true, message: 'Vui lòng nhập URL ảnh đại diện!' }, { type: 'url', message: 'URL không hợp lệ!' }]}>
                            <Input placeholder="Nhập URL ảnh đại diện" />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
                            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>Tạo bài viết</Button>
                            <Button style={{ marginLeft: 12 }} onClick={handleCloseCreateModal} disabled={loading}>Hủy</Button>
                        </Form.Item>
                    </Form>
                </BlogFormModalContent>
            </Modal>

            <Modal
                title="Chỉnh sửa bài viết"
                open={isEditModalVisible}
                onCancel={handleCloseEditModal}
                footer={null}
                width={600}
                centered
                styles={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
            >
                <BlogFormModalContent>
                    <Form
                        form={editForm}
                        layout="vertical"
                        onFinish={handleUpdateArticle}
                    >
                        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                            <Input placeholder="Nhập tiêu đề bài viết" />
                        </Form.Item>
                        <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}>
                            <Input placeholder="Ví dụ: cach-cai-thuoc-la-hieu-qua" />
                        </Form.Item>
                        <Form.Item name="excerpt" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                            <Input.TextArea rows={6} placeholder="Nhập nội dung bài viết" />
                        </Form.Item>
                        <Form.Item name="category" label="Thể loại" rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}>
                            <Select placeholder="Chọn thể loại">
                                <Option value="Sức khỏe">Sức khỏe</Option>
                                <Option value="Động lực">Động lực</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="tags" label="Tags">
                            <Input placeholder="Nhập tags, cách nhau bởi dấu phẩy" />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái" initialValue="draft">
                            <Select>
                                <Option value="draft">Nháp</Option>
                                <Option value="published">Công khai</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="featuredImageURL" label="Ảnh đại diện bài viết (URL)" rules={[{ required: true, message: 'Vui lòng nhập URL ảnh đại diện!' }, { type: 'url', message: 'URL không hợp lệ!' }]}>
                            <Input placeholder="Nhập URL ảnh đại diện" />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
                            <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
                            <Button style={{ marginLeft: 12 }} onClick={handleCloseEditModal}>Hủy</Button>
                        </Form.Item>
                    </Form>
                </BlogFormModalContent>
            </Modal>
        </BlogContainer>
    );
};

export default CoachBlog; 