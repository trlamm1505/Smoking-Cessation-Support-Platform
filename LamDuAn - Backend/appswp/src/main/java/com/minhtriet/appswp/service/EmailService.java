package com.minhtriet.appswp.service;

import com.minhtriet.appswp.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service gửi email xác thực đăng ký tài khoản & gửi OTP quên mật khẩu.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Gửi email xác thực tài khoản (khi đăng ký) với đường link chứa token xác nhận.
     * @param user User tạm (chưa xác thực)
     * @param token Mã token xác thực
     */
    public void sendVerificationEmail(User user, String token) {
        String subject = "Xác thực tài khoản của bạn";
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;
        String content = "Xin chào " + user.getUsername() + ",\n"
                + "Vui lòng nhấn vào link dưới đây để xác thực tài khoản:\n"
                + verificationUrl;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

    /**
     * Gửi mã OTP (4 số) đặt lại mật khẩu về email user.
     * @param email Email nhận OTP
     * @param otp   Mã OTP (4 số)
     */
    public void sendPasswordResetOtpEmail(String email, String otp) {
        String subject = "Mã OTP xác nhận đổi mật khẩu";
        String content = "Xin chào,\n"
                + "Mã OTP xác nhận đổi mật khẩu của bạn là: " + otp + "\n"
                + "Mã chỉ có hiệu lực trong 10 phút.\n"
                + "Nếu không phải bạn yêu cầu, hãy bỏ qua email này.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

    // (Có thể xóa hàm cũ sendPasswordResetEmail vì không cần đường link nữa)
}
