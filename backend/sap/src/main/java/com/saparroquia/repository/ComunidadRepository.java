package com.saparroquia.repository;

import com.saparroquia.model.entity.Comunidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComunidadRepository extends JpaRepository<Comunidad, Long> {

    java.util.List<Comunidad> findAllByEstadoTrueOrderByNombreAsc();
}
