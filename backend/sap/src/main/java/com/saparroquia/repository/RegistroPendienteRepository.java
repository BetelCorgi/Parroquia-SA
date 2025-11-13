package com.saparroquia.repository;

import com.saparroquia.model.entity.RegistroPendiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistroPendienteRepository extends JpaRepository<RegistroPendiente, Long> {

    Optional<RegistroPendiente> findByEmail(String email);

    Optional<RegistroPendiente> findByDni(String dni);

    Optional<RegistroPendiente> findByTokenAndConsumidoFalse(String token);

    boolean existsByDniAndConsumidoFalse(String dni);
}
