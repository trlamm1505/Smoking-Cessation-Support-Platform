package com.minhtriet.appswp.repository;

import com.minhtriet.appswp.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository thao tác với bảng VerificationToken (dùng cho xác thực email ĐĂNG KÝ hoặc OTP QUÊN MẬT KHẨU).
 */
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    /**
     * Tìm token xác thực bằng chuỗi token (dùng cho xác thực email, hoặc các loại token khác).
     * @param token Mã token
     * @return Optional<VerificationToken>
     */
    Optional<VerificationToken> findByToken(String token);

    /**
     * Tìm VerificationToken theo email + loại token (type).
     * - Dùng cho xác thực OTP đặt lại mật khẩu (type = "PASSWORD_RESET_OTP")
     * - Nếu muốn mở rộng xác thực khác, cũng có thể dùng trường type này.
     * @param email Email cần xác thực
     * @param type  Loại token ("EMAIL_VERIFICATION" hoặc "PASSWORD_RESET_OTP")
     * @return Optional<VerificationToken>
     */
    Optional<VerificationToken> findByEmailAndType(String email, String type);
}
