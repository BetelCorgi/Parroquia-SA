package com.saparroquia.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ComunidadResponse {

    private Long id;
    private String nombre;
    private String tipo;
}
