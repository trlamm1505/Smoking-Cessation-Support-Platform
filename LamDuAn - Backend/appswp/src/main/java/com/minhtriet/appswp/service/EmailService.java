package com.minhtriet.appswp.service;

import com.minhtriet.appswp.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service gửi email xác thực đăng ký tài khoản.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Gửi email xác thực tài khoản cho user với đường link chứa token xác nhận.
     * @param user User tạm (chưa xác thực)
     * @param token Mã token xác thực
     */
    public void sendVerificationEmail(User user, String token) {
        String subject = "Xác thực tài khoản của bạn";
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;
        String content = "Xin chào " + user.getUsername() + ",\n"
                + "Vui lòng nhấn vào link dưới đây để xác thực tài khoản:\n"
                + verificationUrl;

        // Tạo email text (nếu muốn gửi HTML thì dùng MimeMessageHelper)
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(User user, String token) {
        String subject = "Đặt lại mật khẩu tài khoản của bạn";
        String resetUrl = "http://localhost:8080/api/auth/reset-password?token=" + token;
        String content = "Xin chào " + user.getUsername() + ",\n"
                + "Vui lòng nhấn vào link dưới đây để đặt lại mật khẩu (hạn dùng 1 giờ):\n"
                + resetUrl;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

}
