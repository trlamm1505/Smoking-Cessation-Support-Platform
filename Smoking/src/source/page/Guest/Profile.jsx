import React, { useState } from 'react';
import styled from 'styled-components';
import { CameraOutlined, TrophyOutlined, HeartOutlined, CrownOutlined, TeamOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, UserOutlined, EnvironmentOutlined, EditOutlined, SaveOutlined, CloseOutlined, ManOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

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
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
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
  gap: 16px;
`;

const AchievementItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .trophy-icon {
    color: #5FB8B3;
    font-size: 20px;
  }

  .achievement-text {
    flex: 1;
    font-size: 14px;
    color: #2c3e50;
  }

  .delete-btn {
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s ease;

    &:hover {
      background: #ff7875;
    }
  }
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
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #5FB8B3;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(95, 184, 179, 0.1);
    border-left-color: #4A90E2;

    .icon {
      color: #4A90E2;
      transform: scale(1.05);
    }
  }

  .icon {
    color: #5FB8B3;
    font-size: 18px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(95, 184, 179, 0.1);
    border-radius: 8px;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .label {
    color: #666;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .value {
    color: #2c3e50;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const PersonalInfoCard = styled(Card)`
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    transform: translateY(-1px);
  }
`;

const EditableSection = styled.div`
  position: relative;

  .edit-button {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(95, 184, 179, 0.3);
    z-index: 10;

    &:hover {
      background: linear-gradient(135deg, #4A90E2 0%, #5FB8B3 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(95, 184, 179, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .edit-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    justify-content: center;
    padding: 16px 0;
    border-top: 1px solid #f0f0f0;
  }

  .action-button {
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    min-width: 120px;
    justify-content: center;

    &.save {
      background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
      color: white;
      box-shadow: 0 3px 12px rgba(95, 184, 179, 0.4);

      &:hover {
        background: linear-gradient(135deg, #4A90E2 0%, #5FB8B3 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(95, 184, 179, 0.5);
      }
    }

    &.cancel {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      color: #666;
      border: 2px solid #e9ecef;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        border-color: #dee2e6;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const EditableTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 20px 24px;
  border: 3px solid #5FB8B3;
  border-radius: 16px;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #2c3e50;

  &:focus {
    border-color: #4A90E2;
    box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.15);
    background: #ffffff;
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #999;
    font-style: italic;
    opacity: 0.7;
  }
`;

const EditableInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #5FB8B3;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #4A90E2;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  h2 {
    margin: 0;
    color: #2c3e50;
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;

  h3 {
    color: #2c3e50;
    font-size: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    color: #666;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;

  &.primary {
    background: #5FB8B3;
    color: white;

    &:hover {
      background: #4A90E2;
    }
  }

  &.secondary {
    background: #f5f5f5;
    color: #666;

    &:hover {
      background: #e8e8e8;
    }
  }
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #5FB8B3;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  background: white;

  &:focus {
    border-color: #4A90E2;
  }
`;

const AchievementEditSection = styled.div`
  position: relative;

  .edit-button {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(95, 184, 179, 0.3);
    z-index: 10;

    &:hover {
      background: linear-gradient(135deg, #4A90E2 0%, #5FB8B3 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(95, 184, 179, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .edit-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    justify-content: center;
    padding: 16px 0;
    border-top: 1px solid #f0f0f0;
  }

  .action-button {
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    min-width: 120px;
    justify-content: center;

    &.save {
      background: linear-gradient(135deg, #5FB8B3 0%, #4A90E2 100%);
      color: white;
      box-shadow: 0 3px 12px rgba(95, 184, 179, 0.4);

      &:hover {
        background: linear-gradient(135deg, #4A90E2 0%, #5FB8B3 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(95, 184, 179, 0.5);
      }
    }

    &.cancel {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      color: #666;
      border: 2px solid #e9ecef;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        border-color: #dee2e6;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const EditAchievementList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  border: 2px solid #e9ecef;
`;

const EditAchievementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(95, 184, 179, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    border-color: #5FB8B3;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(95, 184, 179, 0.2);

    &:before {
      left: 100%;
    }

    .achievement-icon {
      transform: scale(1.1);
      color: #4A90E2;
    }

    .delete-btn {
      transform: scale(1.05);
    }
  }

  .achievement-icon {
    color: #5FB8B3;
    font-size: 20px;
    transition: all 0.3s ease;
  }

  .achievement-text {
    flex: 1;
    font-size: 15px;
    font-weight: 500;
    color: #2c3e50;
    line-height: 1.4;
  }

  .delete-btn {
    background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);

    &:hover {
      background: linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(255, 77, 79, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const AddAchievementSection = styled.div`
  margin-top: 16px;
  border: 2px dashed #e9ecef;
  border-radius: 12px;
  overflow: hidden;

  .header {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;

      .sparkle {
        color: #5FB8B3;
      }
    }

    .count {
      background: #5FB8B3;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
  }

  .achievement-options {
    max-height: 200px;
    overflow-y: auto;
    padding: 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #5FB8B3;
      border-radius: 4px;
    }
  }

  .achievement-option {
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f0f0;
    }

    .plus-icon {
      color: #5FB8B3;
      font-size: 16px;
    }

    .option-text {
      font-size: 14px;
      color: #2c3e50;
    }
  }
`;

const Profile = () => {
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountForm, setAccountForm] = useState({
    username: 'nguyenvana',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountError, setAccountError] = useState('');

  const [introText, setIntroText] = useState(
    "Xin chào! Tôi đang trong hành trình cai thuốc lá và đã đạt được nhiều tiến bộ. Tôi tin rằng với sự hỗ trợ của cộng đồng, chúng ta có thể cùng nhau vượt qua thử thách này."
  );
  const [tempIntroText, setTempIntroText] = useState(introText);

  const [profileData, setProfileData] = useState({
    name: 'Nguyễn Văn A',
    isPremium: true,
    premiumTitle: 'Thành viên Premium'
  });
  const [tempProfileData, setTempProfileData] = useState({ ...profileData });

  const [personalInfo, setPersonalInfo] = useState([
    {
      icon: <MailOutlined />,
      label: 'Email',
      value: 'nguyenvana@example.com',
      key: 'email'
    },
    {
      icon: <PhoneOutlined />,
      label: 'Số điện thoại',
      value: '0123456789',
      key: 'phone'
    },
    {
      icon: <UserOutlined />,
      label: 'Tuổi',
      value: '28',
      key: 'age'
    },
    {
      icon: <ManOutlined />,
      label: 'Giới tính',
      value: 'Nam',
      key: 'gender'
    },
    {
      icon: <UserOutlined />,
      label: 'Nghề nghiệp',
      value: 'Kỹ sư phần mềm',
      key: 'job'
    },
    {
      icon: <EnvironmentOutlined />,
      label: 'Địa chỉ',
      value: 'Số 123, Đường ABC, Quận Ba Đình, Hà Nội',
      key: 'address'
    },
    {
      icon: <HomeOutlined />,
      label: 'Quê quán',
      value: 'Nam Định, Việt Nam',
      key: 'hometown'
    },
    {
      icon: <CalendarOutlined />,
      label: 'Ngày tham gia',
      value: '01/01/2024',
      key: 'joinDate'
    }
  ]);

  const [tempPersonalInfo, setTempPersonalInfo] = useState([...personalInfo]);

  const handleSaveIntro = () => {
    setIntroText(tempIntroText);
    setIsEditingIntro(false);
  };

  const handleCancelIntro = () => {
    setTempIntroText(introText);
    setIsEditingIntro(false);
  };

  const handleOpenEditModal = () => {
    setTempProfileData({ ...profileData });
    setTempPersonalInfo([...personalInfo]);
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    setProfileData({ ...tempProfileData });
    setPersonalInfo([...tempPersonalInfo]);
    setShowEditModal(false);
  };

  const handleCancelProfile = () => {
    setTempProfileData({ ...profileData });
    setTempPersonalInfo([...personalInfo]);
    setShowEditModal(false);
  };

  const handleInfoChange = (index, newValue) => {
    const updated = [...tempPersonalInfo];
    updated[index].value = newValue;
    setTempPersonalInfo(updated);
  };

  const handleFileUpload = (type) => {
    // Xử lý upload file cho avatar hoặc cover photo
    console.log(`Uploading ${type}`);
  };

  return (
    <Container>
      <ProfileHeader>
        <HeaderButtons>
          <Button onClick={() => document.getElementById('coverInput').click()}>
            <CameraOutlined />
            Thay đổi ảnh bìa
          </Button>
          <FileInput
            id="coverInput"
            type="file"
            accept="image/*"
            onChange={() => handleFileUpload('cover')}
          />
          <Button onClick={() => setShowAccountModal(true)}>
            <UserOutlined />
            Đổi mật khẩu
          </Button>
          <Button onClick={handleOpenEditModal}>
            <EditOutlined />
            Chỉnh sửa profile
          </Button>
        </HeaderButtons>
        <ProfileContent>
          <AvatarContainer>
            <TeamOutlined style={{ fontSize: '48px', color: '#5FB8B3' }} />
            <div className="camera-icon" onClick={() => document.getElementById('avatarInput').click()}>
              <CameraOutlined />
            </div>
            <FileInput
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={() => handleFileUpload('avatar')}
            />
          </AvatarContainer>
          <UserName>{profileData.name}</UserName>
          <PremiumTag>
            <CrownOutlined />
            {profileData.premiumTitle}
          </PremiumTag>
        </ProfileContent>
      </ProfileHeader>

      <ContentGrid>
        <Card>
          <EditableSection>
            <SectionTitle>Giới thiệu</SectionTitle>
            {!isEditingIntro && (
              <button
                className="edit-button"
                onClick={() => setIsEditingIntro(true)}
              >
                <EditOutlined />
                Sửa
              </button>
            )}
            {isEditingIntro ? (
              <>
                <EditableTextarea
                  value={tempIntroText}
                  onChange={(e) => setTempIntroText(e.target.value)}
                  placeholder="Viết giới thiệu về bản thân..."
                />
                <div className="edit-actions">
                  <button className="action-button save" onClick={handleSaveIntro}>
                    <SaveOutlined />
                    Lưu
                  </button>
                  <button className="action-button cancel" onClick={handleCancelIntro}>
                    <CloseOutlined />
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <p>{introText}</p>
            )}
          </EditableSection>
        </Card>

        <Card>
          <SectionTitle>Thông tin cá nhân</SectionTitle>
          <InfoList>
            {personalInfo.map((info, index) => (
              <InfoItem key={index}>
                <div className="icon">{info.icon}</div>
                <div className="content">
                  <span className="label">{info.label}</span>
                  <span className="value">{info.value}</span>
                </div>
              </InfoItem>
            ))}
          </InfoList>
        </Card>
      </ContentGrid>

      {showEditModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && handleCancelProfile()}>
          <ModalContent>
            <ModalHeader>
              <h2>Chỉnh sửa thông tin cá nhân</h2>
              <CloseButton onClick={handleCancelProfile}>
                <CloseOutlined />
              </CloseButton>
            </ModalHeader>

            <FormSection>
              <h3>
                <UserOutlined />
                Thông tin cơ bản
              </h3>
              <FormGrid>
                <FormField>
                  <label>Tên hiển thị</label>
                  <EditableInput
                    value={tempProfileData.name}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                    placeholder="Nhập tên hiển thị"
                  />
                </FormField>
                {tempPersonalInfo.filter(info => info.key !== 'joinDate').map((info, index) => (
                  <FormField key={index} className={info.key === 'address' ? 'full-width' : ''}>
                    <label>{info.label}</label>
                    {info.key === 'gender' ? (
                      <SelectInput
                        value={info.value}
                        onChange={(e) => handleInfoChange(tempPersonalInfo.findIndex(item => item.key === info.key), e.target.value)}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </SelectInput>
                    ) : info.key === 'age' ? (
                      <EditableInput
                        type="number"
                        min="1"
                        max="100"
                        value={info.value}
                        onChange={(e) => handleInfoChange(tempPersonalInfo.findIndex(item => item.key === info.key), e.target.value)}
                        placeholder="Nhập tuổi"
                      />
                    ) : (
                      <EditableInput
                        value={info.value}
                        onChange={(e) => handleInfoChange(tempPersonalInfo.findIndex(item => item.key === info.key), e.target.value)}
                        placeholder={`Nhập ${info.label.toLowerCase()}`}
                      />
                    )}
                  </FormField>
                ))}
              </FormGrid>
            </FormSection>

            <ModalActions>
              <ActionButton className="secondary" onClick={handleCancelProfile}>
                <CloseOutlined />
                Hủy
              </ActionButton>
              <ActionButton className="primary" onClick={handleSaveProfile}>
                <SaveOutlined />
                Lưu thay đổi
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {showAccountModal && (
        <Modal onClick={e => e.target === e.currentTarget && setShowAccountModal(false)}>
          <ModalContent>
            <ModalHeader>
              <h2>Chỉnh sửa tài khoản & mật khẩu</h2>
              <CloseButton onClick={() => setShowAccountModal(false)}>
                <CloseOutlined />
              </CloseButton>
            </ModalHeader>
            <FormSection>
              <FormField className="full-width">
                <label>Tài khoản đăng nhập</label>
                <EditableInput
                  type="text"
                  value={accountForm.username}
                  onChange={e => setAccountForm({ ...accountForm, username: e.target.value })}
                  placeholder="Nhập tài khoản đăng nhập"
                />
              </FormField>
              <FormField className="full-width">
                <label>Mật khẩu cũ</label>
                <EditableInput
                  type="password"
                  value={accountForm.oldPassword}
                  onChange={e => setAccountForm({ ...accountForm, oldPassword: e.target.value })}
                  placeholder="Nhập mật khẩu cũ"
                />
              </FormField>
              <FormField className="full-width">
                <label>Mật khẩu mới</label>
                <EditableInput
                  type="password"
                  value={accountForm.newPassword}
                  onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                  placeholder="Nhập mật khẩu mới"
                />
              </FormField>
              <FormField className="full-width">
                <label>Xác nhận mật khẩu mới</label>
                <EditableInput
                  type="password"
                  value={accountForm.confirmPassword}
                  onChange={e => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </FormField>
              {accountError && <div style={{ color: 'red', marginTop: 8 }}>{accountError}</div>}
            </FormSection>
            <ModalActions>
              <ActionButton className="secondary" onClick={() => setShowAccountModal(false)}>
                <CloseOutlined />
                Hủy
              </ActionButton>
              <ActionButton className="primary" onClick={() => {
                // Validate
                if (!accountForm.username) {
                  setAccountError('Vui lòng nhập tài khoản đăng nhập.');
                  return;
                }
                if (!accountForm.oldPassword) {
                  setAccountError('Vui lòng nhập mật khẩu cũ.');
                  return;
                }
                if (!accountForm.newPassword) {
                  setAccountError('Vui lòng nhập mật khẩu mới.');
                  return;
                }
                if (accountForm.newPassword !== accountForm.confirmPassword) {
                  setAccountError('Mật khẩu mới và xác nhận không khớp.');
                  return;
                }
                setAccountError('');
                setShowAccountModal(false);
                // Thực hiện lưu thông tin ở đây nếu cần
              }}>
                <SaveOutlined />
                Lưu thay đổi
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Profile; 