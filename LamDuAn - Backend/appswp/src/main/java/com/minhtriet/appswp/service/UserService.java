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
import java.util.Random;
import java.util.UUID;

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
    public void registerUserWithVerification(User user) {
        // 1. Kiểm tra username/email đã tồn tại chưa (vẫn check trong bảng User)
        if (isUsernameExists(user.getUsername()) || isEmailExists(user.getEmail())) {
            throw new IllegalArgumentException("Username or Email already exists!");
        }
        // 2. Serialize toàn bộ user thành JSON, lưu vào VerificationToken
        user.setEnabled(false); // Trạng thái chưa kích hoạt
        user.setRegistrationDate(LocalDateTime.now());
        String userJson;
        try {
            userJson = objectMapper.writeValueAsString(user);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Cannot serialize user data", e);
        }

        // 3. Tạo token xác thực email
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);                           // Mã token
        verificationToken.setEmail(user.getEmail());                 // Email người đăng ký
        verificationToken.setUserInfo(userJson);                     // Lưu user JSON vào token
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // Token sống 24h
        verificationToken.setType("EMAIL_VERIFICATION");             // Loại xác thực email
        tokenRepository.save(verificationToken);                     // Lưu vào DB

        // 4. Gửi mail xác thực
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), token);
    }

    /**
     * Xác thực email: Khi user click link xác thực, lấy thông tin user từ VerificationToken,
     * lưu vào bảng User, xóa token khỏi DB.
     */
    public boolean verifyUserRegistration(String token) {
        Optional<VerificationToken> opt = tokenRepository.findByToken(token);
        if (opt.isEmpty()) return false;
        VerificationToken vt = opt.get();

        // Chỉ xử lý token loại xác thực email
        if (!"EMAIL_VERIFICATION".equals(vt.getType())) return false;

        // Kiểm tra token có hết hạn không
        if (vt.getExpiryDate() != null && vt.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(vt);
            return false;
        }

        try {
            // Deserialize user từ JSON
            User user = objectMapper.readValue(vt.getUserInfo(), User.class);
            user.setEnabled(true); // Đã xác thực
            userRepository.save(user);
        } catch (Exception e) {
            return false;
        }
        // Xóa token sau khi xác thực thành công
        tokenRepository.delete(vt);
        return true;
    }

    // ================== QUÊN MẬT KHẨU: Gửi OTP VỀ EMAIL ==================

    /**
     * Sinh ra OTP 4 số ngẫu nhiên dưới dạng String.
     */
    private String generateOtp() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(9000); // Số từ 1000 - 9999
        return String.valueOf(otp);
    }

    /**
     * Gửi OTP cho email muốn đặt lại mật khẩu.
     * - Lưu OTP vào VerificationToken, type = PASSWORD_RESET_OTP
     * - Lưu tạm mật khẩu mới vào userInfo (nên hash ở FE hoặc BE)
     */
    public boolean sendPasswordResetOtp(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) return false;

        // Sinh OTP mới (4 số)
        String otp = generateOtp();

        // Xóa OTP cũ (nếu có)
        tokenRepository.findByEmailAndType(email, "PASSWORD_RESET_OTP")
                .ifPresent(tokenRepository::delete);

        VerificationToken vt = new VerificationToken();
        vt.setToken(otp); // Lưu OTP
        vt.setEmail(email);
        vt.setUserInfo(newPassword); // Lưu tạm mật khẩu mới, có thể hash trước ở FE/BE
        vt.setExpiryDate(LocalDateTime.now().plusMinutes(10)); // OTP sống 10 phút
        vt.setType("PASSWORD_RESET_OTP");
        tokenRepository.save(vt);

        // Gửi OTP qua email
        emailService.sendOtpResetPassword(email, otp);
        return true;
    }

    /**
     * Kiểm tra OTP và đổi mật khẩu nếu hợp lệ.
     * - Nhận vào email và OTP
     * - Nếu đúng thì đổi mật khẩu thành công, xóa OTP khỏi DB
     */
    public boolean verifyOtpAndResetPassword(String email, String otp) {
        Optional<VerificationToken> vtOpt = tokenRepository.findByEmailAndType(email, "PASSWORD_RESET_OTP");
        if (vtOpt.isEmpty()) return false;
        VerificationToken vt = vtOpt.get();

        // Kiểm tra OTP đúng & chưa hết hạn
        if (!vt.getToken().equals(otp) || vt.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(vt); // Nếu sai/hết hạn thì xóa luôn
            return false;
        }

        // Lấy user
        User user = userRepository.findByEmail(email);
        if (user == null) {
            tokenRepository.delete(vt);
            return false;
        }

        // Đổi mật khẩu mới (userInfo lưu tạm mật khẩu mới)
        user.setPasswordHash(vt.getUserInfo());
        userRepository.save(user);

        tokenRepository.delete(vt); // Xóa OTP đã dùng
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
                    // KHÔNG cập nhật password, registrationDate, lastLoginDate ở đây
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
}
