import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventos-programados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos-programados.html',
  styleUrls: ['./eventos-programados.css']
})
export class EventosProgramados {
  mostrarLista = false;

  personal = [
    { dni: '12345678', nombre: 'Juan', apellido: 'Pérez', rol: 'Coordinador', telefono: '987654321', correo: 'juan@correo.com', estado: 'Activo' },
    { dni: '87654321', nombre: 'María', apellido: 'López', rol: 'Fiel', telefono: '987111222', correo: 'maria@correo.com', estado: 'Inactivo' },
    { dni: '11223344', nombre: 'Pedro', apellido: 'Gómez', rol: 'Padre', telefono: '986222333', correo: 'pedro@correo.com', estado: 'Activo' },
  ];

  constructor(private router: Router) {}

  volverAlFormulario() {
    this.router.navigate(['/solicitar-eventos']);
  }

  mostrarListaPersonal() {
    this.mostrarLista = true;
  }

  mostrarCalendario() {
    this.mostrarLista = false;
  }
}
