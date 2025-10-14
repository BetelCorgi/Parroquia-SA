import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-galeria-publica',
  imports: [CommonModule, RouterLink],
  templateUrl: './galeria-publica.html',
  styleUrl: './galeria-publica.css',
})
export class GaleriaPublica {
  galeria = [
    { src: 'assets/img/gal1.jpg', alt: 'Actividad parroquial 1', title: 'Actividad parroquial 1', description: 'Descripción de la actividad parroquial 1' },
    { src: 'assets/img/gal2.jpg', alt: 'Actividad parroquial 2', title: 'Actividad parroquial 2', description: 'Descripción de la actividad parroquial 2' },
    { src: 'assets/img/gal3.jpg', alt: 'Actividad parroquial 3', title: 'Actividad parroquial 3', description: 'Descripción de la actividad parroquial 3' },
    { src: 'assets/img/gal4.jpg', alt: 'Actividad parroquial 4', title: 'Actividad parroquial 4', description: 'Descripción de la actividad parroquial 4' },
    { src: 'assets/img/gal5.jpg', alt: 'Actividad parroquial 5', title: 'Actividad parroquial 5', description: 'Descripción de la actividad parroquial 5' },
  ];
}
