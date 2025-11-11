import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-recovery.html',
  styleUrl: './password-recovery.css'
})
export class PasswordRecoveryComponent {
  email: string = '';
  message: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (!this.email) {
      this.message = 'Por favor ingresa tu correo electrónico.';
      return;
    }

    this.isLoading = true;
    this.authService.recoverPassword(this.email).subscribe({
      next: (response) => {
        this.message = response.message || 'Si el correo existe, recibirás un enlace de recuperación.';
        this.isLoading = false;
      },
      error: (error) => {
        this.message = 'Error al enviar la solicitud. Intenta nuevamente.';
        this.isLoading = false;
        console.error('Error en recuperación:', error);
      }
    });
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}
