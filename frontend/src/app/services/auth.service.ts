import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recover-password`, { email });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  registerFiel(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-fiel`, payload);
  }

  verifyEmail(token: string, passwords: { password: string; confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { token, ...passwords });
  }
}
