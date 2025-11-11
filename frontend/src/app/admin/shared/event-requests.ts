import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export type Estado = 'aceptado' | 'denegado' | 'pendiente';

export interface SolicitudEvento {
  id: number;
  titulo: string;
  asunto: string;
  invitados: number;
  ubicacion: string;
  fecha: string;       
  hora: string;         
  horaFin?: string;     
  tipo: string;        
  enlaceVideo?: string; 
  portadaUrl?: string;  
  estado: Estado;       
  motivoDenegacion?: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventRequests {
  private readonly KEY = 'admin_event_requests';

  private _items = signal<SolicitudEvento[]>(this.load());
  readonly items = this._items.asReadonly(); // exposición de solo lectura

  add(item: Omit<SolicitudEvento, 'id' | 'createdAt' | 'estado'>) {
    const estado: Estado = 'pendiente';
    const id = Date.now();
    const createdAt = Date.now();
    const nuevo: SolicitudEvento = { ...item, id, createdAt, estado };
    const next = [nuevo, ...this._items()];
    this._items.set(next);
    this.persist(next);
  }

  // (Demo) actualizar estado/denegación si luego lo necesitas desde otro panel
  update(id: number, patch: Partial<SolicitudEvento>) {
    const next = this._items().map(e => e.id === id ? { ...e, ...patch } : e);
    this._items.set(next);
    this.persist(next);
  }

  private persist(data: SolicitudEvento[]) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }

  private load(): SolicitudEvento[] {
    try {
      const raw = localStorage.getItem(this.KEY);
      // Ordenamos por fecha de creación descendente al cargar
      const data: SolicitudEvento[] = raw ? JSON.parse(raw) : [];
      return data.sort((a, b) => b.createdAt - a.createdAt);
    } catch {
      return [];
    }
  }
}
