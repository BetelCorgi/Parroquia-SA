import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  { path: '**', redirectTo: '' },
];