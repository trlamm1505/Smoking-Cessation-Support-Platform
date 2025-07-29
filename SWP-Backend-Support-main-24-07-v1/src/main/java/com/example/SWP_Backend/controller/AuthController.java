package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.TokenRepository;
import com.example.SWP_Backend.repository.UserRepository;
import com.example.SWP_Backend.service.GoogleAuthService;
import com.example.SWP_Backend.service.NotificationService;
import com.example.SWP_Backend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * CONTROLLER xử lý các API xác thực (authentication) của người dùng, bao gồm:
 * - Đăng ký (Register) bằng email/OTP hoặc Google
 * - Xác minh OTP
 * - Đăng nhập (Login)
 * - Đặt lại/quên mật khẩu (Forgot Password/Reset)
 * - Lấy thông tin người dùng hiện tại
 * - Đăng xuất
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;  // Service chính cho business logic về User

    @Autowired
    private TokenRepository tokenRepository; // Quản lý các token tạm (OTP, reset...)

    @Autowired
    private UserRepository userRepository; // Làm việc với bảng User

    @Autowired
    private ObjectMapper objectMapper; // Dùng để convert object -> JSON nếu cần

    @Autowired
    private NotificationService notificationService; // Gửi thông báo sau khi đăng ký, đặt lại mật khẩu...

    @Autowired
    private GoogleAuthService googleAuthService; // Dịch vụ xác thực Google

    // ============================================================================
    // ĐĂNG KÝ/ĐĂNG NHẬP GOOGLE
    // ============================================================================

    /**
     * API cho phép người dùng đăng nhập hoặc đăng ký bằng Google OAuth (Google Login).
     * Nếu user mới → tạo tài khoản + gửi thông báo chào mừng.
     * Nếu user đã có → cập nhật ảnh đại diện (nếu đổi).
     * Luôn đồng bộ phân quyền (member hết hạn về guest, guest còn hạn lên member).
     */
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body, HttpSession session) {
        String idTokenString = body.get("idToken");
        Map<String, Object> response = new HashMap<>();
        if (idTokenString == null) {
            response.put("success", false);
            response.put("message", "Thiếu idToken từ Google");
            return ResponseEntity.badRequest().body(response);
        }

        // 1. Xác thực token Google hợp lệ hay không
        var payload = googleAuthService.verifyGoogleToken(idTokenString);
        if (payload == null) {
            response.put("success", false);
            response.put("message", "idToken không hợp lệ!");
            return ResponseEntity.badRequest().body(response);
        }

        // 2. Lấy thông tin user từ Google
        String email = payload.getEmail();
        String fullName = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        User user = userService.getUserByEmail(email);
        boolean isNew = false;
        if (user == null) {
            // 3. Nếu chưa có user, tạo mới (tự động xác thực email)
            user = new User();
            user.setEmail(email);
            user.setFullName(fullName != null ? fullName : email);
            user.setUsername(email);
            user.setProfilePictureUrl(picture);
            user.setEnabled(true); // Đã xác thực
            user.setRole("guest"); // Ban đầu là guest
            user = userRepository.save(user);
            isNew = true;

            // 4. Gửi thông báo cho user và admin
            NotificationRequestDTO userNoti = new NotificationRequestDTO();
            userNoti.setTitle("Đăng ký thành công");
            userNoti.setContent("Bạn đã đăng ký tài khoản Google thành công! Chào mừng bạn đến với nền tảng.");
            userNoti.setSenderId(3L); // 3L: ID của hệ thống hoặc admin
            userNoti.setRecipientId(user.getUserId());
            userNoti.setType("register");
            notificationService.sendNotification(userNoti);

            NotificationRequestDTO adminNoti = new NotificationRequestDTO();
            adminNoti.setTitle("Thành viên mới đăng ký (Google)");
            adminNoti.setContent("Người dùng " + user.getFullName() + " (" + user.getEmail() + ") vừa đăng ký qua Google.");
            adminNoti.setSenderId(3L);
            adminNoti.setTargetRole("admin");
            adminNoti.setType("register");
            notificationService.sendNotification(adminNoti);
        } else {
            // 5. Nếu đã có user, chỉ cập nhật avatar nếu đổi
            if (picture != null && !picture.equals(user.getProfilePictureUrl())) {
                user.setProfilePictureUrl(picture);
                userRepository.save(user);
            }
        }

        // 6. Luôn đồng bộ lại vai trò (role) dựa theo gói dịch vụ
        LocalDate today = LocalDate.now();
        String currentRole = user.getRole();
        if ("admin".equalsIgnoreCase(currentRole) || "coach".equalsIgnoreCase(currentRole)) {
            // Không can thiệp
        } else if ("member".equalsIgnoreCase(currentRole)) {
            if (user.getSubscriptionEndDate() == null || user.getSubscriptionEndDate().isBefore(today)) {
                user.setRole("guest");
                user.setCurrentMembershipPackageId(null);
                userRepository.save(user);
            }
        } else if ("guest".equalsIgnoreCase(currentRole)) {
            if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isAfter(today.minusDays(1))) {
                user.setRole("member");
                userRepository.save(user);
            }
        }

        // 7. Lưu userId và role vào session để nhận diện user ở các request sau
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("role", user.getRole());

        response.put("success", true);
        response.put("message", isNew ? "Đăng ký/đăng nhập Google thành công!" : "Đăng nhập Google thành công!");
        response.put("user", Map.of(
                "id", user.getUserId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "profilePictureUrl", user.getProfilePictureUrl() != null ? user.getProfilePictureUrl() : ""
        ));
        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // ĐĂNG KÝ BẰNG EMAIL + OTP
    // ============================================================================

    /**
     * Bước 1: Yêu cầu đăng ký – Hệ thống gửi OTP về email, user nhập OTP để xác minh
     * Nếu hợp lệ mới tạo tài khoản.
     */
    @PostMapping("/register-request")
    public ResponseEntity<Map<String, Object>> requestRegistration(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Kiểm tra email đã tồn tại hay chưa
            if (userService.isEmailExists(request.getEmail())) {
                response.put("success", false);
                response.put("message", "Email đã tồn tại trong hệ thống.");
                return ResponseEntity.badRequest().body(response);
            }

            // Kiểm tra xác nhận mật khẩu
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                response.put("success", false);
                response.put("message", "Mật khẩu xác nhận không trùng khớp.");
                return ResponseEntity.badRequest().body(response);
            }

            // Tạo user tạm thời (chưa active), gửi OTP xác thực qua email
            User tempUser = new User();
            tempUser.setFullName(request.getFullName());
            tempUser.setEmail(request.getEmail());
            tempUser.setPasswordHash(request.getPassword());
            tempUser.setUsername(request.getEmail());
            // Role sẽ set ở service (thường là guest)
            userService.registerUserWithOtp(tempUser);

            response.put("success", true);
            response.put("message", "OTP đã được gửi đến email của bạn. Hãy xác minh để hoàn tất đăng ký.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Đã xảy ra lỗi trong quá trình đăng ký: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Bước 2: Xác minh OTP để hoàn tất đăng ký tài khoản.
     * Nếu đúng OTP → Kích hoạt tài khoản, gửi thông báo chào mừng cho user và admin.
     */
    @PostMapping("/register-verify-otp")
    public ResponseEntity<Map<String, Object>> confirmRegistrationOtp(@RequestBody VerifyOtpRequest request) {
        Map<String, Object> response = new HashMap<>();
        boolean verified = userService.verifyOtpAndRegister(request.getEmail(), request.getOtp());

        if (verified) {
            // Nếu xác minh OTP thành công → lấy user và gửi thông báo chào mừng
            User user = userService.getUserByEmail(request.getEmail());
            if (user != null) {
                // 1. Thông báo cho user mới
                NotificationRequestDTO userNoti = new NotificationRequestDTO();
                userNoti.setTitle("Đăng ký thành công");
                userNoti.setContent("Bạn đã đăng ký tài khoản thành công! Chào mừng bạn đến với nền tảng.");
                userNoti.setSenderId(3L);
                userNoti.setRecipientId(user.getUserId());
                userNoti.setType("register");
                notificationService.sendNotification(userNoti);

                // 2. Thông báo cho admin (role admin)
                NotificationRequestDTO adminNoti = new NotificationRequestDTO();
                adminNoti.setTitle("Thành viên mới đăng ký");
                adminNoti.setContent("Người dùng " + user.getFullName() + " (" + user.getEmail() + ") vừa đăng ký tài khoản.");
                adminNoti.setSenderId(3L);
                adminNoti.setTargetRole("admin");
                adminNoti.setType("register");
                notificationService.sendNotification(adminNoti);
            }
            response.put("success", true);
            response.put("message", "Đăng ký thành công. Bạn đã có thể đăng nhập.");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Mã OTP không hợp lệ hoặc đã hết hạn.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ============================================================================
    // ĐĂNG NHẬP (LOGIN)
    // ============================================================================

    /**
     * Đăng nhập truyền thống bằng email + password. Đồng bộ lại role cho member/guest
     * Không thay đổi vai trò admin/coach.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authenticate(@RequestBody LoginRequest request, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.getUserByEmail(request.getEmail());

            if (user == null) {
                response.put("success", false);
                response.put("message", "Không tìm thấy tài khoản với email này.");
                return ResponseEntity.badRequest().body(response);
            }

            if (!user.isEnabled()) {
                response.put("success", false);
                response.put("message", "Tài khoản chưa được xác minh hoặc chưa hoàn tất đăng ký.");
                return ResponseEntity.badRequest().body(response);
            }

            if (!user.getPasswordHash().equals(request.getPassword())) {
                response.put("success", false);
                response.put("message", "Sai mật khẩu.");
                return ResponseEntity.badRequest().body(response);
            }

            // Cập nhật ngày đăng nhập gần nhất
            userService.updateLastLoginDate(user.getUserId());

            // Phân quyền lại nếu role là member/guest (dựa trên thời hạn gói dịch vụ)
            LocalDate today = LocalDate.now();
            String currentRole = user.getRole();
            if ("admin".equalsIgnoreCase(currentRole) || "coach".equalsIgnoreCase(currentRole)) {
                // Không can thiệp
            } else if ("member".equalsIgnoreCase(currentRole)) {
                if (user.getSubscriptionEndDate() == null || user.getSubscriptionEndDate().isBefore(today)) {
                    user.setRole("guest");
                    user.setCurrentMembershipPackageId(null);
                    userRepository.save(user);
                }
            } else if ("guest".equalsIgnoreCase(currentRole)) {
                if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isAfter(today.minusDays(1))) {
                    user.setRole("member");
                    userRepository.save(user);
                }
            }

            // Lưu thông tin đăng nhập vào session
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("role", user.getRole());

            response.put("success", true);
            response.put("message", "Đăng nhập thành công.");
            response.put("user", Map.of(
                    "id", user.getUserId(),
                    "fullName", user.getFullName(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "profilePictureUrl", user.getProfilePictureUrl() != null ? user.getProfilePictureUrl() : ""
            ));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi trong quá trình đăng nhập: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ============================================================================
    // QUÊN MẬT KHẨU/ĐẶT LẠI MẬT KHẨU (FORGOT/RESET PASSWORD)
    // ============================================================================

    /**
     * Bước 1: Yêu cầu đặt lại mật khẩu – gửi OTP về email người dùng.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> requestPasswordReset(@RequestBody ForgotPasswordOtpRequest req) {
        userService.sendPasswordResetOtp(req.getEmail(), req.getNewPassword());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Nếu email hợp lệ, mã OTP đã được gửi đến hòm thư của bạn."
        ));
    }

    /**
     * Bước 2: Xác minh OTP để cập nhật mật khẩu mới cho tài khoản.
     */
    @PostMapping("/reset-password-otp")
    public ResponseEntity<Map<String, Object>> confirmPasswordReset(@RequestBody VerifyOtpRequest req) {
        boolean success = userService.verifyOtpAndResetPassword(req.getEmail(), req.getOtp());
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Mật khẩu đã được cập nhật thành công."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "OTP không hợp lệ hoặc đã hết hạn."));
        }
    }

    // ============================================================================
    // LẤY THÔNG TIN NGƯỜI DÙNG ĐANG ĐĂNG NHẬP & ĐĂNG XUẤT
    // ============================================================================

    /**
     * API lấy thông tin user hiện tại đang đăng nhập từ session.
     * Trả về info user nếu đăng nhập, ngược lại trả về lỗi chưa đăng nhập.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Object userId = session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Bạn chưa đăng nhập!"
            ));
        }
        User user = userService.getUserById((Long) userId);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Không tìm thấy user!"
            ));
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "user", Map.of(
                        "id", user.getUserId(),
                        "fullName", user.getFullName(),
                        "email", user.getEmail(),
                        "role", user.getRole(),
                        "profilePictureUrl", user.getProfilePictureUrl() != null ? user.getProfilePictureUrl() : ""
                )
        ));
    }

    /**
     * Đăng xuất, xóa thông tin user khỏi session.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã đăng xuất!"
        ));
    }

    // ============================================================================
    // DTO NỘI BỘ ĐỂ NHẬN DỮ LIỆU TỪ REQUEST BODY
    // ============================================================================

    // DTO cho đăng ký
    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String password;
        private String confirmPassword;
        // Getters and setters
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getConfirmPassword() { return confirmPassword; }
        public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
    }

    // DTO cho đăng nhập
    public static class LoginRequest {
        private String email;
        private String password;
        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // DTO cho quên mật khẩu – gửi OTP
    public static class ForgotPasswordOtpRequest {
        private String email;
        private String newPassword;
        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    // DTO cho xác thực OTP (đăng ký và đặt lại mật khẩu)
    public static class VerifyOtpRequest {
        private String email;
        private String otp;
        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }
}
