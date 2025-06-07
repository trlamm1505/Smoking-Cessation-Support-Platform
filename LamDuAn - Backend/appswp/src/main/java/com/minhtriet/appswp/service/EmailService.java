package com.minhtriet.appswp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service chuyên gửi email xác thực tài khoản & gửi OTP xác thực (đăng ký/đặt lại mật khẩu).
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Gửi email xác thực tài khoản cho user mới đăng ký (theo link - không dùng cho OTP).
     */
    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        String subject = "Xác thực tài khoản của bạn";
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;
        String content = "Xin chào " + fullName + ",\n\n"
                + "Vui lòng nhấn vào link dưới đây để xác thực tài khoản:\n"
                + verificationUrl + "\n\n"
                + "Trân trọng,\nĐội ngũ hỗ trợ";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }

    /**
     * Gửi mã OTP (4 số) tới email người dùng để xác thực ĐĂNG KÝ (OTP đăng ký tài khoản).
     */
    public void sendOtpRegister(String toEmail, String otp) {
        String subject = "Mã OTP xác thực đăng ký tài khoản";
        String content = "Bạn vừa đăng ký tài khoản trên hệ thống.\n"
                + "Mã OTP xác thực của bạn là: " + otp + "\n"
                + "Mã này có hiệu lực trong 10 phút.\n"
                + "Nếu bạn không gửi yêu cầu đăng ký, hãy bỏ qua email này.\n\n"
                + "Trân trọng,\nĐội ngũ hỗ trợ";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }

    /**
     * Gửi mã OTP (4 số) tới email người dùng để xác thực ĐỔI MẬT KHẨU (OTP quên mật khẩu).
     */
    public void sendOtpResetPassword(String toEmail, String otp) {
        String subject = "Mã OTP xác thực đặt lại mật khẩu";
        String content = "Bạn vừa yêu cầu đổi mật khẩu tài khoản trên hệ thống.\n"
                + "Mã OTP của bạn là: " + otp + "\n"
                + "Mã này có hiệu lực trong 10 phút.\n"
                + "Nếu bạn không gửi yêu cầu này, hãy bỏ qua email.\n\n"
                + "Trân trọng,\nĐội ngũ hỗ trợ";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }
}
