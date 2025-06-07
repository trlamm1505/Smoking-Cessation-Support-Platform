package com.minhtriet.appswp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minhtriet.appswp.entity.User;
import com.minhtriet.appswp.entity.VerificationToken;
import com.minhtriet.appswp.repository.VerificationTokenRepository;
import com.minhtriet.appswp.repository.UserRepository;
import com.minhtriet.appswp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * API xác thực/đăng nhập/đăng ký/quên mật khẩu bằng OTP 4 số gửi về email.
 * - Đăng ký: Gửi OTP về email, nhập OTP xác thực mới lưu user.
 * - Quên mật khẩu: Gửi OTP về email, nhập OTP xác nhận mới đổi mật khẩu.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthAPI {

    @Autowired
    private UserService userService;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // ===================== ĐĂNG KÝ 2 BƯỚC BẰNG OTP =======================

    /**
     * BƯỚC 1: Đăng ký - Gửi OTP về email
     * Endpoint: POST /api/auth/register-request
     */
    @PostMapping("/register-request")
    public ResponseEntity<Map<String, Object>> registerRequest(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 1. Kiểm tra email đã tồn tại chưa
            if (userService.isEmailExists(request.getEmail())) {
                response.put("success", false);
                response.put("message", "Email đã được sử dụng");
                return ResponseEntity.badRequest().body(response);
            }
            // 2. Kiểm tra mật khẩu xác nhận
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                response.put("success", false);
                response.put("message", "Mật khẩu xác nhận không khớp");
                return ResponseEntity.badRequest().body(response);
            }
            // 3. Gửi OTP + lưu user tạm vào VerificationToken
            User user = new User();
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPasswordHash(request.getPassword());
            user.setUsername(request.getEmail());
            user.setRole("member");
            userService.registerUserWithOtp(user); // Sửa lại hàm BE, flow dùng OTP

            response.put("success", true);
            response.put("message", "OTP đã được gửi về email. Vui lòng kiểm tra email để xác thực!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Đăng ký thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * BƯỚC 2: Xác nhận OTP để hoàn tất đăng ký (tạo user thật)
     * Endpoint: POST /api/auth/register-verify-otp
     */
    @PostMapping("/register-verify-otp")
    public ResponseEntity<Map<String, Object>> verifyRegisterOtp(@RequestBody VerifyOtpRequest request) {
        Map<String, Object> response = new HashMap<>();
        boolean ok = userService.verifyOtpAndRegister(request.getEmail(), request.getOtp());
        if (ok) {
            response.put("success", true);
            response.put("message", "Đăng ký thành công! Bạn đã có thể đăng nhập.");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "OTP không đúng hoặc đã hết hạn!");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ===================== ĐĂNG NHẬP =======================

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.getUserByEmail(request.getEmail());
            if (user == null) {
                response.put("success", false);
                response.put("message", "Email không tồn tại");
                return ResponseEntity.badRequest().body(response);
            }
            if (!user.isEnabled()) {
                response.put("success", false);
                response.put("message", "Tài khoản chưa xác thực hoặc chưa hoàn tất đăng ký OTP!");
                return ResponseEntity.badRequest().body(response);
            }
            if (!user.getPasswordHash().equals(request.getPassword())) {
                response.put("success", false);
                response.put("message", "Mật khẩu không đúng");
                return ResponseEntity.badRequest().body(response);
            }
            userService.updateLastLoginDate(user.getUserId());

            response.put("success", true);
            response.put("message", "Đăng nhập thành công");
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
            response.put("message", "Đăng nhập thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ===================== QUÊN MẬT KHẨU 2 BƯỚC (OTP) =======================

    /**
     * BƯỚC 1: Gửi OTP xác nhận đổi mật khẩu về email
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordOtpRequest req) {
        userService.sendPasswordResetOtp(req.getEmail(), req.getNewPassword());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Nếu email hợp lệ, mã OTP đã được gửi về email. Hãy kiểm tra hộp thư!"
        ));
    }

    /**
     * BƯỚC 2: Nhập OTP để đổi mật khẩu
     */
    @PostMapping("/reset-password-otp")
    public ResponseEntity<Map<String, Object>> resetPasswordOtp(@RequestBody VerifyOtpRequest req) {
        boolean ok = userService.verifyOtpAndResetPassword(req.getEmail(), req.getOtp());
        if (ok) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Đổi mật khẩu thành công!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "OTP không đúng hoặc đã hết hạn!"));
        }
    }

    // =================== DTO ====================

    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String password;
        private String confirmPassword;
        public RegisterRequest() {}
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
        public LoginRequest() {}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class ForgotPasswordOtpRequest {
        private String email;
        private String newPassword;
        public ForgotPasswordOtpRequest() {}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class VerifyOtpRequest {
        private String email;
        private String otp;
        public VerifyOtpRequest() {}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }
}
