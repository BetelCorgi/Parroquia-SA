import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

interface VerifyForm {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail implements OnInit {

  private readonly STORAGE_BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/parroquia-sa-1530d.firebasestorage.app/o/';
  private readonly STORAGE_BUCKET_SUFFIX = '?alt=media';

  public logoUrl: string = this.STORAGE_BUCKET_URL + 'logo.png' + this.STORAGE_BUCKET_SUFFIX;

  form!: FormGroup<VerifyForm>;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  serverError = signal('');
  successMessage = signal('');
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group<VerifyForm>({
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: this.fb.nonNullable.control('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        this.serverError.set('El enlace de verificación no es válido o ha expirado.');
        this.form.disable();
      }
    });
  }

  submit(): void {
    this.serverError.set('');
    this.successMessage.set('');

    if (!this.token) {
      this.serverError.set('El token de verificación no fue proporcionado.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.serverError.set('Las contraseñas no coinciden.');
      return;
    }

    this.isSubmitting = true;
    this.authService.verifyEmail(this.token, { password, confirmPassword })
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.successMessage.set('¡Correo verificado! Ahora puedes iniciar sesión.');
          this.form.reset();
          setTimeout(() => this.router.navigate(['/login']), 1400);
        },
        error: (error) => {
          const backendMessage = error?.error?.message || error?.error?.detalle;
          this.serverError.set(backendMessage || 'No pudimos verificar tu correo. Intenta nuevamente.');
        }
      });
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
