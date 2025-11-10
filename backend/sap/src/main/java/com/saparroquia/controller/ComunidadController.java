package com.saparroquia.controller;

import com.saparroquia.model.dto.ComunidadResponse;
import com.saparroquia.service.ComunidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/comunidades")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ComunidadController {

    private final ComunidadService comunidadService;

    @GetMapping
    public ResponseEntity<List<ComunidadResponse>> obtenerComunidadesActivas() {
        return ResponseEntity.ok(comunidadService.obtenerComunidadesActivas());
    }
}
