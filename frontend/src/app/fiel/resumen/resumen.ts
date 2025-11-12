import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SummaryMetric {
  title: string;
  value: string;
  hint: string;
  action?: string;
}

interface UpcomingEvent {
  title: string;
  schedule: string;
  participants: number;
  status: 'Nuevo' | 'Programado';
}

@Component({
  selector: 'app-fiel-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class FielResumen {
  metrics: SummaryMetric[] = [
    {
      title: 'Donaciones recibidas este mes',
      value: 'S/ 230',
      hint: 'Incluye colaboraciones en línea y presenciales',
      action: 'Ver detalle',
    },
    {
      title: 'Siguiente tiempo litúrgico',
      value: '20 días para Adviento',
      hint: 'Prepárate con oración y servicio',
    },
  ];

  events: UpcomingEvent[] = [
    {
      title: 'Celebración de Cuaresma',
      schedule: 'Mar 05 · 4:00pm',
      participants: 15,
      status: 'Nuevo',
    },
    {
      title: 'Reunión de Comunidad',
      schedule: 'Mar 08 · 7:00pm',
      participants: 12,
      status: 'Programado',
    },
    {
      title: 'Catequesis Familiar',
      schedule: 'Mar 11 · 6:30pm',
      participants: 18,
      status: 'Programado',
    },
  ];

  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  calendarMonth = 'Mayo, 2025';
  highlightedDays = new Set([5, 9, 12, 18, 23, 29]);
}
