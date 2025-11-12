import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fiel-ajustes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ajustes.html',
  styleUrl: './ajustes.css',
})
export class FielAjustes {
  profile = {
    nombre: 'Administrador Parroquial',
    correo: 'admin@parroquia.pe',
  };

  hostingLink = 'https://plataforma.parroquia.pe';
  swaggerLink = 'http://localhost:8080/swagger-ui/index.html';
}
