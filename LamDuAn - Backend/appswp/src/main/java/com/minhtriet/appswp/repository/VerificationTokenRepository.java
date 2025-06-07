package com.minhtriet.appswp.repository;

import com.minhtriet.appswp.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository thao tác với bảng VerificationToken (token xác thực email hoặc OTP).
 */
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    // Tìm token xác thực bằng mã token
    Optional<VerificationToken> findByToken(String token);

    // === Thêm hàm tìm OTP cho đặt lại mật khẩu ===
    Optional<VerificationToken> findByEmailAndType(String email, String type);
}
