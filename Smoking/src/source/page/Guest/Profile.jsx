import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CameraOutlined, TrophyOutlined, HeartOutlined, CrownOutlined, TeamOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, UserOutlined, EnvironmentOutlined, EditOutlined, SaveOutlined, CloseOutlined, ManOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import userApi from '../Axios/userAxios';
import { toast } from 'react-toastify';

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
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .value {
    color: #2c3e50;
    font-weight: 500;
    font-size: 15px;
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
  // State for profile
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountForm, setAccountForm] = useState({
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountError, setAccountError] = useState('');

  // API data states
  const [introText, setIntroText] = useState('');
  const [tempIntroText, setTempIntroText] = useState('');
  const [profileData, setProfileData] = useState({});
  const [tempProfileData, setTempProfileData] = useState({});
  const [personalInfo, setPersonalInfo] = useState([]);
  const [tempPersonalInfo, setTempPersonalInfo] = useState([]);

  // Lấy userId từ localStorage (hoặc context/auth thực tế)
  const userId = localStorage.getItem('userId');

  // Định nghĩa các trường personalInfo mặc định giống guest (chỉ dùng để merge key/label/icon, không hardcode value)
  const defaultPersonalInfo = [
    { icon: <PhoneOutlined />, label: 'Số điện thoại', key: 'phoneNumber' },
    { icon: <UserOutlined />, label: 'Tuổi', key: 'age' },
    { icon: <UserOutlined />, label: 'Nghề nghiệp', key: 'occupation' },
    { icon: <EnvironmentOutlined />, label: 'Địa chỉ', key: 'address' },
    { icon: <HomeOutlined />, label: 'Quê quán', key: 'hometown' },
    { icon: <ManOutlined />, label: 'Giới tính', key: 'gender' },

  ];

  // Khi fetch xong dữ liệu từ API, merge các trường để đảm bảo đủ key/label/icon, value lấy từ API hoặc để trống
  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        try {
          const res = await userApi.get(userId); // gọi API lấy thông tin user
          const user = res.data;

          // Gán thông tin chính
          setProfileData(user);
          setTempProfileData(user);
          setIntroText(user.intro || '');
          setTempIntroText(user.intro || '');

          // Tạo lại danh sách thông tin cá nhân (gán trực tiếp từ object user)
          const merged = defaultPersonalInfo.map((item) => ({
            ...item,
            value: user[item.key] ?? '',  // dùng user[item.key] trực tiếp
          }));

          setPersonalInfo(merged);
          setTempPersonalInfo(merged);

        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu user:", err);
        }
      };

      fetchProfile();
    }
  }, [userId]);
  const handleSaveIntro = async () => {
    try {
      // Gửi intro mới lên API
      await userApi.put(userId, { intro: tempIntroText });
      setIntroText(tempIntroText);
      setIsEditingIntro(false);
    } catch (err) {
      // Handle error
    }
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

  const handleSaveProfile = async () => {
    console.log('ĐÃ BẤM LƯU THAY ĐỔI');
    try {
      // B1: Chuyển tempPersonalInfo (array) thành object key-value
      const personalInfoMap = tempPersonalInfo.reduce((acc, item) => {
        acc[item.key] = item.value || '';
        return acc;
      }, {});

      // B2: Tạo object gửi lên backend (merge cả profile lẫn info)
      const updatedProfile = {
        userId: profileData.userId || userId,
        fullName: tempProfileData.fullName || tempProfileData.name || profileData.fullName || profileData.name || '',
        profilePictureUrl: tempProfileData.profilePictureUrl || profileData.profilePictureUrl || '',
        coachId: tempProfileData.coachId || profileData.coachId || 0,
        currentMembershipPackageId: tempProfileData.currentMembershipPackageId || profileData.currentMembershipPackageId || 0,
        phoneNumber: personalInfoMap.phoneNumber || '',
        age: parseInt(personalInfoMap.age) || 0,
        gender: personalInfoMap.gender || '',
        occupation: personalInfoMap.occupation || '',
        address: personalInfoMap.address || '',
        hometown: personalInfoMap.hometown || '',

      };

      console.log('Dữ liệu gửi lên:', updatedProfile);

      // B3: Gửi PUT request
      await userApi.updateProfile(updatedProfile);

      // B4: Cập nhật lại dữ liệu trong state (hiển thị mới)
      setProfileData({ ...profileData, ...updatedProfile });
      setTempProfileData({ ...tempProfileData, ...updatedProfile });
      setPersonalInfo([...tempPersonalInfo]);
      setShowEditModal(false);

      // B5: Thông báo thành công
      toast.success('Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('Lỗi cập nhật:', err.response?.data || err.message);
      toast.error('Lỗi khi cập nhật thông tin!');
    }
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

  // Thêm hàm upload ảnh lên Cloudinary
  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "avatarUploadClient"); // preset bạn đã tạo
    formData.append("cloud_name", "dp4gsczko");

    const res = await fetch("https://api.cloudinary.com/v1_1/dp4gsczko/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // Trả về URL ảnh sau khi upload thành công
  };

  const [newAvatar, setNewAvatar] = useState(null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(URL.createObjectURL(file));
      setNewAvatarFile(file);
    }
  };

  const handleConfirmAvatar = async () => {
    if (!newAvatarFile) return;
    try {
      const imageUrl = await handleUploadImage(newAvatarFile);
      // Gửi đầy đủ schema backend yêu cầu, giữ lại các trường hiện tại
      const updatedProfile = {
        userId: profileData.userId || userId,
        fullName: profileData.fullName || profileData.name || '',
        profilePictureUrl: imageUrl,
        coachId: profileData.coachId || 0,
        currentMembershipPackageId: profileData.currentMembershipPackageId || 0,
        phoneNumber: profileData.phoneNumber || profileData.phone || '',
        hometown: profileData.hometown || '',
        occupation: profileData.occupation || profileData.job || '',
        age: profileData.age || 0,
        address: profileData.address || ''
      };
      await userApi.put(userId, updatedProfile);
      setProfileData(prev => ({ ...prev, profilePictureUrl: imageUrl }));
      setTempProfileData(prev => ({ ...prev, profilePictureUrl: imageUrl }));
      setNewAvatar(null);
      setNewAvatarFile(null);
      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (err) {
      toast.error('Lỗi khi upload ảnh!');
    }
  };

  return (
    <Container>
      <ProfileHeader>
        <HeaderButtons>

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
          <UserName>{profileData.fullName || ''}</UserName>
          {profileData.premiumTitle && (
            <PremiumTag>
              <CrownOutlined />
              {profileData.premiumTitle}
            </PremiumTag>
          )}
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
            {personalInfo.filter(info => info.key !== 'joinDate').map((info, index) => (
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
                  <label>TÊN HIỂN THỊ</label>
                  <EditableInput
                    value={tempProfileData.fullName || tempProfileData.name || ""}
                    onChange={(e) =>
                      setTempProfileData({
                        ...tempProfileData,
                        fullName: e.target.value,
                        name: e.target.value,
                      })
                    }
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
                    ) : info.key === 'phoneNumber' ? (
                      <EditableInput
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={info.value}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                          handleInfoChange(tempPersonalInfo.findIndex(item => item.key === info.key), onlyNums);
                        }}
                        placeholder="Nhập số điện thoại"
                      />
                    ) : info.key === 'smokingYears' ? (
                      <EditableInput
                        type="number"
                        min="0"
                        max="100"
                        value={info.value}
                        onChange={(e) => handleInfoChange(tempPersonalInfo.findIndex(item => item.key === info.key), e.target.value)}
                        placeholder="Nhập số năm hút thuốc"
                      />
                    ) : info.key === 'cigarettesPerDay' ? (
                      <EditableInput
                        type="number"
                        min="0"
                        max="100"
                        value={info.value}
                        onChange={(e) => handleInfoChange(tempPersonalInfo.findIndex(item => item.key === info.key), e.target.value)}
                        placeholder="Nhập số điếu mỗi ngày"
                      />
                    ) : info.key === 'healthIssues' ? (
                      <EditableInput
                        value={info.value}
                        onChange={(e) => handleInfoChange(tempPersonalInfo.findIndex(item => item.key === info.key), e.target.value)}
                        placeholder="Nhập vấn đề sức khỏe (nếu có)"
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
              <ActionButton className="primary" onClick={async () => {
                console.log('Đã bấm nút Lưu thay đổi');
                console.log('accountForm:', accountForm);
                // Validate
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
                try {
                  const userId = localStorage.getItem('userId');
                  console.log('userId:', userId);
                  const res = await userApi.changePassword({
                    userId,
                    currentPassword: accountForm.oldPassword,
                    newPassword: accountForm.newPassword,
                    confirmNewPassword: accountForm.confirmPassword
                  });
                  console.log('API response:', res.data);
                  if (res.data && res.data.success) {
                    toast.success(res.data.message || 'Đổi mật khẩu thành công!');
                    setShowAccountModal(false);
                  } else {
                    setAccountError(res.data.message || 'Đổi mật khẩu thất bại!');
                    toast.error(res.data.message || 'Đổi mật khẩu thất bại!');
                    console.log('API báo lỗi:', res.data.message || 'Đổi mật khẩu thất bại!');
                  }
                } catch (err) {
                  console.log('API error:', err?.response?.data || err.message || err);
                  setAccountError(err?.response?.data?.message || 'Lỗi kết nối server!');
                }
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