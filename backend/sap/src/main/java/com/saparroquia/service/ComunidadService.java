package com.saparroquia.service;

import com.saparroquia.model.dto.ComunidadResponse;
import com.saparroquia.repository.ComunidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComunidadService {

    private final ComunidadRepository comunidadRepository;

    public List<ComunidadResponse> obtenerComunidadesActivas() {
        return comunidadRepository.findAllByEstadoTrueOrderByNombreAsc()
                .stream()
                .map(comunidad -> new ComunidadResponse(
                        comunidad.getIdComunidad(),
                        comunidad.getNombre(),
                        comunidad.getTipo()
                ))
                .collect(Collectors.toList());
    }
}
