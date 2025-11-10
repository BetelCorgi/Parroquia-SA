import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './auth/login/login';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';
import { Register } from './auth/register/register';

import { adminRoutes } from './admin/admin.routes';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registrarse', component: Register },


  // Recuperación de clave
  { path: 'recuperar', component: ForgotPassword },
  { path: 'restablecer/:token', component: ResetPassword },

  // Panel Fieles
  { path: 'admin', children: adminRoutes },
  { path: '**', redirectTo: '' },
];