import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private readonly STORAGE_BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/parroquia-sa-1530d.firebasestorage.app/o/';
  private readonly STORAGE_BUCKET_SUFFIX = '?alt=media';

  // URL del logo construida para el template
  public logoUrl: string = this.STORAGE_BUCKET_URL + 'logo.png' + this.STORAGE_BUCKET_SUFFIX;
  
  showPass = false;
  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;
  isAdminLogin = false;
  returnUrl = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.isAdminLogin = !!data['admin'];
    });

    this.route.queryParamMap.subscribe(params => {
      this.returnUrl = params.get('returnUrl') ?? '';
    });
  }

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
          const role = (response?.rol ?? '').toLowerCase();

          if (this.isAdminLogin && role !== 'administrador') {
            this.errorMessage = 'Tu cuenta no tiene permisos de administrador.';
            this.password = '';
            this.clearStoredCredentials();
            return;
          }

          const sessionRole = role || (this.isAdminLogin ? 'administrador' : 'fiel');

          localStorage.setItem('authToken', response?.token ?? '');
          localStorage.setItem('authEmail', response?.email ?? this.email);
          localStorage.setItem('authRole', sessionRole);

          const fallbackTarget = sessionRole === 'administrador' ? '/admin' : '/panel/resumen';
          const target = this.returnUrl || fallbackTarget;
          this.router.navigate([target], { replaceUrl: true });
        },
        error: (error) => {
          const backendMessage = error?.error?.message || error?.error?.detalle;
          this.errorMessage = backendMessage || 'Usuario o contraseña incorrectos.';
          this.clearStoredCredentials();
        }
      });
  }

  private clearStoredCredentials(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authRole');
  }
}
