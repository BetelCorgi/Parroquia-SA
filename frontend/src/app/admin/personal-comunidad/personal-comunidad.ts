import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Comunidad {
  id: number;
  nombre: string;
  dirigente: string;
  tipo: string;
  foto: string;
  estado: string;
}

interface Fiel {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  foto: string;
  fNac: string;
  comunidad: string;
  rol: string;
  estado: string;
}

interface GaleriaItem {
  id: number;
  community: string;
  image: string;
}


@Component({
  selector: 'personal-comunidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-comunidad.html',
  styleUrls: ['./personal-comunidad.css']
})
export class PersonasComunidad{
  activeTab: 'comunidades' | 'fieles' = 'comunidades';
  view: 'list' | 'gallery' = 'list';

  communities: Comunidad[] = [
    { id: 1, nombre: 'Comunidad 1', dirigente: 'Juan Pérez', tipo: 'Tipo A', foto: '', estado: 'Activo' },
    { id: 2, nombre: 'Comunidad 2', dirigente: 'María García', tipo: 'Tipo B', foto: '', estado: 'Activo' },
    { id: 3, nombre: 'Comunidad 3', dirigente: 'Carlos Ruiz', tipo: 'Tipo A', foto: '', estado: 'Activo' },
    { id: 4, nombre: 'Comunidad 4', dirigente: 'Laura Torres', tipo: 'Tipo C', foto: '', estado: 'Inactivo' },
    { id: 5, nombre: 'Comunidad 5', dirigente: 'Miguel Ángel', tipo: 'Tipo B', foto: '', estado: 'Activo' },
    { id: 6, nombre: 'Comunidad 6', dirigente: 'Sofia Mendoza', tipo: 'Tipo A', foto: '', estado: 'Activo' },
    { id: 7, nombre: 'Comunidad 7', dirigente: 'Roberto Silva', tipo: 'Tipo C', foto: '', estado: 'Activo' },
    { id: 8, nombre: 'Comunidad 8', dirigente: 'Patricia Díaz', tipo: 'Tipo B', foto: '', estado: 'Activo' },
  ];

  fieles: Fiel[] = [
    { id: 1, dni: '12345678', nombre: 'Pedro', apellido: 'López', foto: '', fNac: '1990-01-15', comunidad: 'San Juan de Sahagun', rol: 'Miembro', estado: 'Activo' },
    { id: 2, dni: '87654321', nombre: 'Ana', apellido: 'Martínez', foto: '', fNac: '1985-05-20', comunidad: 'San Juan de Sahagun', rol: 'Dirigente', estado: 'Activo' },
    { id: 3, dni: '45678912', nombre: 'Luis', apellido: 'Fernández', foto: '', fNac: '1992-08-10', comunidad: 'San Juan de Sahagun', rol: 'Miembro', estado: 'Activo' },
    { id: 4, dni: '78945612', nombre: 'Carmen', apellido: 'Rojas', foto: '', fNac: '1988-03-25', comunidad: 'San Juan de Sahagun', rol: 'Coordinador', estado: 'Activo' },
    { id: 5, dni: '32165498', nombre: 'Jorge', apellido: 'Sánchez', foto: '', fNac: '1995-11-30', comunidad: 'San Juan de Sahagun', rol: 'Miembro', estado: 'Inactivo' },
  ];

  galleryItems: GaleriaItem[] = Array.from({ length: 28 }, (_, i) => ({
    id: i + 1,
    community: 'San Juan de Sahagun',
    image: ''
  }));

  setTab(tab: 'comunidades' | 'fieles') {
    this.activeTab = tab;
  }

  setView(view: 'list' | 'gallery') {
    this.view = view;
  }

  eliminarComunidad(id: number) {
    this.communities = this.communities.filter(c => c.id !== id);
  }
}
