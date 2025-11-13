import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './auth/login/login';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';
import { Register } from './auth/register/register';
import { VerifyEmail } from './auth/verify-email/verify-email';

import { adminRoutes } from './admin/admin.routes';
import { fielRoutes } from './fiel/fiel.routes';
import { AdminGuard } from './auth/admin.guard';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'admin/login', component: Login, data: { admin: true } },
  { path: 'registrarse', component: Register },
  { path: 'verify-email', component: VerifyEmail },


  // Recuperación de clave
  { path: 'recuperar', component: ForgotPassword },
  { path: 'restablecer/:token', component: ResetPassword },

  // Panel administrador
  {
    path: 'admin',
    canActivate: [AdminGuard],
    canMatch: [AdminGuard],
    children: fielRoutes,
  },
  {
    path: 'panel',
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
    children: adminRoutes,
  },
  { path: '**', redirectTo: '' },
];