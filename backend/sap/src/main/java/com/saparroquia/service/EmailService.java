package com.saparroquia.service;

import com.saparroquia.config.BrevoProperties;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final BrevoProperties brevoProperties;
    private final WebClient brevoWebClient;

    private static final String BREVO_API_URL = "/smtp/email";

    public void sendRecoveryEmail(String to, String recoveryToken) {
        Context context = new Context();
        context.setVariable("recoveryToken", recoveryToken);
        String htmlContent = templateEngine.process("email/recovery-password", context);

        sendEmail(to,
                "Recuperación de Contraseña - Parroquia San Agustín",
                htmlContent);
    }

    public void sendVerificationEmail(String to, String verificationLink, String nombre) {
        Context context = new Context();
        context.setVariable("verificationLink", verificationLink);
        context.setVariable("nombre", nombre);

        String htmlContent = templateEngine.process("email/verify-account", context);

        sendEmail(to,
                "Verifica tu correo - Parroquia San Agustín",
                htmlContent);
    }

    private void sendEmail(String to, String subject, String htmlContent) {
        if (StringUtils.hasText(brevoProperties.getApiKey())) {
            sendViaBrevoApi(to, subject, htmlContent);
        } else {
            sendViaSmtp(to, subject, htmlContent);
        }
    }

    private void sendViaBrevoApi(String to, String subject, String htmlContent) {
        try {
            brevoWebClient.post()
                    .uri(BREVO_API_URL)
                    .header("api-key", brevoProperties.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "sender", Map.of(
                                    "email", brevoProperties.getSenderEmail(),
                                    "name", brevoProperties.getSenderName()
                            ),
                            "to", java.util.List.of(Map.of("email", to)),
                            "subject", subject,
                            "htmlContent", htmlContent
                    ))
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            log.info("Email enviado mediante Brevo API a: {}", to);
        } catch (Exception e) {
            log.error("Fallo al enviar email via Brevo API: {}. Intentando SMTP como respaldo...", e.getMessage());
            sendViaSmtp(to, subject, htmlContent);
        }
    }

    private void sendViaSmtp(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email enviado vía SMTP a: {}", to);
        } catch (Exception smtpException) {
            log.error("Error enviando email vía SMTP a {}: {}", to, smtpException.getMessage());
        }
    }
}
