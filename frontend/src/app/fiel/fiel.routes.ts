import { Routes } from '@angular/router';
import { FielLayout } from './fiel-layout/fiel-layout';
import { FielResumen } from './resumen/resumen';
import { FielEdicion } from './edicion/edicion';
import { FielBoletines } from './boletines/boletines';
import { FielAjustes } from './ajustes/ajustes';

export const fielRoutes: Routes = [
  {
    path: '',
    component: FielLayout,
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', component: FielResumen },
      { path: 'edicion', component: FielEdicion },
      { path: 'boletines', component: FielBoletines },
      { path: 'ajustes', component: FielAjustes },
    ],
  },
];
