package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.UpdateCoachProfileRequest;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.Coach;
import com.example.SWP_Backend.entity.Payment;
import com.example.SWP_Backend.entity.Token;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.CoachRepository;
import com.example.SWP_Backend.repository.PaymentRepository;
import com.example.SWP_Backend.repository.TokenRepository;
import com.example.SWP_Backend.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TokenRepository tokenRepository;

    @Autowired
    CoachRepository coachRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PaymentRepository paymentRepository;

    // ==== THÊM NotificationService ĐỂ GỬI THÔNG BÁO ====
    @Autowired
    private NotificationService notificationService;

    // ==== ID của admin mặc định là 3 (điều chỉnh theo thực tế nếu cần) ====
    private static final Long ADMIN_USER_ID = 3L;

    /**
     * Cập nhật role nếu user member bị hết hạn,
     * Tuyệt đối KHÔNG động vào admin/coach (để nguyên role này)
     */
    public void updateUserRoleIfExpired(User user) {
        String role = user.getRole();
        if ("admin".equalsIgnoreCase(role) || "coach".equalsIgnoreCase(role)) {
            // KHÔNG bao giờ reset quyền admin/coach
            return;
        }

        if ("member".equalsIgnoreCase(role)) {
            LocalDate now = LocalDate.now();

            // Lấy payment gần nhất của user với status completed
            Payment latestPayment = paymentRepository.findTopByUser_UserIdAndStatusOrderByEndDateDesc(user.getUserId(), "completed");

            if (latestPayment != null) {
                LocalDate renewalDate = latestPayment.getRenewalDate(); // ngày hết hạn + 1

                // Nếu ngày hiện tại đã sau renewalDate
                if (renewalDate != null && now.isAfter(renewalDate)) {
                    // 1. Chuyển role user về guest, reset trường gói
                    user.setRole("guest");
                    user.setCurrentMembershipPackageId(null);
                    user.setSubscriptionEndDate(null);
                    userRepository.save(user);

                    // 2. Chuyển status payment thành expired
                    latestPayment.setStatus("expired");
                    paymentRepository.save(latestPayment);
                }
            }
        }
        // Guest, admin, coach thì không đổi gì
    }

    // ======== ĐĂNG KÝ TÀI KHOẢN VỚI OTP ========
    public void registerUserWithOtp(User user) {
        if (isUsernameExists(user.getUsername()) || isEmailExists(user.getEmail())) {
            throw new IllegalArgumentException("Username or Email already exists!");
        }
        user.setEnabled(false);
        user.setRegistrationDate(LocalDateTime.now());
        // Mặc định role guest nếu chưa set
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("guest");
        }

        String userJson;
        try {
            userJson = objectMapper.writeValueAsString(user);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Cannot serialize user data", e);
        }

        String otp = generateOtp();
        tokenRepository.findByEmailAndType(user.getEmail(), "REGISTER_OTP")
                .ifPresent(tokenRepository::delete);

        Token vt = new Token();
        vt.setToken(otp);
        vt.setEmail(user.getEmail());
        vt.setUserInfo(userJson);
        vt.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        vt.setType("REGISTER_OTP");
        tokenRepository.save(vt);

        emailService.sendOtpResetPassword(user.getEmail(), otp);
    }

    public boolean verifyOtpAndRegister(String email, String otp) {
        Optional<Token> vtOpt = tokenRepository.findByEmailAndType(email, "REGISTER_OTP");
        if (vtOpt.isEmpty()) return false;
        Token vt = vtOpt.get();

        if (!vt.getToken().equals(otp) || vt.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(vt);
            return false;
        }

        try {
            User user = objectMapper.readValue(vt.getUserInfo(), User.class);
            if (userRepository.existsByEmail(user.getEmail())) {
                tokenRepository.delete(vt);
                return false;
            }
            user.setEnabled(true);
            User savedUser = userRepository.save(user);
            tokenRepository.delete(vt);

            // ==== GỬI THÔNG BÁO: ĐĂNG KÝ THÀNH CÔNG (NotificationService, NotificationRequestDTO) ====
            NotificationRequestDTO notiUser = new NotificationRequestDTO();
            notiUser.setRecipientId(savedUser.getUserId());
            notiUser.setTitle("Chào mừng bạn đến với hệ thống!");
            notiUser.setContent("Đăng ký thành công. Chúc bạn trải nghiệm vui vẻ.");
            notiUser.setType("register_success");
            notiUser.setSenderId(ADMIN_USER_ID);
            notificationService.sendNotification(notiUser);

            // ==== GỬI THÔNG BÁO CHO ADMIN ====
            NotificationRequestDTO notiAdmin = new NotificationRequestDTO();
            notiAdmin.setTargetRole("admin");
            notiAdmin.setTitle("Có người dùng mới đăng ký");
            notiAdmin.setContent("User " + savedUser.getFullName() + " (" + savedUser.getEmail() + ") vừa đăng ký tài khoản.");
            notiAdmin.setType("new_user_register");
            notiAdmin.setSenderId(ADMIN_USER_ID);
            notificationService.sendNotification(notiAdmin);

            return true;
        } catch (Exception e) {
            tokenRepository.delete(vt);
            return false;
        }
    }

    // ======== OTP ĐỔI MẬT KHẨU ========
    private String generateOtp() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(9000);
        return String.valueOf(otp);
    }

    public boolean sendPasswordResetOtp(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) return false;

        String otp = generateOtp();
        tokenRepository.findByEmailAndType(email, "PASSWORD_RESET_OTP")
                .ifPresent(tokenRepository::delete);

        Token vt = new Token();
        vt.setToken(otp);
        vt.setEmail(email);
        vt.setUserInfo(newPassword);
        vt.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        vt.setType("PASSWORD_RESET_OTP");
        tokenRepository.save(vt);

        emailService.sendOtpResetPassword(email, otp);
        return true;
    }

    public boolean verifyOtpAndResetPassword(String email, String otp) {
        Optional<Token> vtOpt = tokenRepository.findByEmailAndType(email, "PASSWORD_RESET_OTP");
        if (vtOpt.isEmpty()) return false;
        Token vt = vtOpt.get();

        if (!vt.getToken().equals(otp) || vt.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(vt);
            return false;
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            tokenRepository.delete(vt);
            return false;
        }

        user.setPasswordHash(vt.getUserInfo());
        userRepository.save(user);

        tokenRepository.delete(vt);
        return true;
    }

    // ============= CRUD USER CƠ BẢN =============

    public List<User> getAllUsers() { return userRepository.findAll(); }

    public User getUserById(Long id) { return userRepository.findById(id).orElse(null); }

    public User createNewUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            user.setUsername(user.getEmail());
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("guest");
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
                    // Chỉ coach mới được set coachId (tự đồng bộ coach-user)
                    if ("coach".equalsIgnoreCase(updatedUser.getRole()) && updatedUser.getCoachId() != null) {
                        user.setCoachId(updatedUser.getCoachId());
                    }
                    if (updatedUser.getRole() != null && !updatedUser.getRole().trim().isEmpty()) {
                        user.setRole(updatedUser.getRole());
                    }
                    // ====== Các trường bổ sung ======
                    if (updatedUser.getPhoneNumber() != null) user.setPhoneNumber(updatedUser.getPhoneNumber());
                    if (updatedUser.getHometown() != null) user.setHometown(updatedUser.getHometown());
                    if (updatedUser.getOccupation() != null) user.setOccupation(updatedUser.getOccupation());
                    if (updatedUser.getAge() != null) user.setAge(updatedUser.getAge());
                    if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());
                    if (updatedUser.getGender() != null) user.setGender(updatedUser.getGender());
                    // Đồng bộ coach profile nếu là coach
                    if ("coach".equalsIgnoreCase(user.getRole())) {
                        Coach coach = coachRepository.findByUserUserId(user.getUserId());
                        if (coach != null) {
                            if (user.getFullName() != null) coach.setFullName(user.getFullName());
                            if (user.getProfilePictureUrl() != null) coach.setProfilePictureUrl(user.getProfilePictureUrl());
                            if (user.getPhoneNumber() != null) coach.setPhoneNumber(user.getPhoneNumber());
                            if (user.getAddress() != null) coach.setAddress(user.getAddress());
                            if (user.getGender() != null) coach.setGender(user.getGender());
                            coachRepository.save(coach);
                        }
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

    /**
     * Cập nhật profile User (và đồng bộ sang Coach nếu user này là coach).
     * Member thì coachId luôn null, chỉ coach mới có coachId.
     */
    public boolean updateUserProfile(
            Long userId,
            String fullName,
            String profilePictureUrl,
            Long coachId,
            Integer membershipId,
            String phoneNumber,
            String hometown,
            String occupation,
            Integer age,
            String address,
            String gender
    ) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) return false;

        User user = optionalUser.get();

        // =========== Cập nhật các trường profile bên User ===========
        if (fullName != null) user.setFullName(fullName);
        if (profilePictureUrl != null) user.setProfilePictureUrl(profilePictureUrl);
        if (phoneNumber != null) user.setPhoneNumber(phoneNumber);
        if (hometown != null) user.setHometown(hometown);
        if (occupation != null) user.setOccupation(occupation);
        if (age != null) user.setAge(age);
        if (address != null) user.setAddress(address);
        if (gender != null) user.setGender(gender);
        if (membershipId != null) user.setCurrentMembershipPackageId(membershipId);

        // Chỉ coach mới có coachId
        if ("coach".equalsIgnoreCase(user.getRole()) && coachId != null) {
            user.setCoachId(coachId);
        }

        userRepository.save(user);

        // =========== Nếu user là coach, đồng bộ profile sang Coach ===========
        if ("coach".equalsIgnoreCase(user.getRole())) {
            Coach coach = coachRepository.findByUserUserId(userId);
            if (coach != null) {
                if (fullName != null) coach.setFullName(fullName);
                if (profilePictureUrl != null) coach.setProfilePictureUrl(profilePictureUrl);
                if (phoneNumber != null) coach.setPhoneNumber(phoneNumber);
                if (address != null) coach.setAddress(address);
                if (gender != null) coach.setGender(gender);
                coachRepository.save(coach);
            } else {
                System.out.println("Warning: User có role coach nhưng chưa có Coach profile!");
            }
        }

        return true;
    }

    // Đổi mật khẩu với xác nhận cũ
    public boolean updatePassword(Long userId, String currentPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) return false;

        User user = optionalUser.get();
        if (!user.getPasswordHash().equals(currentPassword)) {
            return false;
        }

        user.setPasswordHash(newPassword);
        userRepository.save(user);
        return true;
    }

    /**
     * Dùng cho coach cập nhật toàn bộ hồ sơ (cả trường chung & riêng coach)
     * Đồng bộ dữ liệu giữa bảng User & Coach.
     */
    public boolean updateCoachFullProfile(Long userId, UpdateCoachProfileRequest req) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) return false;
        User user = optionalUser.get();

        // ==== 1. Update trường chung ở User ====
        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getProfilePictureUrl() != null) user.setProfilePictureUrl(req.getProfilePictureUrl());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());
        if (req.getAddress() != null) user.setAddress(req.getAddress());
        if (req.getGender() != null) user.setGender(req.getGender());
        if (req.getHometown() != null) user.setHometown(req.getHometown());
        if (req.getOccupation() != null) user.setOccupation(req.getOccupation());
        if (req.getAge() != null) user.setAge(req.getAge());

        userRepository.save(user);

        // ==== 2. Nếu user là coach, đồng bộ trường sang Coach ====
        if ("coach".equalsIgnoreCase(user.getRole())) {
            Coach coach = coachRepository.findByUserUserId(userId);
            if (coach != null) {
                // Trường chung (sync với User)
                if (req.getFullName() != null) coach.setFullName(req.getFullName());
                if (req.getProfilePictureUrl() != null) coach.setProfilePictureUrl(req.getProfilePictureUrl());
                if (req.getPhoneNumber() != null) coach.setPhoneNumber(req.getPhoneNumber());
                if (req.getAddress() != null) coach.setAddress(req.getAddress());
                if (req.getGender() != null) coach.setGender(req.getGender());
                // Trường riêng Coach
                if (req.getSpecialization() != null) coach.setSpecialization(req.getSpecialization());
                if (req.getDegree() != null) coach.setDegree(req.getDegree());
                if (req.getExperience() != null) coach.setExperience(req.getExperience());
                if (req.getRating() != null) coach.setRating(req.getRating());
                if (req.getBio() != null) coach.setBio(req.getBio());
                if (req.getAvailability() != null) coach.setAvailability(req.getAvailability());
                coachRepository.save(coach);
            } else {
                System.out.println("Warning: Coach profile chưa được khởi tạo cho userId = " + userId);
            }
        }
        return true;
    }

    // Lấy tất cả user còn hoạt động
    public List<User> getAllActiveUsers() {
        return userRepository.findAllByEnabledTrue();
    }

    // Lấy user hoạt động theo id
    public User getActiveUserById(Long id) {
        return userRepository.findByUserIdAndEnabledTrue(id);
    }

    // Xóa mềm user (set enabled = false)
    public boolean softDeleteUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (!user.isEnabled()) return false; // Đã xóa rồi
                    user.setEnabled(false);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    // Tùy chọn: Lấy user theo username/email/role chỉ lấy enabled=true
    public User getActiveUserByUsername(String username) {
        return userRepository.findByUsernameAndEnabledTrue(username);
    }
    public User getActiveUserByEmail(String email) {
        return userRepository.findByEmailAndEnabledTrue(email);
    }
    public List<User> getActiveUsersByRole(String role) {
        return userRepository.findByRoleAndEnabledTrue(role);
    }


    //===================================
    // Lấy tất cả user đã xóa
    public List<User> getAllDeletedUsers() {
        return userRepository.findAllByEnabledFalse();
    }



    //Thông báo
    // Lấy tất cả user theo role
    public List<User> findAllByRole(String role) {
        return userRepository.findByRole(role);
    }

}
