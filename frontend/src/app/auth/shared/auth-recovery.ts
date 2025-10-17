import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthRecovery {
  private readonly TOKENS_KEY = 'recoveryTokens'; // localStorage map {token: email}

  // Simula pedir recuperación: valida campos, crea token y lo guarda
  requestRecovery(email: string, dni: string): string {
    // Aquí podrías validar formato de DNI (lo básico)
    if (!email || !dni) throw new Error('Datos incompletos');

    const token = this.generateToken();
    const map = this.readMap();
    map[token] = JSON.stringify({ email, dni, createdAt: Date.now() });
    this.writeMap(map);
    return token;
  }

  // Valida si el token existe (y puedes agregar expiración si quieres)
  isValidToken(token: string): boolean {
    const map = this.readMap();
    return !!map[token];
  }

  // “Actualiza” la clave: en demo solo elimina el token
  updatePassword(token: string, newPassword: string): void {
    const map = this.readMap();
    if (!map[token]) throw new Error('Token inválido o caducado');
    // Aquí guardarías password real en backend; en demo, solo limpieza:
    delete map[token];
    this.writeMap(map);
  }

  // Helpers
  private generateToken(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  private readMap(): Record<string, string> {
    try {
      return JSON.parse(localStorage.getItem(this.TOKENS_KEY) || '{}');
    } catch { return {}; }
  }
  private writeMap(map: Record<string, string>) {
    localStorage.setItem(this.TOKENS_KEY, JSON.stringify(map));
  }
}
