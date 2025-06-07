package com.minhtriet.appswp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity dùng để lưu tạm thông tin xác thực (đăng ký hoặc quên mật khẩu).
 * - Khi đăng ký: lưu info user (JSON), gửi email xác thực.
 * - Khi quên mật khẩu: lưu OTP, mật khẩu mới, gửi email OTP.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, unique = true)
    private String token; // Dùng cho xác thực email (có thể null với OTP quên mật khẩu)

    @Column(nullable = false)
    private String email; // Email người dùng liên quan đến token (cả đăng ký và quên mật khẩu)

    @Column(columnDefinition = "TEXT")
    private String userInfo; // Lưu thông tin user dạng JSON khi ĐĂNG KÝ (nullable nếu là quên mật khẩu)

    @Column
    private String otp; // Lưu mã OTP 4 số cho quên mật khẩu (nullable nếu là xác thực email)

    @Column
    private String newPasswordHash; // Lưu tạm mật khẩu mới cho quên mật khẩu (nullable)

    @Column(nullable = false)
    private LocalDateTime expiryDate; // Thời gian hết hạn token hoặc OTP

    @Column(nullable = false)
    private String type; // Loại: "EMAIL_VERIFICATION" (xác thực mail) hoặc "PASSWORD_RESET" (OTP quên mật khẩu)
}
