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

  // Filtros para Comunidades
  filters = {
    nombre: '',
    lider: '',
    tipo: '',
    estado: ''
  };

  // Filtros para Fieles
  fielesFilters = {
    dni: '',
    nombre: '',
    apellido: '',
    comunidad: '',
    rol: '',
    estado: ''
  };

  // Selección para acciones de pie de página
  selectedCommunityIds: Set<number> = new Set<number>();

  // Panel de boletines
  showBulletin = false;
  bulletinTarget: { tipo: 'comunidad' | 'fiel'; nombre: string; id: number } | null = null;
  bulletinForm = {
    titulo: '',
    tipo: 'Aviso',
    mensaje: '',
  };

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

  // Lista filtrada de comunidades
  get filteredCommunities(): Comunidad[] {
    const byNombre = (v: string) => v.toLowerCase().includes(this.filters.nombre.trim().toLowerCase());
    const byLider = (v: string) => v.toLowerCase().includes(this.filters.lider.trim().toLowerCase());
    const byTipo = (v: string) => v.toLowerCase().includes(this.filters.tipo.trim().toLowerCase());
    const estado = this.filters.estado.trim().toLowerCase();

    return this.communities.filter(c => {
      const matchNombre = !this.filters.nombre || byNombre(c.nombre);
      const matchLider = !this.filters.lider || byLider(c.dirigente);
      const matchTipo = !this.filters.tipo || byTipo(c.tipo);
      const matchEstado = !estado || c.estado.toLowerCase() === estado;
      return matchNombre && matchLider && matchTipo && matchEstado;
    });
  }

  clearFilters() {
    this.filters = { nombre: '', lider: '', tipo: '', estado: '' };
  }

  // Lista filtrada de fieles
  get filteredFieles(): Fiel[] {
    const toLower = (v: string) => v.toLowerCase();
    const contains = (src: string, q: string) => toLower(src).includes(toLower(q.trim()));
    const estado = this.fielesFilters.estado.trim().toLowerCase();
    return this.fieles.filter(f => {
      const okDni = !this.fielesFilters.dni || contains(f.dni, this.fielesFilters.dni);
      const okNombre = !this.fielesFilters.nombre || contains(f.nombre, this.fielesFilters.nombre);
      const okApellido = !this.fielesFilters.apellido || contains(f.apellido, this.fielesFilters.apellido);
      const okComunidad = !this.fielesFilters.comunidad || contains(f.comunidad, this.fielesFilters.comunidad);
      const okRol = !this.fielesFilters.rol || contains(f.rol, this.fielesFilters.rol);
      const okEstado = !estado || f.estado.toLowerCase() === estado;
      return okDni && okNombre && okApellido && okComunidad && okRol && okEstado;
    });
  }

  clearFielesFilters() {
    this.fielesFilters = { dni: '', nombre: '', apellido: '', comunidad: '', rol: '', estado: '' };
  }

  // Selección de filas
  toggleSelectCommunity(id: number) { }

isSelected(id: number): boolean { return false; }

  addCommunity() {
    // Placeholder: aquí abrirías un modal/formulario real
    console.log('Agregar comunidad');
  }

  modifySelected() { }

  modifyCommunity(id: number) { }

  // Abrir/cerrar panel y enviar
  openBulletin(tipo: 'comunidad' | 'fiel', nombre: string, id: number) {
    this.bulletinTarget = { tipo, nombre, id };
    this.showBulletin = true;
  }

  openBulletinIcon(tipo: 'comunidad' | 'fiel', nombre: string, id: number) {
    this.openBulletin(tipo, nombre, id);
  }

  closeBulletin() {
    this.showBulletin = false;
  }

  sendBulletin() {
    if (!this.bulletinTarget) return;
    const payload = {
      para: this.bulletinTarget,
      ...this.bulletinForm,
    };
    console.log('Enviar boletín:', payload);
    // Reset simple
    this.bulletinForm = { titulo: '', tipo: 'Aviso', mensaje: '' };
    this.showBulletin = false;
  }
}
