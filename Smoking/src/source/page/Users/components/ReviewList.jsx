import React from 'react';
import { List, Avatar, Typography, Rate } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;

const ReviewItemContainer = styled.div`
  background-color: #5FB8B3; /* Theme color background */
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  color: white; /* White text color */
`;

const ReviewContent = styled.div`
  flex: 1;

  .author-rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .author-name {
    font-weight: 600;
    color: white; /* White color for author name */
  }

  .review-text {
    color: rgba(255, 255, 255, 0.9); /* Slightly transparent white for content */
  }
`;

const ReviewList = ({ reviews }) => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={reviews}
            renderItem={review => (
                <ReviewItemContainer>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'white', color: '#5FB8B3' }} />
                    <ReviewContent>
                        <div className="author-rating">
                            <Text className="author-name">{review.author}</Text>
                            <Rate disabled defaultValue={review.rating} style={{ fontSize: 12, color: '#ffe58f' }} />{/* Gold color for stars */}
                        </div>
                        <Paragraph className="review-text">{review.comment}</Paragraph>
                    </ReviewContent>
                </ReviewItemContainer>
            )}
        />
    );
};

export default ReviewList; 