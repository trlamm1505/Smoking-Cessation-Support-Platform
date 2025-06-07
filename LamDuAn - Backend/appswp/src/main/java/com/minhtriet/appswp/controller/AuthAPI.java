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

    // ===== ĐĂNG KÝ có gửi mail xác thực =====
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Kiểm tra email đã tồn tại chưa
            if (userService.isEmailExists(request.getEmail())) {
                response.put("success", false);
                response.put("message", "Email đã được sử dụng");
                return ResponseEntity.badRequest().body(response);
            }

            // Kiểm tra mật khẩu xác nhận
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                response.put("success", false);
                response.put("message", "Mật khẩu xác nhận không khớp");
                return ResponseEntity.badRequest().body(response);
            }

            // Tạo user mới với enabled=false (chưa xác thực)
            User newUser = new User();
            newUser.setFullName(request.getFullName());
            newUser.setEmail(request.getEmail());
            newUser.setPasswordHash(request.getPassword()); // Nên hash!
            newUser.setUsername(request.getEmail());
            newUser.setRole("member");

            // Gửi mail xác thực, lưu user tạm vào VerificationToken
            userService.registerUserWithVerification(newUser);

            response.put("success", true);
            response.put("message", "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Đăng ký thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ======= Xác thực tài khoản qua email =======
    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyUser(@RequestParam("token") String token) {
        Map<String, Object> response = new HashMap<>();

        Optional<VerificationToken> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Token không hợp lệ hoặc đã được xác thực!");
            return ResponseEntity.badRequest().body(response);
        }

        VerificationToken verificationToken = tokenOpt.get();

        // Kiểm tra token hết hạn
        if (verificationToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            tokenRepository.delete(verificationToken);
            response.put("success", false);
            response.put("message", "Token đã hết hạn!");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Deserialize user từ userInfo (JSON)
            User user = objectMapper.readValue(verificationToken.getUserInfo(), User.class);

            // Kiểm tra lại email đã tồn tại chưa (phòng double click hoặc tấn công)
            if (userRepository.existsByEmail(user.getEmail())) {
                response.put("success", false);
                response.put("message", "Tài khoản này đã được xác thực trước đó!");
                tokenRepository.delete(verificationToken); // Xóa luôn token thừa
                return ResponseEntity.badRequest().body(response);
            }

            user.setEnabled(true); // Đánh dấu đã xác thực
            userRepository.save(user); // Lưu user vào DB

            tokenRepository.delete(verificationToken); // Xóa token

            response.put("success", true);
            response.put("message", "Xác thực tài khoản thành công! Bạn đã có thể đăng nhập.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Xác thực thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ========== Đăng nhập ==========
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

            // Chỉ cho login khi đã xác thực
            if (!user.isEnabled()) {
                response.put("success", false);
                response.put("message", "Tài khoản chưa được xác thực qua email!");
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

    // ======= DTO cho request đăng ký =======
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

    // ======= DTO cho request đăng nhập =======
    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
