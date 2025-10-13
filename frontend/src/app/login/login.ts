import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  showPass = false;
  email = '';
  password = '';
  errorMessage = '';

  // Credenciales simuladas
  private readonly adminEmail = 'admin@parroquia.pe';
  private readonly adminPassword = '12345';

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.email === this.adminEmail && this.password === this.adminPassword) {
      // ✅ Credenciales correctas, redirige al panel
      this.router.navigate(['/admin']);
    } else {
      // ❌ Credenciales incorrectas, muestra mensaje
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    }
  }
}
