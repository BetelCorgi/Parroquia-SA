import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  // Variable para controlar la visibilidad del menú
  isMenuActive: boolean = false;

  // Constructor para inyectar Router si se necesita
  constructor(private router: Router) {}

  // Método para alternar el menú
  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  navigateHome() {
    // Lógica para navegar a la página principal
    this.router.navigate(['/']);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Cierra el menú hamburguesa si está abierto
      this.isMenuActive = false;
    }
  }

}
