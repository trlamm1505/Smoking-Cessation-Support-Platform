import React, { useState } from 'react';
import { Card, Row, Col, Tag, Space, Typography } from 'antd';
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const BlogHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;

  h1 {
    font-size: 32px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 8px;
  }

  .subtitle {
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
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
  
  &:hover {
    background: #1677ff;
    color: white;
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
        excerpt: 'Khám phá những phương pháp cai thuốc lá được chứng minh hiệu quả bởi các chuyên gia y tế...'
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
        excerpt: 'Nghiên cứu mới nhất về ảnh hưởng của thuốc lá đối với hệ tim mạch và cách phòng ngừa...'
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
        excerpt: 'Chia sẻ từ người đã cai thuốc thành công sau 15 năm hút thuốc và những bài học quý giá...'
    }
];

const Blog = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredArticles = activeCategory === 'all'
        ? articles
        : articles.filter(article => article.category === activeCategory);

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

                <ReadMoreButton href="#">Đọc Thêm</ReadMoreButton>
            </ArticleCard>
        </Col>
    );

    return (
        <BlogContainer>
            <BlogHeader>
                <h1>Blog Cai Thuốc Lá</h1>
                <Text className="subtitle">
                    Thông tin chuyên sâu và hữu ích về cai thuốc lá từ các chuyên gia
                </Text>
            </BlogHeader>

            <CategoryContainer>
                {categories.map(category => (
                    <CategoryTag
                        key={category.key}
                        color={category.color}
                        onClick={() => setActiveCategory(category.key)}
                        style={{
                            backgroundColor: activeCategory === category.key ? category.color : 'transparent',
                            color: activeCategory === category.key ? 'white' : category.color,
                        }}
                    >
                        {category.label}
                    </CategoryTag>
                ))}
            </CategoryContainer>

            <Row gutter={24}>
                {filteredArticles.map(renderArticleCard)}
            </Row>
        </BlogContainer>
    );
};

export default Blog;
