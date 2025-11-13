package com.saparroquia.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(nullable = true)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RolUsuario rol;
    
    @Column(nullable = false)
    private Boolean estado = true;

    @Column(name = "correo_verificado", nullable = false)
    private Boolean correoVerificado = false;

    @Column(name = "token_verificacion", length = 255)
    private String tokenVerificacion;

    @Column(name = "token_verificacion_expira")
    private LocalDateTime tokenVerificacionExpira;
    
    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
    
    @ManyToOne
    @JoinColumn(name = "id_fiel")
    private Fiel fiel;
    
    public enum RolUsuario {
        administrador,
        fiel;

        public String getAuthority() {
            return "ROLE_" + name().toUpperCase();
        }
    }
}
