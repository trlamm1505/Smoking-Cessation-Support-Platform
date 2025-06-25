import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Space, Typography, Modal } from 'antd';
import { CalendarOutlined, EyeOutlined, ReadOutlined, UserOutlined as AntUserOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import axios from "axios";

const { Title, Text } = Typography;

const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  background: linear-gradient(135deg, #f0f8f7 0%, #ffffff 100%);
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  background: none;
  padding: 0;
  border-radius: 0;
  border: none;

  .header-title {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #2c3e50;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.5px;

    .anticon {
      color: #5FB8B3;
      font-size: 38px;
      animation: shine 2s infinite ease-in-out;
      text-shadow: 0 0 8px rgba(95, 184, 179, 0.3);
    }
    @keyframes shine {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const CategoryTag = styled(Tag)`
  padding: 8px 20px;
  font-size: 15px;
  border-radius: 20px;
  cursor: pointer;
  margin: 0;
  border: 1px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

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

const AnimatedCategoryTag = styled(CategoryTag)`
  animation: ${slideUp} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
`;

const ArticleCard = styled(Card)`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  height: 100%;
  border: 1px solid #f0f0f0;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 15px 45px rgba(95, 184, 179, 0.2);
  }
  .ant-card-cover {
    img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
  }
  .ant-card-body {
    padding: 30px;
    display: flex;
    flex-direction: column;
    height: calc(100% - 220px);
  }
`;

const CategoryLabel = styled(Tag)`
  font-size: 14px;
  padding: 6px 16px;
  border: none;
  border-radius: 16px;
  margin-bottom: 15px;
  font-weight: 600;
  background-color: ${props => props.color}15;
  color: ${props => props.color};
`;

const ArticleTitle = styled.h3`
  font-size: 24px;
  line-height: 1.3;
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-weight: 700;
`;

const ArticleExcerpt = styled(Text)`
  color: #555;
  font-size: 15px;
  display: block;
  margin-bottom: 20px;
  flex-grow: 1;
  line-height: 1.6;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #5FB8B3;
  }

  .author-details {
    .author-name {
      font-size: 15px;
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .author-title {
      font-size: 13px;
      color: #777;
    }
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  gap: 28px;
  color: #777;
  font-size: 13px;
  margin-bottom: 20px;
  margin-top: auto;

  .anticon {
    color: #5FB8B3;
  }
`;

const ReadMoreButton = styled.a`
  display: block;
  text-align: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(95, 184, 179, 0.2);
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: linear-gradient(135deg, #4A90E2 0%, #5FB8B3 100%);
    box-shadow: 0 8px 25px rgba(95, 184, 179, 0.3);
    transform: translateY(-2px);
  }
`;

const ArticleModalContent = styled.div`
  padding: 30px;
  max-height: 80vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 16px;

  .modal-title {
    font-size: 30px;
    font-weight: 800;
    margin-bottom: 15px;
    color: #2c3e50;
    line-height: 1.2;
  }

  .modal-meta-info {
    color: #777;
    font-size: 14px;
    margin-bottom: 25px;
    display: flex;
    gap: 25px;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 15px;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      .anticon {
        color: #5FB8B3;
        font-size: 16px;
      }
    }
  }

   .modal-author-info {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 1px solid #e0e0e0;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #5FB8B3;
    }

    .author-details {
      .author-name {
        font-size: 16px;
        color: #2c3e50;
        font-weight: 700;
      }

      .author-title {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .full-content {
    color: #333;
    line-height: 1.8;
    font-size: 16px;
  }
`;

const AnimatedArticleCard = styled(ArticleCard)`
  animation: ${slideUp} 0.6s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
`;

const categories = [
  { key: 'all', label: 'Tất cả', color: '#5FB8B3' },
  { key: 'methods', label: 'Phương pháp', color: '#95de64' },
  { key: 'health', label: 'Sức khỏe', color: '#ff7a45' },
  { key: 'nutrition', label: 'Dinh dưỡng', color: '#4096ff' },
  { key: 'psychology', label: 'Tâm lý', color: '#722ed1' },
  { key: 'success', label: 'Câu chuyện thành công', color: '#ffc53d' }
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isArticleModalVisible, setIsArticleModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy blog
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/blogposts");
        // Nếu trả về 1 object (1 bài), chuyển thành mảng
        if (Array.isArray(res.data)) {
          setArticles(res.data);
        } else if (res.data && typeof res.data === 'object') {
          setArticles([res.data]);
        } else {
          setArticles([]);
        }
      } catch (err) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setIsArticleModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsArticleModalVisible(false);
    setSelectedArticle(null);
  };

  const renderArticleCard = (article) => (
    <Col xs={24} md={12} lg={8} style={{ marginBottom: 30 }} key={article.postId}>
      <AnimatedArticleCard
        cover={<img alt={article.title} src={article.featuredImageURL} />}
        delay={`${(articles.indexOf(article) * 0.1) + 0.1}s`}
      >
        <CategoryLabel color={categories.find(cat => cat.key === article.category)?.color || "#5FB8B3"}>
          {article.category}
        </CategoryLabel>
        <ArticleTitle>{article.title}</ArticleTitle>
        <AuthorInfo>
          <AntUserOutlined style={{ fontSize: 40, color: "#5FB8B3" }} />
          <div className="author-details">
            <div className="author-name">{article.authorName}</div>
          </div>
        </AuthorInfo>
        <ArticleMeta>
          <Space>
            <CalendarOutlined /> {article.publishDate}
          </Space>
          
        </ArticleMeta>
        <ReadMoreButton onClick={() => handleReadMore(article)}>
          Đọc Thêm
        </ReadMoreButton>
      </AnimatedArticleCard>
    </Col>
  );

  // Thêm log để debug
  console.log("Articles:", articles);

  return (
    <BlogContainer>
      <Header>
        <div className="header-title">
          <ReadOutlined />
          <Title level={2} style={{ margin: 0 }}>Blog Cai Thuốc Lá</Title>
        </div>
      </Header>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        Array.isArray(articles) && articles.length > 0 ? (
          <Row gutter={[30, 30]}>
            {articles.map(renderArticleCard)}
          </Row>
        ) : (
          <div>Không có bài viết nào.</div>
        )
      )}

      <Modal
        title={null}
        open={isArticleModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
        centered
        bodyStyle={{ padding: 0, borderRadius: '16px' }}
      >
        {selectedArticle && (
          <ArticleModalContent>
            <div className="modal-title">{selectedArticle.title}</div>
            <div className="modal-meta-info">
              <div className="meta-item"><CalendarOutlined /> {selectedArticle.publishDate}</div>
              <div className="meta-item"><EyeOutlined /> {selectedArticle.views} lượt xem</div>
            </div>
            <div className="modal-author-info">
              <AntUserOutlined style={{ fontSize: 50, color: "#5FB8B3" }} />
              <div className="author-details">
                <div className="author-name">{selectedArticle.authorName}</div>
              </div>
            </div>
            <Text className="full-content">{selectedArticle.excerpt}</Text>
          </ArticleModalContent>
        )}
      </Modal>
    </BlogContainer>
  );
};

export default Blog;
