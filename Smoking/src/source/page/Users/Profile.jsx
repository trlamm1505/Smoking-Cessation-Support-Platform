import React from 'react';
import styled from 'styled-components';
import { CameraOutlined, TrophyOutlined, HeartOutlined, CrownOutlined, TeamOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  margin-bottom: 24px;
`;

const HeaderButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ProfileContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const AvatarContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
  border: 4px solid rgba(255, 255, 255, 0.2);

  .camera-icon {
    position: absolute;
    right: 0;
    bottom: 0;
    background: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid #5FB8B3;
    color: #5FB8B3;
  }
`;

const UserName = styled.h2`
  color: white;
  font-size: 24px;
  margin: 8px 0;
`;

const PremiumTag = styled.div`
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.9;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 16px;
  font-weight: 600;
`;

const AchievementList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AchievementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #5FB8B3;
  color: white;
  border-radius: 8px;
  font-size: 14px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  text-align: center;

  .icon {
    color: #5FB8B3;
    font-size: 24px;
    margin-bottom: 8px;
  }

  .value {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px;
  }

  .label {
    color: #666;
    font-size: 14px;
  }
`;

const InfoList = styled.div`
  display: grid;
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .icon {
    color: #5FB8B3;
    font-size: 18px;
  }

  .label {
    color: #666;
    font-size: 14px;
    width: 100px;
  }

  .value {
    color: #2c3e50;
    font-weight: 500;
  }
`;

const Profile = () => {
    const stats = [
        { icon: <TrophyOutlined />, value: '30', label: 'Ngày không hút thuốc' },
        { icon: <HeartOutlined />, value: '15%', label: 'Sức khỏe cải thiện' },
        { icon: <CrownOutlined />, value: '1.5M', label: 'Tiết kiệm (VND)' },
        { icon: <TeamOutlined />, value: '42', label: 'Hỗ trợ cộng đồng' }
    ];

    const achievements = [
        'Không hút thuốc 1 tháng',
        'Tiết kiệm 1M VND',
        'Chia sẻ 5 bài viết',
        'Hỗ trợ 3 thành viên'
    ];

    return (
        <Container>
            <ProfileHeader>
                <HeaderButtons>
                    <Button>
                        <CameraOutlined />
                        Thay đổi ảnh bìa
                    </Button>
                    <Button>
                        <CameraOutlined />
                        Chỉnh sửa
                    </Button>
                </HeaderButtons>
                <ProfileContent>
                    <AvatarContainer>
                        <TeamOutlined style={{ fontSize: '48px', color: '#5FB8B3' }} />
                        <div className="camera-icon">
                            <CameraOutlined />
                        </div>
                    </AvatarContainer>
                    <UserName>Nguyễn Văn A</UserName>
                    <PremiumTag>
                        <CrownOutlined />
                        Thành viên Premium
                    </PremiumTag>
                </ProfileContent>
            </ProfileHeader>

            <ContentGrid>
                <div>
                    <Card>
                        <SectionTitle>Giới thiệu</SectionTitle>
                        <p>
                            Xin chào! Tôi đang trong hành trình cai thuốc lá và đã đạt được nhiều tiến bộ.
                            Tôi tin rằng với sự hỗ trợ của cộng đồng, chúng ta có thể cùng nhau vượt qua thử thách này.
                        </p>
                    </Card>

                    <Card style={{ marginTop: '24px' }}>
                        <SectionTitle>Thành tích</SectionTitle>
                        <AchievementList>
                            {achievements.map((achievement, index) => (
                                <AchievementItem key={index}>
                                    <TrophyOutlined />
                                    {achievement}
                                </AchievementItem>
                            ))}
                        </AchievementList>
                    </Card>
                </div>

                <div>
                    <Card>
                        <SectionTitle>Thống kê tiến trình</SectionTitle>
                        <StatsGrid>
                            {stats.map((stat, index) => (
                                <StatCard key={index}>
                                    <div className="icon">{stat.icon}</div>
                                    <div className="value">{stat.value}</div>
                                    <div className="label">{stat.label}</div>
                                </StatCard>
                            ))}
                        </StatsGrid>
                    </Card>

                    <Card style={{ marginTop: '24px' }}>
                        <SectionTitle>Thông tin cá nhân</SectionTitle>
                        <InfoList>
                            <InfoItem>
                                <MailOutlined className="icon" />
                                <span className="label">Email</span>
                                <span className="value">nguyenvana@example.com</span>
                            </InfoItem>
                            <InfoItem>
                                <PhoneOutlined className="icon" />
                                <span className="label">Số điện thoại</span>
                                <span className="value">0123456789</span>
                            </InfoItem>
                            <InfoItem>
                                <HomeOutlined className="icon" />
                                <span className="label">Địa chỉ</span>
                                <span className="value">Hà Nội, Việt Nam</span>
                            </InfoItem>
                            <InfoItem>
                                <CalendarOutlined className="icon" />
                                <span className="label">Ngày tham gia</span>
                                <span className="value">01/01/2024</span>
                            </InfoItem>
                        </InfoList>
                    </Card>
                </div>
            </ContentGrid>
        </Container>
    );
};

export default Profile; 