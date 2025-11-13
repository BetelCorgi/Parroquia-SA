package com.saparroquia.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "brevo")
@Getter
@Setter
public class BrevoProperties {

    /**
     * API Key de Brevo para autenticación HTTP.
     */
    private String apiKey;

    /**
     * Dirección de correo que aparecerá como remitente.
     */
    private String senderEmail;

    /**
     * Nombre legible que aparecerá como remitente.
     */
    private String senderName;
}
