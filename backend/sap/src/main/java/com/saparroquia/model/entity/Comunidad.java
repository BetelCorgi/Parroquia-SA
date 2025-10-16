package com.saparroquia.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comunidad")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comunidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idComunidad;
    
    @Column(nullable = false, length = 25)
    private String nombre;
    
    @Column(length = 25)
    private String tipo;
    
    @Column(length = 50)
    private String fotografia;
    
    @Column(nullable = false)
    private Boolean estado = true;
    
    @ManyToOne
    @JoinColumn(name = "id_dirigente")
    private Fiel dirigente;
}
