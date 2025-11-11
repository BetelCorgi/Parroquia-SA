import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRecovery } from '../shared/auth-recovery';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  private readonly STORAGE_BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/parroquia-sa-1530d.firebasestorage.app/o/';
  private readonly STORAGE_BUCKET_SUFFIX = '?alt=media';

  public logoUrl: string = this.STORAGE_BUCKET_URL + 'logo.png' + this.STORAGE_BUCKET_SUFFIX;

  form: FormGroup;
  error = '';
  info  = '';

  constructor(
    private fb: FormBuilder,
    private recovery: AuthRecovery,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // DNI 8 dígitos
    });
  }

  submit() {
    this.error = '';
    this.info  = '';
    if (this.form.invalid) {
      this.error = 'Complete los campos correctamente.';
      this.form.markAllAsTouched();
      return;
    }

    const { email, dni } = this.form.value as { email: string; dni: string; };
    try {
      const token = this.recovery.requestRecovery(email, dni);
      this.info = 'Hemos enviado un enlace de recuperación a su correo. Redirigiendo...';
      setTimeout(() => this.router.navigate(['/restablecer', token]), 1200);
    } catch (e: any) {
      this.error = e?.message || 'No se pudo iniciar la recuperación.';
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
