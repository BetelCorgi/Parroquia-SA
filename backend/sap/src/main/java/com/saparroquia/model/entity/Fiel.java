package com.saparroquia.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "fiel")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fiel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFiel;
    
    @ManyToOne
    @JoinColumn(name = "id_comunidad")
    private Comunidad comunidad;
    
    @Column(length = 8)
    private String dni;
    
    @Column(nullable = false, length = 50)
    private String nombre;
    
    @Column(nullable = false, length = 50)
    private String apellido;
    
    @Column(length = 80)
    private String rol;
    
    @Column(length = 150)
    private String fotografia;
    
    @Column(name = "fecha_nac")
    private LocalDate fechaNac;
    
    @Column(length = 100)
    private String correo;
    
    @Column(length = 15)
    private String telefono;
    
    @Column(nullable = false)
    private Boolean estado = true;
}
