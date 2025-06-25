import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  CameraOutlined, TrophyOutlined, HeartOutlined, CrownOutlined, TeamOutlined, MailOutlined,
  PhoneOutlined, HomeOutlined, CalendarOutlined, UserOutlined, EnvironmentOutlined, EditOutlined,
  SaveOutlined, CloseOutlined, ManOutlined, PlusOutlined, DeleteOutlined, LockOutlined
} from '@ant-design/icons';
import { Typography, Space, Tag, Button as AntButton, Modal, Form, Input, message, Spin } from 'antd';
import axiosClient from '../Axios/AxiosCLients';
import { toast } from 'react-toastify';
import coachApi from '../Axios/coachApi';

const { Title, Text } = Typography;

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

const CoachTitle = styled.div`
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

const ModalOverlay = styled.div`
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

const CoachProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [tempProfileData, setTempProfileData] = useState({});
  const [accountForm, setAccountForm] = useState({
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountError, setAccountError] = useState('');
  const [introText, setIntroText] = useState('');
  const [tempIntroText, setTempIntroText] = useState('');
  const [newAvatar, setNewAvatar] = useState(null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Không tìm thấy userId!');
      setLoading(false);
      return;
    }
    axiosClient.get(`/api/coaches/by-user/${userId}`)
      .then(res => {
        setProfileData(res.data);
        setTempProfileData(res.data);
        setIntroText(res.data.bio || '');
        setTempIntroText(res.data.bio || '');
        setLoading(false);
      })
      .catch(() => {
        toast.error('Không lấy được thông tin coach!');
        setLoading(false);
      });
  }, []);

  const handleSaveIntro = () => {
    setIntroText(tempIntroText);
    setTempProfileData({ ...tempProfileData, bio: tempIntroText });
    setIsEditingIntro(false);
  };

  const handleCancelIntro = () => {
    setTempIntroText(introText);
    setIsEditingIntro(false);
  };

  const handleOpenEditModal = () => {
    setTempProfileData({ ...profileData });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Không tìm thấy userId!');
        return;
      }
      const body = {
        fullName: tempProfileData.fullName || '',
        profilePictureUrl: tempProfileData.profilePictureUrl || '',
        phoneNumber: tempProfileData.phoneNumber || '',
        address: tempProfileData.address || '',
        gender: tempProfileData.gender || '',
        hometown: tempProfileData.hometown || '',
        occupation: tempProfileData.occupation || '',
        age: tempProfileData.age || 0,
        specialization: tempProfileData.specialization || '',
        degree: tempProfileData.degree || '',
        experience: tempProfileData.experience || '',
        rating: tempProfileData.rating || 0,
        bio: tempIntroText || '',
        availability: tempProfileData.availability || '',
      };
      await coachApi.updateProfile(userId, body);
      setProfileData(body);
      setShowEditModal(false);
      setIntroText(tempIntroText);
      toast.success('Cập nhật thông tin thành công!');
    } catch (err) {
      toast.error('Lỗi khi cập nhật thông tin!');
    }
  };

  const handleCancelProfile = () => {
    setTempProfileData({ ...profileData });
    setShowEditModal(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(URL.createObjectURL(file));
      setNewAvatarFile(file);
    }
  };

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'avatarUploadClient');
    formData.append('cloud_name', 'dp4gsczko');
    const res = await fetch('https://api.cloudinary.com/v1_1/dp4gsczko/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleConfirmAvatar = async () => {
    if (!newAvatarFile) return;
    try {
      const imageUrl = await handleUploadImage(newAvatarFile);
      setTempProfileData(prev => ({ ...prev, profilePictureUrl: imageUrl }));
      setProfileData(prev => ({ ...prev, profilePictureUrl: imageUrl }));
      setNewAvatar(null);
      setNewAvatarFile(null);
      const userId = localStorage.getItem('userId');
      if (userId) {
        const body = { ...profileData, profilePictureUrl: imageUrl };
        await coachApi.updateProfile(userId, body);
        toast.success('Cập nhật ảnh đại diện thành công!');
      }
    } catch (err) {
      toast.error('Lỗi khi upload ảnh!');
    }
  };

  if (loading) return <Spin tip="Đang tải dữ liệu..." />;
  if (!profileData) return <div>Không có dữ liệu coach</div>;

  // Thông tin cá nhân
  const personalInfo = [
    { icon: <MailOutlined />, label: 'Email', value: profileData.email },
    { icon: <PhoneOutlined />, label: 'Số điện thoại', value: profileData.phoneNumber },
    { icon: <UserOutlined />, label: 'Giới tính', value: profileData.gender },
    { icon: <TrophyOutlined />, label: 'Bằng cấp', value: profileData.degree },
    { icon: <TeamOutlined />, label: 'Chuyên môn', value: profileData.specialization },
    { icon: <EnvironmentOutlined />, label: 'Địa chỉ', value: profileData.address },
    { icon: <CalendarOutlined />, label: 'Kinh nghiệm', value: profileData.experience },
  ];

  return (
    <Container>
      <ProfileHeader>
        <HeaderButtons>
          <Button onClick={handleOpenEditModal}>
            <EditOutlined />
            Chỉnh sửa profile
          </Button>
        </HeaderButtons>
        <ProfileContent>
          <AvatarContainer>
            {newAvatar ? (
              <img src={newAvatar} alt="avatar-preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : profileData.profilePictureUrl ? (
              <img src={profileData.profilePictureUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <TeamOutlined style={{ fontSize: '48px', color: '#5FB8B3' }} />
            )}
            <div className="camera-icon" onClick={() => document.getElementById('avatarInput').click()}>
              <CameraOutlined />
            </div>
            <FileInput
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {newAvatar && (
              <Button
                style={{
                  marginTop: 16,
                  background: '#5FB8B3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 20,
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 4px 16px rgba(95,184,179,0.15)',
                  padding: '10px 28px',
                  cursor: 'pointer',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: -40,
                  zIndex: 20
                }}
                onClick={handleConfirmAvatar}
              >
                <SaveOutlined style={{ marginRight: 8 }} /> Xác nhận
              </Button>
            )}
          </AvatarContainer>
          <UserName>{profileData.fullName}</UserName>
          <CoachTitle>
            <UserOutlined />
            {profileData.specialization}
          </CoachTitle>
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
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleCancelProfile()}>
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
                    value={tempProfileData.fullName}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, fullName: e.target.value })}
                    placeholder="Nhập tên hiển thị"
                  />
                </FormField>
                <FormField>
                  <label>Email</label>
                  <div style={{
                    padding: '8px 12px',
                    background: '#f5f5f5',
                    borderRadius: '6px',
                    color: '#888',
                    fontSize: '13px',
                    fontWeight: 500,
                    border: '1.5px solid #e9ecef',
                    marginBottom: 2
                  }}>{tempProfileData.email}</div>
                </FormField>
                <FormField>
                  <label>Số điện thoại</label>
                  <EditableInput
                    value={tempProfileData.phoneNumber}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, phoneNumber: e.target.value })}
                    placeholder="Nhập số điện thoại"
                  />
                </FormField>
                <FormField>
                  <label>Địa chỉ</label>
                  <EditableInput
                    value={tempProfileData.address}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, address: e.target.value })}
                    placeholder="Nhập địa chỉ"
                  />
                </FormField>
                <FormField>
                  <label>Giới tính</label>
                  <SelectInput
                    value={tempProfileData.gender}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, gender: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </SelectInput>
                </FormField>
                <FormField>
                  <label>Bằng cấp</label>
                  <EditableInput
                    value={tempProfileData.degree}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, degree: e.target.value })}
                    placeholder="Nhập bằng cấp"
                  />
                </FormField>
                <FormField>
                  <label>Chuyên môn</label>
                  <EditableInput
                    value={tempProfileData.specialization}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, specialization: e.target.value })}
                    placeholder="Nhập chuyên môn"
                  />
                </FormField>
                <FormField>
                  <label>Kinh nghiệm</label>
                  <EditableInput
                    value={tempProfileData.experience}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, experience: e.target.value })}
                    placeholder="Nhập số năm kinh nghiệm"
                  />
                </FormField>
                <FormField>
                  <label>Ảnh đại diện (URL)</label>
                  <EditableInput
                    value={tempProfileData.profilePictureUrl}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, profilePictureUrl: e.target.value })}
                    placeholder="Nhập link ảnh đại diện"
                  />
                </FormField>
                <FormField>
                  <label>Bio</label>
                  <EditableTextarea
                    value={tempIntroText}
                    onChange={(e) => setTempIntroText(e.target.value)}
                    placeholder="Viết giới thiệu về bản thân..."
                  />
                </FormField>
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
        </ModalOverlay>
      )}
    </Container>
  );
};

export default CoachProfile; 