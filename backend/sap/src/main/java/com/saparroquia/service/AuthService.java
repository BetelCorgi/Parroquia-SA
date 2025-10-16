package com.saparroquia.service;

import com.saparroquia.model.dto.LoginRequest;
import com.saparroquia.model.dto.LoginResponse;
import com.saparroquia.model.dto.RecoveryPasswordRequest;
import com.saparroquia.model.dto.MessageResponse;
import com.saparroquia.model.entity.Sesion;
import com.saparroquia.model.entity.Usuario;
import com.saparroquia.repository.SesionRepository;
import com.saparroquia.repository.UsuarioRepository;
import com.saparroquia.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final SesionRepository sesionRepository;
    private final JwtTokenProvider tokenProvider;
    
    @Transactional
    public LoginResponse login(LoginRequest loginRequest, HttpServletRequest request) {
        // Autenticar usuario
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generar token JWT
        String jwt = tokenProvider.generateToken(authentication);
        
        // Obtener usuario
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Guardar sesión
        Sesion sesion = new Sesion();
        sesion.setUsuario(usuario);
        sesion.setTokenSesion(jwt);
        sesion.setFechaInicio(LocalDateTime.now());
        sesion.setFechaExpiracion(
                LocalDateTime.ofInstant(
                        tokenProvider.getExpirationDateFromToken(jwt).toInstant(),
                        ZoneId.systemDefault()
                )
        );
        sesion.setActiva(true);
        sesion.setIpAddress(getClientIp(request));
        sesion.setUserAgent(request.getHeader("User-Agent"));
        
        sesionRepository.save(sesion);
        
        log.info("Usuario {} ha iniciado sesión exitosamente", usuario.getEmail());
        
        // Construir respuesta
        return LoginResponse.builder()
                .token(jwt)
                .tipo("Bearer")
                .id(usuario.getIdUsuario())
                .email(usuario.getEmail())
                .nombre(usuario.getFiel() != null ? usuario.getFiel().getNombre() : null)
                .apellido(usuario.getFiel() != null ? usuario.getFiel().getApellido() : null)
                .rol(usuario.getRol().name())
                .build();
    }
    
    @Transactional
    public void logout(String token) {
        sesionRepository.findByTokenSesionAndActivaTrue(token)
                .ifPresent(sesion -> {
                    sesion.setActiva(false);
                    sesionRepository.save(sesion);
                    log.info("Sesión cerrada para usuario: {}", sesion.getUsuario().getEmail());
                });
    }
    
    @Transactional
    public MessageResponse recoverPassword(RecoveryPasswordRequest request) {
        // Buscar usuario por email
        Usuario usuario = usuarioRepository.findByEmailAndEstadoTrue(request.getEmail())
                .orElse(null);
        
        if (usuario != null) {
            // Generar token de recuperación
            String recoveryToken = tokenProvider.generateRecoveryToken(usuario.getEmail());
            
            // Enviar email (implementar EmailService)
            // emailService.sendRecoveryEmail(usuario.getEmail(), recoveryToken);
            
            log.info("Solicitud de recuperación de contraseña para: {}", request.getEmail());
        } else {
            log.warn("Intento de recuperación para email no encontrado: {}", request.getEmail());
        }
        
        // Siempre devolver el mismo mensaje para seguridad
        return new MessageResponse("Si el correo existe, recibirás un enlace de recuperación.");
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
