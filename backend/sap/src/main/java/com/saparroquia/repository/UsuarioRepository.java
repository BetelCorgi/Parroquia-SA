package com.saparroquia.repository;

import com.saparroquia.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    
    Boolean existsByEmail(String email);
    
    Optional<Usuario> findByEmailAndEstadoTrue(String email);
}
