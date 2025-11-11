import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { AuthRecovery } from '../shared/auth-recovery';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  token = '';
  error = '';
  success = '';
  form: FormGroup; // Declarar la propiedad sin inicializar
  f: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recovery: AuthRecovery
  ) {
    this.form = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.hasUppercase(),
            this.hasLowercase(),
            this.hasNumber(),
            this.hasSpecial(),
          ],
        ],
        confirm: ['', Validators.required],
      },
      { validators: [this.passwordsMatch()] }
    );
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (!this.token || !this.recovery.isValidToken(this.token)) {
      this.error = 'Enlace inválido o caducado.';
    }
  }

  // Validadores personalizados
  hasUppercase(): boolean {
    return /[A-Z]/.test(this.f.password.value || '');
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.f.password.value || '');
  }

  hasNumber(): boolean {
    return /\d/.test(this.f.password.value || '');
  }

  hasSpecial(): boolean {
    return /[^A-Za-z0-9]/.test(this.f.password.value || '');
  }
  private passwordsMatch() {
    return (group: AbstractControl): ValidationErrors | null => {
      const p = group.get('password')?.value;
      const c = group.get('confirm')?.value;
      return p === c ? null : { mismatch: true };
    };
  }

  submit() {
    this.error = '';
    this.success = '';

    if (!this.token || !this.recovery.isValidToken(this.token)) {
      this.error = 'Enlace inválido o caducado.';
      return;
    }
    if (this.form.invalid) {
      this.error = 'Revise los requisitos de la nueva contraseña.';
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.recovery.updatePassword(this.token, this.f.password.value!);
      this.success = 'Contraseña actualizada correctamente.';
      // Redirigir al login en 1.2s
      setTimeout(() => this.router.navigate(['/login']), 1200);
    } catch (e: any) {
      this.error = e?.message || 'No se pudo actualizar la contraseña.';
    }
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
