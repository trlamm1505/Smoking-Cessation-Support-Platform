package com.minhtriet.appswp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minhtriet.appswp.entity.User;
import com.minhtriet.appswp.entity.VerificationToken;
import com.minhtriet.appswp.repository.UserRepository;
import com.minhtriet.appswp.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Random;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    VerificationTokenRepository tokenRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper; // Jackson để serialize/deserialize User

    // ======== ĐĂNG KÝ: CHỈ LƯU TOKEN, GỬI EMAIL XÁC THỰC =========

    /**
     * Đăng ký user mới: KHÔNG lưu User vào DB, chỉ lưu tạm vào VerificationToken,
     * gửi email xác thực.
     */
    public void registerUserWithVerification(User user) {
        if (isUsernameExists(user.getUsername()) || isEmailExists(user.getEmail())) {
            throw new IllegalArgumentException("Username or Email already exists!");
        }
        user.setEnabled(false); // Trạng thái chưa kích hoạt
        user.setRegistrationDate(LocalDateTime.now());
        String userJson;
        try {
            userJson = objectMapper.writeValueAsString(user);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Cannot serialize user data", e);
        }

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setEmail(user.getEmail());
        verificationToken.setUserInfo(userJson);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        verificationToken.setType("EMAIL_VERIFICATION");
        tokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user, token);
    }

    /**
     * Xác thực email đăng ký.
     */
    public boolean verifyUserRegistration(String token) {
        Optional<VerificationToken> opt = tokenRepository.findByToken(token);
        if (opt.isEmpty()) return false;
        VerificationToken vt = opt.get();
        if (!"EMAIL_VERIFICATION".equals(vt.getType())) return false;
        if (vt.getExpiryDate() != null && vt.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(vt);
            return false;
        }
        try {
            User user = objectMapper.readValue(vt.getUserInfo(), User.class);
            user.setEnabled(true);
            userRepository.save(user);
        } catch (Exception e) {
            return false;
        }
        tokenRepository.delete(vt);
        return true;
    }

    // ================== CÁC HÀM CRUD KHÁC ==================

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User createNewUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            user.setUsername(user.getEmail());
        }
        return userRepository.save(user);
    }

    public User updateUserById(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    if (updatedUser.getUsername() != null && !updatedUser.getUsername().trim().isEmpty()) {
                        user.setUsername(updatedUser.getUsername());
                    }
                    if (updatedUser.getEmail() != null && !updatedUser.getEmail().trim().isEmpty()) {
                        user.setEmail(updatedUser.getEmail());
                    }
                    if (updatedUser.getFullName() != null) {
                        user.setFullName(updatedUser.getFullName());
                    }
                    if (updatedUser.getProfilePictureUrl() != null) {
                        user.setProfilePictureUrl(updatedUser.getProfilePictureUrl());
                    }
                    if (updatedUser.getCurrentMembershipPackageId() != null) {
                        user.setCurrentMembershipPackageId(updatedUser.getCurrentMembershipPackageId());
                    }
                    if (updatedUser.getSubscriptionEndDate() != null) {
                        user.setSubscriptionEndDate(updatedUser.getSubscriptionEndDate());
                    }
                    if (updatedUser.getCoachId() != 0) {
                        user.setCoachId(updatedUser.getCoachId());
                    }
                    if (updatedUser.getRole() != null && !updatedUser.getRole().trim().isEmpty()) {
                        user.setRole(updatedUser.getRole());
                    }
                    return userRepository.save(user);
                })
                .orElse(null);
    }

    public boolean deleteUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return true;
                })
                .orElse(false);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public boolean isUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public void updateLastLoginDate(Long userId) {
        userRepository.findById(userId)
                .ifPresent(user -> {
                    user.setLastLoginDate(LocalDateTime.now());
                    userRepository.save(user);
                });
    }

    public boolean updatePassword(Long userId, String newPasswordHash) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setPasswordHash(newPasswordHash);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    public boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    public List<User> getUsersWithCoach() {
        return userRepository.findByCoachIdIsNotNull();
    }

    public List<User> getUsersByCoachId(Long coachId) {
        return userRepository.findByCoachId(coachId);
    }

    // ======= QUÊN MẬT KHẨU VỚI OTP 4 SỐ =======
    /**
     * Bước 1: Nhận email, mật khẩu mới từ user, sinh mã OTP, gửi về email.
     * @param email email user nhập vào
     * @param newPasswordHash mật khẩu mới đã được hash
     * @return true nếu gửi mail thành công
     */
    public boolean sendPasswordResetOtp(String email, String newPasswordHash) {
        User user = userRepository.findByEmail(email);
        if (user == null) return false; // Không tiết lộ lý do nếu không có

        // Sinh OTP 4 số
        String otp = String.format("%04d", new Random().nextInt(10000));

        // Xóa OTP cũ nếu có
        tokenRepository.findByEmailAndType(email, "PASSWORD_RESET")
                .ifPresent(tokenRepository::delete);

        VerificationToken vt = new VerificationToken();
        vt.setEmail(email);
        vt.setOtp(otp);
        vt.setNewPasswordHash(newPasswordHash); // Lưu tạm mật khẩu mới (đã hash!)
        vt.setExpiryDate(LocalDateTime.now().plusMinutes(10)); // OTP sống 10 phút
        vt.setType("PASSWORD_RESET");
        tokenRepository.save(vt);

        // Gửi OTP về email
        emailService.sendPasswordResetOtpEmail(email, otp);
        return true;
    }

    /**
     * Bước 2: Nhận email và OTP, xác nhận đúng thì cập nhật mật khẩu mới cho user.
     * @param email email user nhập lại
     * @param otp mã OTP user nhập
     * @return true nếu thành công
     */
    public boolean verifyOtpAndResetPassword(String email, String otp) {
        Optional<VerificationToken> opt = tokenRepository.findByEmailAndOtpAndType(email, otp, "PASSWORD_RESET");
        if (opt.isEmpty()) return false;
        VerificationToken vt = opt.get();

        // Kiểm tra hạn OTP
        if (vt.getExpiryDate() == null || vt.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(vt);
            return false;
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            tokenRepository.delete(vt);
            return false;
        }

        // Đổi mật khẩu
        user.setPasswordHash(vt.getNewPasswordHash());
        userRepository.save(user);

        tokenRepository.delete(vt); // Xóa token OTP sau khi dùng
        return true;
    }
}
