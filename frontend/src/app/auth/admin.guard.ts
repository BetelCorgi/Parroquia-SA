import { Injectable } from '@angular/core';
import { CanActivate, CanMatch, Router, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate, CanMatch {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(state.url || '/admin');
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    const url = '/' + segments.map(segment => segment.path).join('/');
    return this.checkAccess(url || '/admin');
  }

  private checkAccess(redirectUrl: string): boolean {
    const token = localStorage.getItem('authToken');
    const role = (localStorage.getItem('authRole') || '').toLowerCase();

    if (token && role === 'administrador') {
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: redirectUrl || '/admin' },
      replaceUrl: true,
    });
    return false;
  }
}
