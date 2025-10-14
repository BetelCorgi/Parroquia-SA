import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-galeria-publica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './galeria-publica.html',
  styleUrl: './galeria-publica.css',
})
export class GaleriaPublica {
  mostrarSoloActivos = false;
  modalAbierto = false;
  imagenSeleccionada: any = null;
  indiceSeleccionado: number | null = null;

  galeria = [
    {
      src: 'assets/img/gal1.jpg',
      alt: 'Actividad parroquial 1',
      title: 'Actividad parroquial 1',
      description: 'Descripción de la actividad parroquial 1',
      active: true,
    },
    {
      src: 'assets/img/gal2.jpg',
      alt: 'Actividad parroquial 2',
      title: 'Actividad parroquial 2',
      description: 'Descripción de la actividad parroquial 2',
      active: false,
    },
    {
      src: 'assets/img/gal3.jpg',
      alt: 'Actividad parroquial 3',
      title: 'Actividad parroquial 3',
      description: 'Descripción de la actividad parroquial 3',
      active: true,
    },
    {
      src: 'assets/img/gal4.jpg',
      alt: 'Actividad parroquial 4',
      title: 'Actividad parroquial 4',
      description: 'Descripción de la actividad parroquial 4',
      active: true,
    },
    {
      src: 'assets/img/gal5.jpg',
      alt: 'Actividad parroquial 5',
      title: 'Actividad parroquial 5',
      description: 'Descripción de la actividad parroquial 5',
      active: false,
    },
  ];

  galeriaFiltrada() {
    return this.mostrarSoloActivos ? this.galeria.filter((g) => g.active) : this.galeria;
  }

  abrirModal(img: any, index: number) {
    console.log('Imagen recibida:', img); // 🔍 Debug
    console.log('Índice:', index); // 🔍 Debug

    this.imagenSeleccionada = { ...img };
    this.indiceSeleccionado = index;
    this.modalAbierto = true;

    console.log('imagenSeleccionada después de asignar:', this.imagenSeleccionada); // 🔍 Debug

    document.body.style.overflow = 'hidden';
  }
  
  cerrarModal() {
    this.modalAbierto = false;
    this.imagenSeleccionada = null;
    this.indiceSeleccionado = null;
    document.body.style.overflow = ''; // restaura scroll
  }

  guardarCambios() {
    if (this.indiceSeleccionado !== null) {
      this.galeria[this.indiceSeleccionado] = { ...this.imagenSeleccionada };
      alert('✅ Cambios guardados correctamente');
      this.cerrarModal();
    }
  }
}
