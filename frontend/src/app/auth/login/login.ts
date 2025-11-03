import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  // Credenciales simuladas
  private readonly adminEmail = 'admin@parroquia.pe';
  private readonly adminPassword = '12345';

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.email === this.adminEmail && this.password === this.adminPassword) {
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    }
  }
}
