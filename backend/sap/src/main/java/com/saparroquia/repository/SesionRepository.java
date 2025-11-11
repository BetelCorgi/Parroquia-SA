package com.saparroquia.repository;

import com.saparroquia.model.entity.Sesion;
import com.saparroquia.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Long> {
    
    Optional<Sesion> findByTokenSesionAndActivaTrue(String token);
    
    List<Sesion> findByUsuarioAndActivaTrue(Usuario usuario);
    
    @Modifying
    @Query("UPDATE Sesion s SET s.activa = false WHERE s.usuario = :usuario AND s.activa = true")
    void desactivarSesionesPorUsuario(Usuario usuario);
    
    @Modifying
    @Query("UPDATE Sesion s SET s.activa = false WHERE s.fechaExpiracion < :fecha AND s.activa = true")
    void desactivarSesionesExpiradas(LocalDateTime fecha);
    
    void deleteByTokenSesion(String token);
}
