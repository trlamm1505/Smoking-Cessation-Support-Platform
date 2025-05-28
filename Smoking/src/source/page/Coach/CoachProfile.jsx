import React, { useState } from 'react';
import styled from 'styled-components';
import { CameraOutlined, TrophyOutlined, HeartOutlined, CrownOutlined, TeamOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, LockOutlined, EditOutlined, UserOutlined as UserIcon } from '@ant-design/icons'; // Import icons, use alias for UserOutlined to avoid conflict
import { Typography, Space, Tag, Button as AntButton, Modal, Form, Input } from 'antd'; // Import Modal, Form, Input

const { Title, Text } = Typography;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px; /* Matched User profile padding */
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
  border-radius: 16px; /* Matched User profile border-radius */
  padding: 20px; /* Matched User profile padding */
  position: relative;
  margin-bottom: 24px; /* Matched User profile margin-bottom */
`;

const HeaderButtons = styled.div`
  display: flex;
  justify-content: flex-end; /* Keep flex-end as buttons are on the right */
  gap: 8px; /* Matched User profile gap */
  margin-bottom: 20px; /* Matched User profile margin-bottom */
`;

const Button = styled(AntButton)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px; /* Matched User profile padding */
  border-radius: 8px; /* Matched User profile border-radius */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px; /* Matched User profile gap */
  font-size: 14px; /* Matched User profile font size */

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .anticon {
      font-size: 16px; /* Adjusted icon size */
  }
`;

const ProfileContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const AvatarContainer = styled.div`
  width: 120px; /* Matched User profile size */
  height: 120px; /* Matched User profile size */
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px; /* Matched User profile margin */
  border: 4px solid rgba(255, 255, 255, 0.2); /* Matched User profile border */

  .camera-icon {
    position: absolute;
    right: 0; /* Matched User profile position */
    bottom: 0; /* Matched User profile position */
    background: white;
    border-radius: 50%;
    width: 32px; /* Matched User profile size */
    height: 32px; /* Matched User profile size */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid #5FB8B3; /* Matched User profile border */
    color: #5FB8B3;
    font-size: 14px; /* Adjusted font size */
  }
`;

const UserName = styled.h2`
  color: white;
  font-size: 24px; /* Matched User profile font size */
  margin: 8px 0; /* Matched User profile margin */
`;

const CoachTitle = styled.div`
  color: white;
  font-size: 14px; /* Matched User profile font size */
  display: flex;
  align-items: center;
  gap: 4px; /* Matched User profile gap */
  opacity: 0.9;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr; /* Matched User profile grid structure */
  gap: 24px; /* Matched User profile gap */
  margin-top: 24px; /* Matched User profile margin-top */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Recreating Card structure using styled divs
const StyledCard = styled.div`
  background: white;
  border-radius: 16px; /* Matched User profile border-radius */
  padding: 0; /* Remove default padding, controlled by CardContent */
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); /* Matched User profile shadow */
  border: none; /* Ensure no default border */
  overflow: hidden;
`;

const CardTitle = styled.h3`
    font-size: 18px; /* Matched User profile font size */
    font-weight: 600;
    color: #2c3e50;
    padding: 10px 24px 0; /* Further reduced padding */
    margin-bottom: 0; /* Remove default margin */
`;

const CardContent = styled.div`
   padding: 8px 24px 12px; /* Further reduced padding */
`;

const SectionTitle = styled.h3`
  font-size: 18px; /* Matched User profile font size */
  color: #2c3e50;
  margin-bottom: 16px; /* Matched User profile margin-bottom */
  font-weight: 600;
`;

const AchievementList = styled.div` /* Added AchievementList styled component */
  display: flex;
  flex-direction: column;
  gap: 12px; /* Matched User profile gap */
`;

const AchievementItem = styled.div` /* Added AchievementItem styled component */
  display: flex;
  align-items: center;
  gap: 8px; /* Matched User profile gap */
  padding: 8px 16px; /* Matched User profile padding */
  background: #5FB8B3;
  color: white;
  border-radius: 8px; /* Matched User profile border-radius */
  font-size: 14px; /* Matched User profile font size */
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Keep 2 columns for stats as per previous discussion */
  gap: 16px; /* Matched User profile gap */
  margin-bottom: 24px; /* Matched User profile margin-bottom */

   @media (max-width: 480px) {
      grid-template-columns: 1fr; /* Stack on very small screens */
   }
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 20px; /* Matched User profile padding */
  border-radius: 12px; /* Matched User profile border-radius */
  text-align: center;

  .icon {
    color: #5FB8B3;
    font-size: 24px; /* Matched User profile font size */
    margin-bottom: 8px; /* Matched User profile margin-bottom */
  }

  .value {
    font-size: 24px; /* Matched User profile font size */
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px; /* Matched User profile margin-bottom */
  }

  .label {
    color: #666;
    font-size: 14px; /* Matched User profile font size */
  }
`;

const InfoList = styled.div`
  display: grid;
  gap: 16px; /* Matched User profile gap */
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* Matched User profile gap */

  .icon {
    color: #5FB8B3;
    font-size: 18px; /* Matched User profile icon size */
  }

  .label {
    color: #666;
    font-size: 14px; /* Matched User profile font size */
    width: 100px; /* Matched User profile width */
  }

  .value {
    color: #2c3e50;
    font-weight: 500;
    font-size: 14px; /* Matched User profile font size */
  }
`;

const CoachProfile = () => {
    // Removed: const navigate = useNavigate(); // Initialize useNavigate
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State for modal visibility
    const [editForm] = Form.useForm(); // Form instance

    // Mock data for Coach - replace with real data
    const [coachData, setCoachData] = useState({
        name: 'Coach Nguyễn Văn B',
        title: 'Chuyên gia tư vấn cai thuốc',
        avatarUrl: '/Images/default-avatar.jpg', // Replace with actual avatar URL
        activeClients: 35,
        consultationsCompleted: 120,
        successRate: 85,
        yearsExperience: 5,
        totalAchievements: 15,
        achievements: [
            'Hoàn thành 100 buổi tư vấn',
            'Đạt tỷ lệ thành công 80%',
            'Nhận phản hồi tích cực từ 50 khách hàng',
             'Đồng hành cùng 10 khách hàng cai thuốc thành công'
        ],
        personalInfo: {
            email: 'coachnguyenvanb@example.com',
            phone: '0987654321',
            address: 'TP Hồ Chí Minh, Việt Nam',
            joinDate: '01/05/2019',
            qualifications: 'Chứng chỉ A, B', // Added qualifications
            expertise: 'Tư vấn cá nhân, liệu pháp nhóm' // Added expertise
        },
         description: 'Xin chào! Tôi là một chuyên gia tư vấn với nhiều năm kinh nghiệm...' // Added description
    });

    const stats = [
        { icon: <TeamOutlined />, value: coachData.activeClients, label: 'Khách hàng đang tư vấn' },
        { icon: <CalendarOutlined />, value: coachData.consultationsCompleted, label: 'Buổi tư vấn hoàn thành' },
        { icon: <HeartOutlined />, value: `${coachData.successRate}%`, label: 'Tỷ lệ thành công' },
        { icon: <TrophyOutlined />, value: coachData.yearsExperience, label: 'Năm kinh nghiệm' },
    ];

    const handleChangePassword = () => {
        console.log('Change password button clicked');
        alert('Chức năng thay đổi mật khẩu sẽ được triển khai tại đây.');
    };

     const handleChangeAvatar = () => {
        console.log('Change avatar button clicked');
        alert('Chức năng thay đổi ảnh đại diện sẽ được triển khai tại đây.');
    };

    // Removed: const handleGoToSchedule = () => {
    // Removed:     // Navigate to the schedule page
    // Removed: };

    const handleEditProfileClick = () => {
        // Set initial values in the form when opening the modal
        editForm.setFieldsValue({
            name: coachData.name,
            email: coachData.personalInfo.email,
            phone: coachData.personalInfo.phone,
            qualifications: coachData.personalInfo.qualifications,
            expertise: coachData.personalInfo.expertise,
            description: coachData.description,
        });
        setIsEditModalVisible(true);
    };

    const handleSaveProfile = (values) => {
        // TODO: Implement API call to save profile changes
        console.log('Saving profile changes:', values);
        setCoachData({
            ...coachData,
            name: values.name,
            personalInfo: {
                ...coachData.personalInfo,
                email: values.email,
                phone: values.phone,
                qualifications: values.qualifications,
                expertise: values.expertise,
            },
            description: values.description,
        });
        setIsEditModalVisible(false);
        // In a real app, handle success/error messages based on API response
    };

    return (
        <Container>
            <ProfileHeader>
                <HeaderButtons>
                    {/* Temporarily removed Schedule button functionality */}
                    <Button icon={<CalendarOutlined />} /* onClick={handleGoToSchedule} */>Thiết lập lịch làm việc</Button>
                    <Button icon={<CameraOutlined />} onClick={handleChangeAvatar}>Thay đổi ảnh đại diện</Button>
                    <Button icon={<EditOutlined />} onClick={handleEditProfileClick}>Chỉnh sửa hồ sơ</Button> {/* Added onClick */}
                    <Button icon={<LockOutlined />} onClick={handleChangePassword}>Thay đổi mật khẩu</Button>
                </HeaderButtons>
                <ProfileContent>
                    <AvatarContainer>
                         {/* Use actual img tag for avatar */}
                        <img src={coachData.avatarUrl} alt={`${coachData.name}'s Avatar`} className="w-full h-full rounded-full object-cover" />
                        {/* <div className="camera-icon"><CameraOutlined /></div> */}
                         {/* Camera icon can be added back if needed for avatar upload, perhaps positioned over the image */}
                    </AvatarContainer>
                    <UserName>{coachData.name}</UserName>
                    <CoachTitle>
                        <UserIcon />
                        {coachData.title} {/* Display coach title here */}
                    </CoachTitle>
                </ProfileContent>
            </ProfileHeader>

            <ContentGrid>
                <div> {/* Left Column */}
                    <StyledCard>
                        <CardTitle>Giới thiệu</CardTitle>
                        <CardContent>
                             <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                {coachData.description} {/* Display description */}
                            </p>
                        </CardContent>
                    </StyledCard>

                    {/* Added Achievements section back */}
                    <StyledCard style={{ marginTop: '24px' }}> {/* Increased margin-top to move down */}
                         <CardTitle>Thành tích</CardTitle>
                         <CardContent>
                            <AchievementList>
                                {coachData.achievements.map((achievement, index) => (
                                    <AchievementItem key={index}>
                                        <TrophyOutlined />
                                        {achievement}
                                    </AchievementItem>
                                ))}
                            </AchievementList>
                         </CardContent>
                    </StyledCard>

                </div>

                <div> {/* Right Column */}
                    <StyledCard>
                         <CardTitle>Thống kê hoạt động</CardTitle>
                         <CardContent>
                            <StatsGrid>
                                {stats.map((stat, index) => (
                                    <StatCard key={index}>
                                        <div className="icon">{stat.icon}</div>
                                        <div className="value">{stat.value}</div>
                                        <div className="label">{stat.label}</div>
                                    </StatCard>
                                ))}
                            </StatsGrid>
                         </CardContent>
                    </StyledCard>

                    <StyledCard style={{ marginTop: '8px' }}> {/* Adjusted margin-top */}
                         <CardTitle>Thông tin cá nhân</CardTitle>
                         <CardContent>
                            <InfoList>
                                 <InfoItem>
                                    <MailOutlined className="icon" />
                                    <span className="label">Email</span>
                                    <span className="value">{coachData.personalInfo.email}</span>
                                </InfoItem>
                                <InfoItem>
                                    <PhoneOutlined className="icon" />
                                    <span className="label">Số điện thoại</span>
                                    <span className="value">{coachData.personalInfo.phone}</span>
                                </InfoItem>
                                 <InfoItem>
                                    <HomeOutlined className="icon" />
                                    <span className="label">Địa chỉ</span>
                                    <span className="value">{coachData.personalInfo.address}</span>
                                </InfoItem>
                                <InfoItem>
                                    <CalendarOutlined className="icon" />
                                    <span className="label">Ngày tham gia</span>
                                    <span className="value">{coachData.personalInfo.joinDate}</span>
                                </InfoItem>
                                <InfoItem> {/* Added Qualifications */}
                                    <TrophyOutlined className="icon" />
                                    <span className="label">Bằng cấp</span>
                                    <span className="value">{coachData.personalInfo.qualifications}</span>
                                </InfoItem>
                                 <InfoItem> {/* Added Expertise */}
                                    <TeamOutlined className="icon" />
                                    <span className="label">Lĩnh vực mạnh</span>
                                    <span className="value">{coachData.personalInfo.expertise}</span>
                                </InfoItem>
                            </InfoList>
                         </CardContent>
                    </StyledCard>
                </div>
            </ContentGrid>

            {/* Edit Profile Modal */}
            <Modal
                title="Chỉnh sửa hồ sơ"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null} // Use form's own submit button
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleSaveProfile}
                    initialValues={{
                        name: coachData.name,
                        email: coachData.personalInfo.email,
                        phone: coachData.personalInfo.phone,
                        qualifications: coachData.personalInfo.qualifications,
                        expertise: coachData.personalInfo.expertise,
                        description: coachData.description,
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="qualifications"
                        label="Bằng cấp"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="expertise"
                        label="Lĩnh vực mạnh"
                    >
                        <Input />
                    </Form.Item>
                     <Form.Item
                        name="description"
                        label="Mô tả bản thân"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </Container>
    );
};

export default CoachProfile; 