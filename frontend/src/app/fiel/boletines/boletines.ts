import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BulletinCard {
  title: string;
  description: string;
  action: string;
  icon: string;
}

@Component({
  selector: 'app-fiel-boletines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boletines.html',
  styleUrl: './boletines.css',
})
export class FielBoletines {
  cards: BulletinCard[] = [
    {
      title: 'Formularios y eventos',
      description: 'Revisa solicitudes pendientes de tu comunidad.',
      action: 'Ver detalles',
      icon: 'fa-solid fa-file-lines',
    },
    {
      title: 'Personas y comunidades',
      description: 'Actualiza la información de quienes participan.',
      action: 'Administrar',
      icon: 'fa-solid fa-people-group',
    },
    {
      title: 'Boletines enviados',
      description: 'Consulta los comunicados recientes.',
      action: 'Ver historial',
      icon: 'fa-solid fa-envelope-open-text',
    },
    {
      title: 'Personal parroquial',
      description: 'Coordina con el equipo pastoral.',
      action: 'Contactar',
      icon: 'fa-solid fa-church',
    },
  ];
}
