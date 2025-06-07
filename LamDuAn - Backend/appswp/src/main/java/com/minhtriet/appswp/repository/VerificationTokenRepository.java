package com.minhtriet.appswp.repository;

import com.minhtriet.appswp.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository thao tác với bảng VerificationToken (token xác thực email).
 */
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    // Tìm token xác thực, trả về Optional (xử lý null an toàn hơn)
    Optional<VerificationToken> findByToken(String token);
}
