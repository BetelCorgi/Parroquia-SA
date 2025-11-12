import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-fiel-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './fiel-layout.html',
  styleUrl: './fiel-layout.css',
})
export class FielLayout implements OnDestroy {
  private readonly STORAGE_BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/parroquia-sa-1530d.firebasestorage.app/o/';
  private readonly STORAGE_BUCKET_SUFFIX = '?alt=media';
  public logoUrl: string = this.STORAGE_BUCKET_URL + 'logo.png' + this.STORAGE_BUCKET_SUFFIX;

  navItems: NavItem[] = [
    { label: 'Resumen', icon: 'fa-solid fa-chart-simple', route: '/panel/resumen' },
    { label: 'Edición', icon: 'fa-solid fa-pen-to-square', route: '/panel/edicion' },
    { label: 'Boletines', icon: 'fa-solid fa-envelope-open-text', route: '/panel/boletines' },
    { label: 'Ajustes', icon: 'fa-solid fa-gear', route: '/panel/ajustes' },
  ];

  currentUrl = '/panel/resumen';
  private sub: Subscription;

  constructor(private router: Router) {
    this.sub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentUrl = event.urlAfterRedirects || event.url;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  isActive(route: string): boolean {
    return this.currentUrl.startsWith(route);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authRole');
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
