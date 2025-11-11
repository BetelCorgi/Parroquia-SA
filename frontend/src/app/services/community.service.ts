import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ComunidadDto {
  idComunidad: number;
  nombre: string;
  tipo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private readonly apiUrl = 'http://localhost:8080/api/comunidades';

  constructor(private http: HttpClient) {}

  getActiveCommunities(): Observable<ComunidadDto[]> {
    return this.http.get<ComunidadDto[]>(this.apiUrl);
  }
}
