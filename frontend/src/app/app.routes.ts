import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { adminRoutes } from './admin/admin.routes';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'admin', children: adminRoutes },
  { path: '**', redirectTo: '' },
];