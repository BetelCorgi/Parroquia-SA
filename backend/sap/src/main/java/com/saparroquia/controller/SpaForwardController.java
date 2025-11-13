package com.saparroquia.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Redirige rutas de la SPA de Angular para que sean servidas por index.html
 * cuando se accede directamente desde el backend (Render).
 */
@Controller
public class SpaForwardController {

    @GetMapping({
            "/verify-email",
            "/registrarse",
            "/login",
            "/admin/login",
            "/recuperar",
            "/restablecer/**",
            "/panel/**",
            "/admin/**"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
