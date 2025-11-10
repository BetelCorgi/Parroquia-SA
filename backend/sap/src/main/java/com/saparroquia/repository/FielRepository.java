package com.saparroquia.repository;

import com.saparroquia.model.entity.Fiel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FielRepository extends JpaRepository<Fiel, Long> {

    boolean existsByDni(String dni);

    boolean existsByCorreo(String correo);
}
