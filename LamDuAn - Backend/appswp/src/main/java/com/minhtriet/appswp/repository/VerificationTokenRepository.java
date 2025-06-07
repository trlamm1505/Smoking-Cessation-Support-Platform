package com.minhtriet.appswp.repository;

import com.minhtriet.appswp.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository thao tác với bảng VerificationToken.
 * - Dùng cho cả xác thực email (register) & quên mật khẩu OTP.
 */
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    // Tìm token xác thực email (loại EMAIL_VERIFICATION)
    Optional<VerificationToken> findByToken(String token);

    // Tìm OTP quên mật khẩu (loại PASSWORD_RESET)
    Optional<VerificationToken> findByEmailAndOtpAndType(String email, String otp, String type);

    // Tìm token hiện tại (ví dụ, tìm để xóa token cũ trước khi tạo mới)
    Optional<VerificationToken> findByEmailAndType(String email, String type);
}
