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
 * Controller xử lý các thao tác xác thực người dùng như đăng ký, đăng nhập,
 * gửi và xác minh mã OTP cho đăng ký và đặt lại mật khẩu.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Thêm NotificationService để gửi thông báo
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private GoogleAuthService googleAuthService;


    // ======== Đăng ký tài khoản sử dụng OTP xác minh ========

    /**
     * Gửi mã OTP tới email người dùng để bắt đầu quá trình đăng ký.
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

        // Xác thực token Google
        var payload = googleAuthService.verifyGoogleToken(idTokenString);
        if (payload == null) {
            response.put("success", false);
            response.put("message", "idToken không hợp lệ!");
            return ResponseEntity.badRequest().body(response);
        }

        String email = payload.getEmail();
        String fullName = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        User user = userService.getUserByEmail(email);
        boolean isNew = false;
        if (user == null) {
            // User mới, tạo tài khoản luôn (đã xác thực)
            user = new User();
            user.setEmail(email);
            user.setFullName(fullName != null ? fullName : email);
            user.setUsername(email);
            user.setProfilePictureUrl(picture);
            user.setEnabled(true);
            user.setRole("guest"); // Hoặc member tùy business logic
            user = userRepository.save(user);
            isNew = true;

            // Gửi thông báo cho user mới & admin
            NotificationRequestDTO userNoti = new NotificationRequestDTO();
            userNoti.setTitle("Đăng ký thành công");
            userNoti.setContent("Bạn đã đăng ký tài khoản Google thành công! Chào mừng bạn đến với nền tảng.");
            userNoti.setSenderId(3L); // ID hệ thống/admin
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
            // Đã có user, cập nhật ảnh nếu có
            if (picture != null && !picture.equals(user.getProfilePictureUrl())) {
                user.setProfilePictureUrl(picture);
                userRepository.save(user);
            }
        }

        // Đồng bộ phân quyền như login truyền thống
        LocalDate today = LocalDate.now();
        String currentRole = user.getRole();
        if ("admin".equalsIgnoreCase(currentRole) || "coach".equalsIgnoreCase(currentRole)) {
            // KHÔNG can thiệp
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

        // Lưu vào session
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


    @PostMapping("/register-request")
    public ResponseEntity<Map<String, Object>> requestRegistration(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (userService.isEmailExists(request.getEmail())) {
                response.put("success", false);
                response.put("message", "Email đã tồn tại trong hệ thống.");
                return ResponseEntity.badRequest().body(response);
            }

            if (!request.getPassword().equals(request.getConfirmPassword())) {
                response.put("success", false);
                response.put("message", "Mật khẩu xác nhận không trùng khớp.");
                return ResponseEntity.badRequest().body(response);
            }

            User tempUser = new User();
            tempUser.setFullName(request.getFullName());
            tempUser.setEmail(request.getEmail());
            tempUser.setPasswordHash(request.getPassword());
            tempUser.setUsername(request.getEmail());
            // Chú ý: role sẽ set là guest ở service nếu không truyền

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
     * Xác minh mã OTP để hoàn tất đăng ký tài khoản.
     * GỬI THÔNG BÁO cho user mới và admin khi đăng ký thành công.
     */
    @PostMapping("/register-verify-otp")
    public ResponseEntity<Map<String, Object>> confirmRegistrationOtp(@RequestBody VerifyOtpRequest request) {
        Map<String, Object> response = new HashMap<>();
        boolean verified = userService.verifyOtpAndRegister(request.getEmail(), request.getOtp());

        if (verified) {
            // ======== GỬI THÔNG BÁO CHO USER MỚI & ADMIN ========
            User user = userService.getUserByEmail(request.getEmail());
            if (user != null) {
                // 1. Thông báo cho user mới
                NotificationRequestDTO userNoti = new NotificationRequestDTO();
                userNoti.setTitle("Đăng ký thành công");
                userNoti.setContent("Bạn đã đăng ký tài khoản thành công! Chào mừng bạn đến với nền tảng.");
                userNoti.setSenderId(3L); // ID hệ thống hoặc admin, cập nhật nếu khác
                userNoti.setRecipientId(user.getUserId());
                userNoti.setType("register");
                notificationService.sendNotification(userNoti);

                // 2. Thông báo cho admin (gửi theo role)
                NotificationRequestDTO adminNoti = new NotificationRequestDTO();
                adminNoti.setTitle("Thành viên mới đăng ký");
                adminNoti.setContent("Người dùng " + user.getFullName() + " (" + user.getEmail() + ") vừa đăng ký tài khoản.");
                adminNoti.setSenderId(3L); // ID hệ thống hoặc admin
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

    // ======== Xác thực đăng nhập ========

    /**
     * Đăng nhập, đồng bộ role cho member/guest, KHÔNG thay đổi role admin/coach.
     * - Member hết hạn: về guest
     * - Guest còn hạn: thành member
     * - Admin/Coach: không can thiệp role
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

            // ================= XỬ LÝ PHÂN QUYỀN ĐÚNG LOGIC =================
            LocalDate today = LocalDate.now();
            String currentRole = user.getRole();

            if ("admin".equalsIgnoreCase(currentRole) || "coach".equalsIgnoreCase(currentRole)) {
                // KHÔNG can thiệp role của admin/coach
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

            // ==========> Lưu userId & role vào session <=========
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


    // ======== Đặt lại mật khẩu bằng OTP ========

    /**
     * Gửi mã OTP đặt lại mật khẩu tới email người dùng.
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
     * Xác minh mã OTP để đặt lại mật khẩu mới.
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

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã đăng xuất!"
        ));
    }




    // ======== DTO nội bộ ========

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

    public static class LoginRequest {
        private String email;
        private String password;
        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class ForgotPasswordOtpRequest {
        private String email;
        private String newPassword;
        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

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
