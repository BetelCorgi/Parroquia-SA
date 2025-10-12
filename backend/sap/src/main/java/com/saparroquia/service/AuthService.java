package com.saparroquia.service;

import com.saparroquia.model.dto.LoginRequest;
import com.saparroquia.model.dto.LoginResponse;
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
        sesion.setToken(jwt);
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
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .rol(usuario.getRol().name())
                .build();
    }
    
    @Transactional
    public void logout(String token) {
        sesionRepository.findByTokenAndActivaTrue(token)
                .ifPresent(sesion -> {
                    sesion.setActiva(false);
                    sesionRepository.save(sesion);
                    log.info("Sesión cerrada para usuario: {}", sesion.getUsuario().getEmail());
                });
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
