package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) throws MessagingException {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("TravelMate – Reset Your Password");
        helper.setText(buildEmailBody(resetLink), true);

        mailSender.send(message);
    }

    private String buildEmailBody(String resetLink) {
        return "<div style=\"font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; background: #f9f9f9;\">"
                + "<div style=\"background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);\">"
                + "<h2 style=\"margin: 0 0 8px; font-size: 24px; color: #111;\">Reset your password</h2>"
                + "<p style=\"color: #555; margin: 0 0 28px;\">We received a request to reset your TravelMate password. Click the button below — this link expires in <strong>15 minutes</strong>.</p>"
                + "<a href=\"" + resetLink
                + "\" style=\"display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00c9a7, #00ffcc); color: #fff; font-weight: 700; border-radius: 8px; text-decoration: none; font-size: 15px;\">Reset Password</a>"
                + "<p style=\"margin: 28px 0 0; font-size: 13px; color: #999;\">If you didn't request this, you can safely ignore this email. Your password won't change.</p>"
                + "</div>"
                + "</div>";
    }
}
