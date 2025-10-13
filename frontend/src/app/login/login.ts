import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  showPass = false;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
