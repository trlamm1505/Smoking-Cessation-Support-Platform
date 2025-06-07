package com.minhtriet.appswp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity dùng để lưu tạm thông tin đăng ký user (chưa xác thực).
 * Khi xác thực thành công mới tạo user trong DB.
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

    @Column(nullable = false, unique = true)
    private String token; // Mã xác thực duy nhất

    @Column(nullable = false)
    private String email; // Email người đăng ký

    @Column(columnDefinition = "TEXT", nullable = false)
    private String userInfo; // Lưu thông tin user dạng JSON

    @Column(nullable = false)
    private LocalDateTime expiryDate; // Thời gian hết hạn token

    // Không còn @OneToOne với User nữa vì user chưa có trong DB
}
