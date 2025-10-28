import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRecovery } from '../shared/auth-recovery';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
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
      // En un sistema real, aquí se enviaría el correo con el link:
      // https://tusitio/restablecer/<token>
      // Mostramos un aviso y redirigimos automáticamente
      this.info = 'Hemos enviado un enlace de recuperación a su correo. Redirigiendo...';
      setTimeout(() => this.router.navigate(['/restablecer', token]), 1200);
    } catch (e: any) {
      this.error = e?.message || 'No se pudo iniciar la recuperación.';
    }
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
