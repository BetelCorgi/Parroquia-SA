package com.saparroquia.service;

import com.saparroquia.config.AppProperties;
import com.saparroquia.model.dto.LoginRequest;
import com.saparroquia.model.dto.LoginResponse;
import com.saparroquia.model.dto.MessageResponse;
import com.saparroquia.model.dto.RecoveryPasswordRequest;
import com.saparroquia.model.dto.RegisterRequest;
import com.saparroquia.model.dto.VerifyEmailRequest;
import com.saparroquia.model.entity.Comunidad;
import com.saparroquia.model.entity.Fiel;
import com.saparroquia.model.entity.Sesion;
import com.saparroquia.model.entity.Usuario;
import com.saparroquia.repository.ComunidadRepository;
import com.saparroquia.repository.FielRepository;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final SesionRepository sesionRepository;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final ComunidadRepository comunidadRepository;
    private final FielRepository fielRepository;
    private final AppProperties appProperties;

    private static final int VERIFICATION_TOKEN_EXPIRATION_HOURS = 48;
    private static final String DEFAULT_FRONTEND_BASE_URL = "https://parroquia-sa.onrender.com";

    @Transactional
    public MessageResponse registerFiel(RegisterRequest request) {
        if (Boolean.TRUE.equals(usuarioRepository.existsByEmail(request.getEmail()))) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado.");
        }

        if (Boolean.TRUE.equals(fielRepository.existsByDni(request.getDni()))) {
            throw new IllegalArgumentException("El DNI ya está registrado.");
        }

        if (Boolean.TRUE.equals(fielRepository.existsByCorreo(request.getEmail()))) {
            throw new IllegalArgumentException("Ya existe un fiel registrado con ese correo electrónico.");
        }

        Comunidad comunidad = null;
        if (request.getComunidadId() != null) {
            comunidad = comunidadRepository.findById(request.getComunidadId())
                    .orElseThrow(() -> new IllegalArgumentException("La comunidad seleccionada no existe."));
            if (Boolean.FALSE.equals(comunidad.getEstado())) {
                throw new IllegalArgumentException("La comunidad seleccionada no está activa.");
            }
        }

        Fiel fiel = new Fiel();
        fiel.setComunidad(comunidad);
        fiel.setDni(request.getDni());
        fiel.setNombre(request.getNombre());
        fiel.setApellido(request.getApellido());
        fiel.setFechaNac(request.getFechaNacimiento());
        fiel.setCorreo(request.getEmail());
        fiel.setTelefono(request.getTelefono());
        fielRepository.save(fiel);

        String verificationToken = UUID.randomUUID().toString();

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
        usuario.setRol(Usuario.RolUsuario.fiel);
        usuario.setEstado(false);
        usuario.setCorreoVerificado(false);
        usuario.setTokenVerificacion(verificationToken);
        usuario.setTokenVerificacionExpira(LocalDateTime.now().plusHours(VERIFICATION_TOKEN_EXPIRATION_HOURS));
        usuario.setFiel(fiel);

        usuarioRepository.save(usuario);

        String verificationLink = buildFrontendUrl("/verify-email?token=" + verificationToken);
        emailService.sendVerificationEmail(request.getEmail(), verificationLink, request.getNombre());

        log.info("Registro de fiel iniciado para email: {}", request.getEmail());

        return new MessageResponse("Registro completado. Revisa tu correo para verificar tu cuenta.");
    }

    @Transactional
    public MessageResponse verifyEmail(VerifyEmailRequest request) {
        validatePasswordConfirmation(request.getPassword(), request.getConfirmPassword());

        Usuario usuario = usuarioRepository.findByTokenVerificacion(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("El token de verificación no es válido."));

        if (usuario.getTokenVerificacionExpira() == null || usuario.getTokenVerificacionExpira().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El token de verificación ha expirado. Solicita un nuevo registro.");
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setEstado(true);
        usuario.setCorreoVerificado(true);
        usuario.setTokenVerificacion(null);
        usuario.setTokenVerificacionExpira(null);

        usuarioRepository.save(usuario);

        log.info("Cuenta verificada para el usuario: {}", usuario.getEmail());

        return new MessageResponse("Tu correo ha sido verificado. Ya puedes iniciar sesión.");
    }
    
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
            
            // Enviar email de recuperación
            emailService.sendRecoveryEmail(usuario.getEmail(), recoveryToken);
            
            log.info("Solicitud de recuperación de contraseña para: {}", request.getEmail());
        } else {
            log.warn("Intento de recuperación para email no encontrado: {}", request.getEmail());
        }
        
        // Siempre devolver el mismo mensaje para seguridad
        return new MessageResponse("Si el correo existe, recibirás un enlace de recuperación.");
    }

    private void validatePasswordConfirmation(String password, String confirmPassword) {
        if (password == null || confirmPassword == null || !password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Las contraseñas no coinciden.");
        }
    }

    private String buildFrontendUrl(String path) {
        String baseUrl = appProperties.getFrontendBaseUrl();
        if (!StringUtils.hasText(baseUrl)) {
            baseUrl = DEFAULT_FRONTEND_BASE_URL;
            log.warn("app.frontend-base-url no está configurada. Usando valor por defecto: {}", baseUrl);
        }
        if (path == null) {
            return baseUrl;
        }
        if (baseUrl.endsWith("/") && path.startsWith("/")) {
            return baseUrl.substring(0, baseUrl.length() - 1) + path;
        }
        if (!baseUrl.endsWith("/") && !path.startsWith("/")) {
            return baseUrl + "/" + path;
        }
        return baseUrl + path;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
