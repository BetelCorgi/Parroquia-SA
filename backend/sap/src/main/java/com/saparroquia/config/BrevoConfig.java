package com.saparroquia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class BrevoConfig {

    @Bean
    public WebClient brevoWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.brevo.com/v3")
                .defaultHeader("accept", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
