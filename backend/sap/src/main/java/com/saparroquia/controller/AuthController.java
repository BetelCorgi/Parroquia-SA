package com.saparroquia.controller;

import com.saparroquia.model.dto.ErrorResponse;
import com.saparroquia.model.dto.LoginRequest;
import com.saparroquia.model.dto.LoginResponse;
import com.saparroquia.model.dto.MessageResponse;
import com.saparroquia.model.dto.RecoveryPasswordRequest;
import com.saparroquia.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Endpoint para iniciar sesión
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest,
                                    HttpServletRequest request) {
        try {
            log.info("Intento de login para usuario: {}", loginRequest.getEmail());
            LoginResponse response = authService.login(loginRequest, request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            log.warn("Credenciales inválidas para usuario: {}", loginRequest.getEmail());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ErrorResponse.of(
                            HttpStatus.UNAUTHORIZED.value(),
                            "Unauthorized",
                            "Email o contraseña incorrectos",
                            "/api/auth/login"
                    ));
        } catch (UsernameNotFoundException e) {
            log.warn("Usuario no encontrado: {}", loginRequest.getEmail());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ErrorResponse.of(
                            HttpStatus.UNAUTHORIZED.value(),
                            "Unauthorized",
                            "Usuario no encontrado o inactivo",
                            "/api/auth/login"
                    ));
        } catch (Exception e) {
            log.error("Error durante el login: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ErrorResponse.of(
                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Internal Server Error",
                            "Error al procesar la solicitud de login",
                            "/api/auth/login"
                    ));
        }
    }
    
    /**
     * Endpoint para cerrar sesión
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token != null) {
                authService.logout(token);
                return ResponseEntity.ok(new MessageResponse("Sesión cerrada exitosamente"));
            }
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Token no proporcionado"));
        } catch (Exception e) {
            log.error("Error durante el logout: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error al cerrar sesión"));
        }
    }
    
    /**
     * Endpoint para recuperar contraseña
     * POST /api/auth/recover-password
     */
    @PostMapping("/recover-password")
    public ResponseEntity<MessageResponse> recoverPassword(@Valid @RequestBody RecoveryPasswordRequest request) {
        try {
            MessageResponse response = authService.recoverPassword(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error durante la recuperación de contraseña: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error al procesar la solicitud de recuperación"));
        }
    }
    
    /**
     * Extrae el token JWT del header Authorization
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}




/*

curl -X POST http://192.168.100.28:8080/api/auth/recover-password \
  -H "Content-Type: application/json" \
  -d '{"email":"borisgonzasanchez31@gmail.com"}'
 */