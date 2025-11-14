import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommunityService, ComunidadDto } from '../../services/community.service';

type RegisterFormGroup = {
  dni: FormControl<string>;
  nombre: FormControl<string>;
  apellido: FormControl<string>;
  email: FormControl<string>;
  telefono: FormControl<string | null>;
  fechaNacimiento: FormControl<string | null>;
  comunidadId: FormControl<number | null>;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  private readonly STORAGE_BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/parroquia-sa-1530d.firebasestorage.app/o/';
  private readonly STORAGE_BUCKET_SUFFIX = '?alt=media';

  public logoUrl: string = this.STORAGE_BUCKET_URL + 'logo.png' + this.STORAGE_BUCKET_SUFFIX;

  communities: ComunidadDto[] = [];
  isLoadingCommunities = false;
  isSubmitting = false;
  serverError = '';
  successMessage = '';

  form!: FormGroup<RegisterFormGroup>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private communityService: CommunityService,
    private router: Router
  ) {
    this.form = this.fb.group<RegisterFormGroup>({
      dni: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d{8}$/)]),
      nombre: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      apellido: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      telefono: this.fb.control<string | null>(null),
      fechaNacimiento: this.fb.control<string | null>(null),
      comunidadId: this.fb.control<number | null>(null)
    });
  }

  ngOnInit(): void {
    this.loadCommunities();
  }

  private loadCommunities(): void {
    this.isLoadingCommunities = true;
    this.communityService.getActiveCommunities()
      .pipe(finalize(() => this.isLoadingCommunities = false))
      .subscribe({
        next: (communities) => this.communities = communities ?? [],
        error: () => this.communities = []
      });
  }

  submit(): void {
    this.serverError = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload = {
      dni: value.dni,
      nombre: value.nombre,
      apellido: value.apellido,
      email: value.email,
      telefono: value.telefono || null,
      fechaNacimiento: value.fechaNacimiento || null,
      comunidadId: value.comunidadId
    };

    this.isSubmitting = true;
    this.authService.registerFiel(payload)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.successMessage = 'Registro completado. Revisa tu correo para confirmar tu cuenta.';
          this.form.reset();
          setTimeout(() => {
            this.router.navigate(['/login'], { queryParams: { registered: '1' } });
          }, 1200);
        },
        error: (error) => {
          const backendMessage = error?.error?.message || error?.error?.detalle;
          this.serverError = backendMessage || 'No pudimos completar el registro. Intentalo más tarde.';
        }
      });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
