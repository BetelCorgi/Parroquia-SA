import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanMatch {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(state.url || '/panel/resumen');
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    const url = '/' + segments.map(segment => segment.path).join('/');
    return this.checkAccess(url || '/panel/resumen');
  }

  private checkAccess(redirectUrl: string): boolean {
    const token = localStorage.getItem('authToken');
    const role = (localStorage.getItem('authRole') || '').toLowerCase();

    if (token) {
      if (role === 'administrador') {
        this.router.navigate(['/admin'], { replaceUrl: true });
        return false;
      }
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: redirectUrl || '/panel/resumen' },
      replaceUrl: true,
    });
    return false;
  }
}
