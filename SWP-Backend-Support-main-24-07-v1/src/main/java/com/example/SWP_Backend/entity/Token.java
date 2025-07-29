package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "Token")
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // **Khóa chính tự tăng của bảng Token**

    @Column(nullable = false, unique = true)
    private String token;
    // **Chuỗi mã xác thực (OTP hoặc token reset). Luôn là duy nhất trong bảng.**
    // Ví dụ: OTP gửi về email để xác thực đăng ký/đặt lại mật khẩu, hoặc access token.

    @Column(nullable = false)
    private String email;
    // **Email liên kết với token này.**
    // Dùng để xác định tài khoản nào đang thực hiện đăng ký/reset/OTP.

    @Nationalized
    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String userInfo;
    // **Thông tin bổ sung.**
    // Nếu là OTP đăng ký: userInfo lưu JSON serialize của User (chưa xác thực).
    // Nếu là OTP reset password: userInfo lưu password mới dự kiến (chờ xác minh OTP).
    // Dùng để khôi phục/commit thông tin khi OTP được xác nhận.

    @Column(nullable = false)
    private LocalDateTime expiryDate;
    // **Thời điểm token hết hạn (ví dụ: 5–15 phút sau khi gửi).**
    // Sau thời gian này, OTP sẽ không còn hiệu lực để đảm bảo bảo mật.

    @Column(nullable = false)
    private String type;
    // **Loại token:**
    // - REGISTER_OTP: OTP xác thực đăng ký
    // - PASSWORD_RESET_OTP: OTP xác thực đổi mật khẩu
    // - Có thể mở rộng các loại khác (nếu cần)

    // ====== Getter/Setter không thay đổi ======
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUserInfo() { return userInfo; }
    public void setUserInfo(String userInfo) { this.userInfo = userInfo; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
