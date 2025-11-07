import { Component, computed, signal } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms'; 
import localeEsPE from '@angular/common/locales/es';
import { startWith } from 'rxjs';
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
  imports: [CommonModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'
})
export class Notificaciones {
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

  // Propiedades para el modal de denegación
  isModalOpen = signal(false);
  denialReason: string = '';
  private requestIdToDeny: number | null = null;

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
    });
  });

  constructor(
    private fb: FormBuilder,
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

  // --- Lógica de Aceptar/Denegar ---

  openDenyModal(id: number) {
    this.requestIdToDeny = id;
    this.denialReason = '';
    this.isModalOpen.set(true);
  }

  closeDenyModal() {
    this.isModalOpen.set(false);
    this.requestIdToDeny = null;
    this.denialReason = '';
  }

  acceptRequest(id: number) {
    this.updateRequestState(id, 'aceptado');
  }

  denyRequest() {
    if (this.requestIdToDeny === null || !this.denialReason.trim()) {
      return; 
    }

    this.updateRequestState(this.requestIdToDeny, 'denegado', this.denialReason.trim());
    this.closeDenyModal();
  }

  private updateRequestState(id: number, newState: Estado, reason?: string) {
    // Actualiza la señal de datos, simulando el cambio en el sistema
    this.data.update(requests => 
      requests.map(s => {
        if (s.id === id) {
          return {
            ...s,
            estado: newState,
            // Solo se guarda el motivo si el nuevo estado es 'denegado'
            motivoDenegacion: newState === 'denegado' ? reason : undefined
          };
        }
        return s;
      })
    );
  }

  // --- Funciones de vista originales ---
  
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
