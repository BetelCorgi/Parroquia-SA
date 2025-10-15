
import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AvisosRecientes } from './avisos-recientes/avisos-recientes';
import { SolicitarEventos } from './solicitar-eventos/solicitar-eventos';
import { EventosProgramados } from './eventos-programados/eventos-programados';
import { OracionDelDia } from './oracion-del-dia/oracion-del-dia';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'avisos', component: AvisosRecientes },
      { path: 'solicitar-eventos', component: SolicitarEventos },
      { path: 'eventos-programados', component: EventosProgramados },
      { path: 'oracion-del-dia', component: OracionDelDia },
    ]
  }
];
