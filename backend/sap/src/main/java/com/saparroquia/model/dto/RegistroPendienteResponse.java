package com.saparroquia.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegistroPendienteResponse {

    private String token;
    private String email;
}
