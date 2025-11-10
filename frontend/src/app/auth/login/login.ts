import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly STORAGE_BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/parroquia-sa-1530d.firebasestorage.app/o/';
  private readonly STORAGE_BUCKET_SUFFIX = '?alt=media';

  // URL del logo construida para el template
  public logoUrl: string = this.STORAGE_BUCKET_URL + 'logo.png' + this.STORAGE_BUCKET_SUFFIX;
  
  showPass = false;
  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goHome() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Debes ingresar tu usuario y contraseña.';
      return;
    }

    this.isSubmitting = true;
    this.authService.login({ email: this.email, password: this.password })
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (response) => {
          localStorage.setItem('authToken', response?.token ?? '');
          localStorage.setItem('authEmail', response?.email ?? this.email);
          localStorage.setItem('authRole', response?.rol ?? '');

          if ((response?.rol ?? '').toLowerCase() === 'administrador') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          const backendMessage = error?.error?.message || error?.error?.detalle;
          this.errorMessage = backendMessage || 'Usuario o contraseña incorrectos.';
        }
      });
  }
}
