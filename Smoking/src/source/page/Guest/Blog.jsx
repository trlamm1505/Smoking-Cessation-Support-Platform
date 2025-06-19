import React, { useState } from 'react';
import { Card, Row, Col, Tag, Space, Typography, Modal } from 'antd';
import { CalendarOutlined, EyeOutlined, ReadOutlined, UserOutlined as AntUserOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

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

const articles = [
  {
    id: 1,
    title: 'Top 10 Phương Pháp Cai Thuốc Lá Hiệu Quả Nhất',
    category: 'methods',
    coverImage: 'https://images.unsplash.com/photo-1543269865-cbf427fdce8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    author: {
      name: 'TS. Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cfd293ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80',
      title: 'Chuyên gia cai nghiện'
    },
    views: '1.520 lượt xem',
    readTime: '8 phút đọc',
    date: '15/03/2024',
    excerpt: 'Khám phá những phương pháp cai thuốc lá được chứng minh hiệu quả bởi các chuyên gia y tế, giúp bạn trên hành trình bỏ thuốc lá thành công và sống khỏe mạnh hơn mỗi ngày.',
    content: 'Nội dung đầy đủ của bài viết Top 10 Phương Pháp Cai Thuốc Lá Hiệu Quả Nhất. Đây là phần sẽ hiển thị trong modal. Nó sẽ bao gồm chi tiết về từng phương pháp, lời khuyên từ chuyên gia, và các bước thực hiện. Mục tiêu là cung cấp đủ thông tin cho người đọc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    id: 2,
    title: 'Tác Hại của Thuốc Lá Đối Với Sức Khỏe Tim Mạch và Cách Phòng Ngừa',
    category: 'health',
    coverImage: 'https://images.unsplash.com/photo-1581092490074-d421712a2df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    author: {
      name: 'PGS.TS Trần B',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71d9120c7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      title: 'Bác sĩ Tim mạch'
    },
    views: '2.150 lượt xem',
    readTime: '10 phút đọc',
    date: '12/03/2024',
    excerpt: 'Nghiên cứu mới nhất về ảnh hưởng của thuốc lá đối với hệ tim mạch và cách phòng ngừa, giúp bạn bảo vệ trái tim khỏe mạnh và kéo dài tuổi thọ.',
    content: 'Nội dung đầy đủ của bài viết Tác Hại của Thuốc Lá Đối Với Sức Khỏe Tim Mạch. Bài viết này sẽ đi sâu vào cơ chế thuốc lá gây hại cho tim, các bệnh liên quan, và cách giảm thiểu rủi ro khi bỏ thuốc. Thông tin này rất quan trọng để người đọc hiểu rõ hơn. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    id: 3,
    title: 'Câu Chuyện Thành Công: Hành Trình Cai Thuốc Của Tôi Sau 15 Năm',
    category: 'success',
    coverImage: 'https://images.unsplash.com/photo-1520696950275-c9676e1026ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    author: {
      name: 'Lê Văn C',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469e3802?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      title: 'Người truyền cảm hứng'
    },
    views: '3.300 lượt xem',
    readTime: '12 phút đọc',
    date: '10/03/2024',
    excerpt: 'Chia sẻ từ người đã cai thuốc thành công sau 15 năm hút thuốc và những bài học quý giá, truyền cảm hứng cho những ai đang tìm kiếm con đường thoát khỏi nicotine.',
    content: 'Nội dung đầy đủ của bài viết Câu Chuyện Thành Công: Hành Trình Cai Thuốc Của Tôi. Câu chuyện truyền cảm hứng này sẽ chia sẻ kinh nghiệm cá nhân, những khó khăn đã vượt qua, và những lợi ích đạt được sau khi bỏ thuốc. Đây là nguồn động lực lớn cho người đọc. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    id: 4,
    title: 'Dinh Dưỡng Hợp Lý Giúp Cai Thuốc Thành Công',
    category: 'nutrition',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57397b919ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    author: {
      name: 'ThS. Dinh Dưỡng Mai Anh',
      avatar: 'https://images.unsplash.com/photo-1579783902677-fcb6951121d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      title: 'Chuyên gia dinh dưỡng'
    },
    views: '1.800 lượt xem',
    readTime: '9 phút đọc',
    date: '08/03/2024',
    excerpt: 'Tìm hiểu về các loại thực phẩm và chế độ ăn uống giúp giảm thèm thuốc, tăng cường sức khỏe trong quá trình cai thuốc lá.',
    content: 'Nội dung đầy đủ của bài viết Dinh Dưỡng Hợp Lý Giúp Cai Thuốc Thành Công. Bài viết này sẽ cung cấp các lời khuyên về chế độ ăn uống, các loại vitamin và khoáng chất cần thiết, cũng như những thực phẩm nên tránh khi cai thuốc. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 5,
    title: 'Vượt Qua Cơn Thèm Thuốc: Chiến Lược Tâm Lý Hiệu Quả',
    category: 'psychology',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c58567?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    author: {
      name: 'TS. Tâm lý học Linh Chi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      title: 'Chuyên gia tâm lý'
    },
    views: '2.500 lượt xem',
    readTime: '11 phút đọc',
    date: '05/03/2024',
    excerpt: 'Khám phá các kỹ thuật tâm lý giúp bạn đối phó với những cơn thèm thuốc, giảm căng thẳng và duy trì quyết tâm cai thuốc.',
    content: 'Nội dung đầy đủ của bài viết Vượt Qua Cơn Thèm Thuốc: Chiến Lược Tâm Lý Hiệu Quả. Bài viết này sẽ đi sâu vào các phương pháp đối phó với căng thẳng, quản lý cảm xúc, và các kỹ thuật thư giãn để hỗ trợ quá trình cai thuốc. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
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
    <Col xs={24} md={12} lg={8} style={{ marginBottom: 30 }}>
      <AnimatedArticleCard
        cover={<img alt={article.title} src={article.coverImage} />}
        delay={`${(filteredArticles.indexOf(article) * 0.1) + 0.1}s`}
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
      </AnimatedArticleCard>
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
        {categories.map((category, idx) => (
          <AnimatedCategoryTag
            key={category.key}
            color={category.color}
            onClick={() => setActiveCategory(category.key)}
            style={{ backgroundColor: activeCategory === category.key ? category.color : '#f0f0f0', color: activeCategory === category.key ? 'white' : '#555' }}
            delay={`${(idx * 0.07) + 0.05}s`}
          >
            {category.label}
          </AnimatedCategoryTag>
        ))}
      </CategoryContainer>

      <Row gutter={[30, 30]}>
        {filteredArticles.map(renderArticleCard)}
      </Row>

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
