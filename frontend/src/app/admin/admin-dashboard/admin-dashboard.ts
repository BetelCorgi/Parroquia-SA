import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  tiles = [
    {
      icon: 'fa-solid fa-bell',
      title: 'Notificaciones',                            
      desc: 'Consulta y filtra tus solicitudes.',
      link: '/admin/notificaciones',
      color: '#FFD8C2'
    },
    {
      icon: 'fa-solid fa-hand-holding-heart',
      title: 'Solicitar Eventos Eucarísticos',
      desc: 'Recibe solicitudes de bautizos, matrimonios, etc.',
      link: '/admin/solicitar-eventos',
      color: '#E8F2D9'
    },
    {
      icon: 'fa-solid fa-calendar-days',
      title: 'Eventos Programados',
      desc: 'Administra fechas y detalles de eventos.',
      link: '/admin/eventos-programados',
      color: '#DDEAFB'
    },
    {
      icon: 'fa-solid fa-praying-hands',
      title: 'Oración del Día',
      desc: 'Publica la oración diaria para la comunidad.',
      link: '/admin/oracion-del-dia',
      color: '#F4E6FF'
    },
  ];
}
