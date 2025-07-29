package com.example.SWP_Backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Service chuyên gửi email xác thực tài khoản & mã OTP (đăng ký, đặt lại mật khẩu).
 * - Tích hợp với Spring JavaMail để gửi email (SMTP)
 * - Gửi được cả email HTML, hỗ trợ gửi OTP hoặc link xác minh.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender; // Bean gửi email SMTP (cấu hình trong application.properties)

    /**
     * Gửi email xác thực tài khoản bằng liên kết (verify token) sau khi đăng ký.
     * (Không dùng OTP, dùng link kèm token)
     */
    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        String subject = "Xác nhận đăng ký tài khoản";
        // Tạo URL xác thực kèm token gửi về backend để kích hoạt tài khoản
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;

        String content = "<p>Kính gửi <strong>" + fullName + "</strong>,</p>"
                + "<p>Cảm ơn bạn đã đăng ký tài khoản với chúng tôi.</p>"
                + "<p>Vui lòng nhấn vào liên kết bên dưới để xác minh địa chỉ email và kích hoạt tài khoản:</p>"
                + "<p><a href=\"" + verificationUrl + "\">Xác minh tài khoản</a></p>"
                + "<br><p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>"
                + "<p>Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>";

        sendHtmlEmail(toEmail, subject, content); // Gửi HTML
    }

    /**
     * Gửi mã OTP xác thực đăng ký tài khoản (user đăng ký xong nhập OTP để hoàn tất).
     * - OTP được sinh ra ở backend và lưu vào Token DB
     * - Thường có hiệu lực trong 10 phút
     */
    public void sendOtpRegister(String toEmail, String otp) {
        String subject = "Mã xác thực (OTP) đăng ký tài khoản";

        String content = "<p>Xin chào,</p>"
                + "<p>Bạn vừa đăng ký tài khoản trên hệ thống.</p>"
                + "<p><strong>Mã OTP của bạn là: <span style='color:blue; font-size: 18px;'>" + otp + "</span></strong></p>"
                + "<p>Mã có hiệu lực trong vòng <strong>10 phút</strong>.</p>"
                + "<p>Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.</p>"
                + "<p>Trân trọng,<br>Đội ngũ chăm sóc khách hàng</p>";

        sendHtmlEmail(toEmail, subject, content); // Gửi HTML
    }

    /**
     * Gửi mã OTP đặt lại mật khẩu (user quên mật khẩu, nhận OTP để đổi password mới).
     * - OTP này cũng chỉ có hiệu lực trong 10 phút
     */
    public void sendOtpResetPassword(String toEmail, String otp) {
        String subject = "Mã xác thực (OTP) đặt lại mật khẩu";

        String content = "<p>Xin chào,</p>"
                + "<p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>"
                + "<p><strong>Mã OTP của bạn là: <span style='color:blue; font-size: 18px;'>" + otp + "</span></strong></p>"
                + "<p>Mã có hiệu lực trong vòng <strong>10 phút</strong>.</p>"
                + "<p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>"
                + "<p>Trân trọng,<br>Đội ngũ chăm sóc khách hàng</p>";

        sendHtmlEmail(toEmail, subject, content); // Gửi HTML
    }

    /**
     * Hàm dùng chung để gửi email dạng HTML (được gọi nội bộ).
     * - Tạo email message (JavaMail)
     * - Thiết lập người nhận, tiêu đề, nội dung HTML
     * - Gửi qua SMTP
     */
    private void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

            helper.setTo(toEmail);             // Người nhận
            helper.setSubject(subject);        // Tiêu đề
            helper.setText(htmlContent, true); // Nội dung HTML

            mailSender.send(message); // Gửi email
        } catch (MessagingException e) {
            // Ném lỗi runtime để báo cho service gọi biết gửi mail lỗi
            throw new RuntimeException("Lỗi khi gửi email: " + e.getMessage(), e);
        }
    }
}
