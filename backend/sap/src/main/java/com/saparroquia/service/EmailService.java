package com.saparroquia.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendRecoveryEmail(String to, String recoveryToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Recuperación de Contraseña - Parroquia San Agustín");

            Context context = new Context();
            context.setVariable("recoveryToken", recoveryToken);
            String htmlContent = templateEngine.process("email/recovery-password", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email de recuperación enviado a: {}", to);
        } catch (Exception e) {
            log.error("Error enviando email de recuperación a {}: {}", to, e.getMessage());
        }
    }

    public void sendVerificationEmail(String to, String verificationLink, String nombre) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Verifica tu correo - Parroquia San Agustín");

            Context context = new Context();
            context.setVariable("verificationLink", verificationLink);
            context.setVariable("nombre", nombre);

            String htmlContent = templateEngine.process("email/verify-account", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email de verificación enviado a: {}", to);
        } catch (Exception e) {
            log.error("Error enviando email de verificación a {}: {}", to, e.getMessage());
        }
    }
}
