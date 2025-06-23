import React, { useState } from 'react';
import { Card, Row, Col, Tag, Space, Typography, Modal, Button, Form, Input, Select, DatePicker, Upload, message } from 'antd';
import { CalendarOutlined, EyeOutlined, ReadOutlined, UserOutlined as AntUserOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

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

const categories = [];
const articles = [];

const CoachBlog = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [isArticleModalVisible, setIsArticleModalVisible] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [articleList, setArticleList] = useState(articles);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    
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
    };

    const handleCreateArticle = (values) => {
        // Tạm thời thêm vào danh sách local, sau này sẽ gọi API
        const newArticle = {
            id: articleList.length + 1,
            title: values.title,
            slug: values.slug,
            content: values.content,
            excerpt: values.excerpt,
            category: values.category,
            tags: values.tags,
            status: values.status,
            coverImage: values.featuredImageURL || 'https://source.unsplash.com/random/800x400/?blog',
            author: {
                name: 'Coach Demo',
                avatar: 'https://source.unsplash.com/random/100x100/?coach',
                title: 'Coach',
            },
            views: 0,
            readTime: '5 phút đọc',
            date: new Date().toLocaleDateString('vi-VN'),
        };
        setArticleList([newArticle, ...articleList]);
        message.success('Tạo bài viết thành công!');
        handleCloseCreateModal();
    };

    // Upload ảnh lên Cloudinary
    const handleImageChange = async (info) => {
        const file = info.file.originFileObj;
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
        setImageFile(file);
        // Upload lên Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'avatarUploadClient');
        formData.append('cloud_name', 'dp4gsczko');
        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dp4gsczko/image/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.secure_url) {
                form.setFieldsValue({ featuredImageURL: data.secure_url });
                setImagePreview(data.secure_url);
            }
        } catch (err) {
            message.error('Lỗi upload ảnh!');
        }
    };

    const renderArticleCard = (article) => (
        <Col xs={24} md={8} style={{ marginBottom: 24 }} key={article.id}>
            <ArticleCard
                cover={<img alt={article.title} src={article.coverImage} />}
            >
                <CategoryLabel color={categories.find(cat => cat.key === article.category)?.color}>
                    {categories.find(cat => cat.key === article.category)?.label}
                </CategoryLabel>

                <ArticleTitle>{article.title}</ArticleTitle>

                <ArticleExcerpt>
                    {article.excerpt}
                </ArticleExcerpt>

                <AuthorInfo>
                    <img src={article.author.avatar} alt={article.author.name} />
                    <div className="author-details">
                        <div className="author-name">{article.author.name}</div>
                        <div className="author-title">{article.author.title}</div>
                    </div>
                </AuthorInfo>

                <ArticleMeta>
                    <Space>
                        <CalendarOutlined /> {article.date}
                    </Space>
                    <Space>
                        <EyeOutlined /> {article.views}
                    </Space>
                    <Text>{article.readTime}</Text>
                </ArticleMeta>

                <ReadMoreButton onClick={() => handleReadMore(article)}>
                    Đọc Thêm
                </ReadMoreButton>
            </ArticleCard>
        </Col>
    );

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
                    + Thêm bài blog
                </Button>
            </div>

            <CategoryContainer>
                {categories.map(category => (
                    <CategoryTag
                        key={category.key}
                        color={category.color}
                        onClick={() => setActiveCategory(category.key)}
                        style={{ backgroundColor: activeCategory === category.key ? category.color : 'rgba(0, 0, 0, 0.06)', color: activeCategory === category.key ? 'white' : 'rgba(0, 0, 0, 0.85)' }}
                    >
                        {category.label}
                    </CategoryTag>
                ))}
            </CategoryContainer>

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
                bodyStyle={{ padding: 0 }}
            >
                {selectedArticle && (
                    <ArticleModalContent>
                         <div className="modal-title">{selectedArticle.title}</div>

                         <div className="modal-meta-info">
                             <div className="meta-item"><CalendarOutlined /> {selectedArticle.date}</div>
                             <div className="meta-item"><EyeOutlined /> {selectedArticle.views}</div>
                             <div className="meta-item"><Text>{selectedArticle.readTime}</Text></div>
                         </div>

                         <div className="modal-author-info">
                             <img src={selectedArticle.author.avatar} alt={selectedArticle.author.name} />
                             <div className="author-details">
                                 <div className="author-name">{selectedArticle.author.name}</div>
                                 <div className="author-title">{selectedArticle.author.title}</div>
                             </div>
                         </div>

                        <Text className="full-content">{selectedArticle.content}</Text>
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
                bodyStyle={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
            >
                <BlogFormModalContent>
                  <div className="form-title">Tạo bài viết mới</div>
                  <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleCreateArticle}
                  >
                      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}> <Input placeholder="Nhập tiêu đề bài viết" /> </Form.Item>
                      <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}> <Input placeholder="Ví dụ: cach-cai-thuoc-la-hieu-qua" /> </Form.Item>
                      <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}> <Input.TextArea rows={6} placeholder="Nhập nội dung bài viết" /> </Form.Item>
                      <Form.Item name="excerpt" label="Tóm tắt"> <Input.TextArea rows={2} placeholder="Nhập tóm tắt bài viết" /> </Form.Item>
                      <Form.Item name="category" label="Chuyên mục" rules={[{ required: true, message: 'Vui lòng chọn chuyên mục!' }]}> <Select placeholder="Chọn chuyên mục"> {categories.filter(c => c.key !== 'all').map(cat => (<Option value={cat.key} key={cat.key}>{cat.label}</Option>))} </Select> </Form.Item>
                      <Form.Item name="tags" label="Tags"> <Input placeholder="Nhập tags, cách nhau bởi dấu phẩy" /> </Form.Item>
                      <Form.Item name="status" label="Trạng thái" initialValue="draft"> <Select> <Option value="draft">Nháp</Option> <Option value="published">Công khai</Option> </Select> </Form.Item>
                      {/* Ảnh đại diện Cloudinary */}
                      <Form.Item name="featuredImageURL" label="Ảnh đại diện bài viết" rules={[{ required: true, message: 'Vui lòng upload ảnh đại diện!' }]} style={{ marginBottom: 0 }}>
                          <Upload
                              listType="picture-card"
                              showUploadList={false}
                              beforeUpload={() => false}
                              customRequest={handleImageChange}
                              accept="image/*"
                          >
                              {imagePreview ? (
                                  <img src={imagePreview} alt="cover" style={{ width: '100%', borderRadius: 8 }} />
                              ) : (
                                  <div>
                                      <PlusOutlined />
                                      <div style={{ marginTop: 8 }}>Upload</div>
                                  </div>
                              )}
                          </Upload>
                      </Form.Item>
                      <Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
                          <Button type="primary" htmlType="submit">Tạo bài viết</Button>
                          <Button style={{ marginLeft: 12 }} onClick={handleCloseCreateModal}>Hủy</Button>
                      </Form.Item>
                  </Form>
                </BlogFormModalContent>
            </Modal>
        </BlogContainer>
    );
};

export default CoachBlog; 