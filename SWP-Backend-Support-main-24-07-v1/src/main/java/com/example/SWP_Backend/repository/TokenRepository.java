package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository thao tác với bảng Token.
 * Dùng để lưu, truy vấn token xác thực email (register), token OTP cho đăng ký/đặt lại mật khẩu, v.v.
 * (Đây là bảng trung gian giúp kiểm tra mã xác thực OTP hoặc link verify cho user)
 */
public interface TokenRepository extends JpaRepository<Token, Long> {

    /**
     * Tìm token theo giá trị token string.
     * - Áp dụng cho xác minh token qua link (email verify link)
     */
    Optional<Token> findByToken(String token);

    /**
     * Tìm token theo email và loại token (type: REGISTER_OTP, PASSWORD_RESET_OTP, ...).
     * - Loại REGISTER_OTP dùng cho đăng ký
     * - Loại PASSWORD_RESET_OTP dùng cho quên mật khẩu
     * - Có thể mở rộng type nếu thêm chức năng khác (ví dụ: đổi email, đổi SĐT,...)
     */
    Optional<Token> findByEmailAndType(String email, String type);
}
