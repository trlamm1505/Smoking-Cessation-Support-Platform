import React, { useState } from 'react';
import { Card, Row, Col, Tag, Space, Typography, Modal } from 'antd';
import { CalendarOutlined, EyeOutlined, ReadOutlined, UserOutlined as AntUserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: none;
  padding: 0;
  border-radius: 0;
  border: none;

  .header-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #2c7a75;
    font-size: 24px;
    font-weight: 600;
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
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  height: 100%;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(95, 184, 179, 0.12);
  }
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

const categories = [
  { key: 'all', label: 'Tất cả', color: '#4096ff' },
  { key: 'methods', label: 'Phương pháp', color: '#95de64' },
  { key: 'health', label: 'Sức khỏe', color: '#ff7a45' },
  { key: 'nutrition', label: 'Dinh dưỡng', color: '#4096ff' },
  { key: 'psychology', label: 'Tâm lý', color: '#722ed1' },
  { key: 'success', label: 'Câu chuyện thành công', color: '#ffc53d' }
];

const articles = [
  {
    id: 1,
    title: 'Top 10 Phương Pháp Cai Thuốc Lá Hiệu Quả Nhất',
    category: 'methods',
    coverImage: 'https://source.unsplash.com/random/800x400/?quit-smoking',
    author: {
      name: 'TS. Nguyễn Văn A',
      avatar: 'https://source.unsplash.com/random/100x100/?doctor',
      title: 'Chuyên gia cai nghiện'
    },
    views: '1520',
    readTime: '8 phút đọc',
    date: '15/03/2024',
    excerpt: 'Khám phá những phương pháp cai thuốc lá được chứng minh hiệu quả bởi các chuyên gia y tế...',
    content: 'Nội dung đầy đủ của bài viết Top 10 Phương Pháp Cai Thuốc Lá Hiệu Quả Nhất. Đây là phần sẽ hiển thị trong modal. Nó sẽ bao gồm chi tiết về từng phương pháp, lời khuyên từ chuyên gia, và các bước thực hiện. Mục tiêu là cung cấp đủ thông tin cho người đọc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    id: 2,
    title: 'Tác Hại của Thuốc Lá Đối Với Sức Khỏe Tim Mạch',
    category: 'health',
    coverImage: 'https://source.unsplash.com/random/800x400/?doctor',
    author: {
      name: 'PGS.TS Trần B',
      avatar: 'https://source.unsplash.com/random/100x100/?professor',
      title: 'Bác sĩ Tim mạch'
    },
    views: '2150',
    readTime: '10 phút đọc',
    date: '12/03/2024',
    excerpt: 'Nghiên cứu mới nhất về ảnh hưởng của thuốc lá đối với hệ tim mạch và cách phòng ngừa...',
    content: 'Nội dung đầy đủ của bài viết Tác Hại của Thuốc Lá Đối Với Sức Khỏe Tim Mạch. Bài viết này sẽ đi sâu vào cơ chế thuốc lá gây hại cho tim, các bệnh liên quan, và cách giảm thiểu rủi ro khi bỏ thuốc. Thông tin này rất quan trọng để người đọc hiểu rõ hơn. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    id: 3,
    title: 'Câu Chuyện Thành Công: Hành Trình Cai Thuốc Của Tôi',
    category: 'success',
    coverImage: 'https://source.unsplash.com/random/800x400/?healthy-food',
    author: {
      name: 'Lê Văn C',
      avatar: 'https://source.unsplash.com/random/100x100/?person',
      title: 'Người truyền cảm hứng'
    },
    views: '3300',
    readTime: '12 phút đọc',
    date: '10/03/2024',
    excerpt: 'Chia sẻ từ người đã cai thuốc thành công sau 15 năm hút thuốc và những bài học quý giá...',
    content: 'Nội dung đầy đủ của bài viết Câu Chuyện Thành Công: Hành Trình Cai Thuốc Của Tôi. Câu chuyện truyền cảm hứng này sẽ chia sẻ kinh nghiệm cá nhân, những khó khăn đã vượt qua, và những lợi ích đạt được sau khi bỏ thuốc. Đây là nguồn động lực lớn cho người đọc. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isArticleModalVisible, setIsArticleModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(article => article.category === activeCategory);

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setIsArticleModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsArticleModalVisible(false);
    setSelectedArticle(null);
  };

  const renderArticleCard = (article) => (
    <Col xs={24} md={8} style={{ marginBottom: 24 }}>
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
    </BlogContainer>
  );
};

export default Blog;
