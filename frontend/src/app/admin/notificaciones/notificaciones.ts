import { Component, computed, signal } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import localeEsPE from '@angular/common/locales/es';
import { startWith } from 'rxjs';

// Se importan el servicio y los tipos
import { EventRequests, Estado } from '../shared/event-requests';

registerLocaleData(localeEsPE, 'es-PE');

interface Solicitud {
  id: number;
  titulo: string;
  asunto: string;
  invitados: number;
  ubicacion: string;
  fecha: string;
  hora: string;
  estado: Estado;
  motivoDenegacion?: string;
  portadaUrl?: string;
  enlaceVideo?: string;
  tipo?: string;
  horaFin?: string;
  createdAt?: number;
}

@Component({
  selector: 'admin-notificaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'
})
export class Notificaciones {
  // Datos demo (luego vendrán del backend)
  private readonly data = signal<Solicitud[]>([
    {
      id: 1,
      titulo: 'Misa de Acción de Gracias',
      asunto: 'Agradecimiento por aniversario',
      invitados: 25,
      ubicacion: 'Templo Principal',
      fecha: '2025-10-20',
      hora: '19:00',
      estado: 'aceptado'
    },
    {
      id: 2,
      titulo: 'Funeral',
      asunto: 'Ceremonia por familiar',
      invitados: 60,
      ubicacion: 'Capilla San José',
      fecha: '2025-10-22',
      hora: '16:00',
      estado: 'denegado',
      motivoDenegacion: 'Fecha no disponible. Sugerimos coordinar otra hora.'
    },
    {
      id: 3,
      titulo: 'Bautizo',
      asunto: 'Bautizo de Martín',
      invitados: 12,
      ubicacion: 'Capilla Auxiliar',
      fecha: '2025-10-25',
      hora: '11:30',
      estado: 'pendiente'
    },
    {
      id: 4,
      titulo: 'Misa Comunitaria',
      asunto: 'Acción social',
      invitados: 80,
      ubicacion: 'Templo Principal',
      fecha: '2025-10-18',
      hora: '18:00',
      estado: 'aceptado'
    }
  ]);

  form: FormGroup;

  private filters = signal({
    estado: '',
    desde: '',
    hasta: '',
    asunto: ''
  });

  filtered = computed(() => {
    const v = this.filters();
    const estado = (v.estado || '').trim() as '' | Estado;
    const desde = (v.desde || '').trim();
    const hasta = (v.hasta || '').trim();
    const asunto = (v.asunto || '').toLowerCase().trim();

    return this.data().filter(s => {
      if (estado && s.estado !== estado) return false;
      if (desde && s.fecha < desde) return false;
      if (hasta && s.fecha > hasta) return false;
      if (asunto && !(s.titulo.toLowerCase().includes(asunto) || s.asunto.toLowerCase().includes(asunto))) return false;
      return true;
    }); // NOTA: El sort ya se hace en el `load` del servicio
  });

  constructor(
    private fb: FormBuilder,
    // CORRECCIÓN: Se inyecta el servicio con el nombre correcto
    private events: EventRequests
  ) {
    this.form = this.fb.group({
      estado: [''],
      desde: [''],
      hasta: [''],
      asunto: ['']
    });

    this.form.valueChanges.pipe(
      startWith(this.form.value)
    ).subscribe(formValue => {
      this.filters.set(formValue);
    });
  }

  resetFilters() {
    this.form.reset({ estado: '', desde: '', hasta: '', asunto: '' });
  }

  badgeClass(estado: Estado): string {
    switch (estado) {
      case 'aceptado': return 'badge badge--ok';
      case 'denegado': return 'badge badge--ko';
      case 'pendiente': return 'badge badge--wait';
    }
  }

  stateLabel(estado: Estado) {
    return estado === 'aceptado' ? 'Aceptado'
           : estado === 'denegado' ? 'Denegado'
           : 'Pendiente';
  }
}
