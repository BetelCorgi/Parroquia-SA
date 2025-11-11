import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Notificaciones } from './notificaciones/notificaciones';
import { SolicitarEventos } from './solicitar-eventos/solicitar-eventos';
import { EventosProgramados } from './eventos-programados/eventos-programados';
import { OracionDelDia } from './oracion-del-dia/oracion-del-dia';
import { PersonasComunidad } from './personal-comunidad/personal-comunidad';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'notificaciones', component: Notificaciones },
      { path: 'solicitar-eventos', component: SolicitarEventos },
      { path: 'eventos-programados', component: EventosProgramados },
      { path: 'oracion-del-dia', component: OracionDelDia },
      { path: 'personas-comunidad', component: PersonasComunidad },
    ],
  },
];
