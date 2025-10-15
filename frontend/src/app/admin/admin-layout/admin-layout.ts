import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnDestroy {
  isSidebarOpen = false;
  currentUrl = '/admin';
  private sub: Subscription;

  constructor(private router: Router) {
    // Escucha cambios de ruta para resaltar activo
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.currentUrl = e.urlAfterRedirects || e.url;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // Toggle del menú (true/false para forzar, sin arg para alternar)
  toggleSidebar(force?: boolean) {
    this.isSidebarOpen = typeof force === 'boolean' ? force : !this.isSidebarOpen;
  }

  // Navegación por funciones
  goDashboard() {
    this.router.navigate(['/admin']).then(() => this.toggleSidebar(false));
  }
  goAvisos() {
    this.router.navigate(['/admin/avisos']).then(() => this.toggleSidebar(false));
  }
  goSolicitarEventos() {
    this.router.navigate(['/admin/solicitar-eventos']).then(() => this.toggleSidebar(false));
  }
  goEventosProgramados() {
    this.router.navigate(['/admin/eventos-programados']).then(() => this.toggleSidebar(false));
  }
  goOracionDelDia() {
    this.router.navigate(['/admin/oracion-del-dia']).then(() => this.toggleSidebar(false));
  }
  goSite() {
    this.router.navigate(['/']).then(() => this.toggleSidebar(false));
  }

  // Cerrar sesión
  logout() {
    // Si en el futuro guardas token: localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }

  // Helpers para 'activo'
  isActive(path: string): boolean {
    // coincide exacto para dashboard, e incluye para hijos
    if (path === '/admin') return this.currentUrl === '/admin';
    return this.currentUrl.startsWith(path);
  }
}
