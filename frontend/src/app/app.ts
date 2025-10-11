import { Component } from '@angular/core';
import { Header } from './header/header';
import { Footer } from "./footer/footer";
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url.includes('/login');
    });
  }
}
