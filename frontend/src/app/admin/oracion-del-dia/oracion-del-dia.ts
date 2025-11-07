import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface VerseResponse {
  reference: string;
  verses: {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }[];
  text: string;
  translation_id: string;
  translation_name: string;
}

interface CachedVerse {
  date: string;
  texto: string;
  referencia: string;
}

@Component({
  selector: 'app-oracion-del-dia',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './oracion-del-dia.html',
  styleUrl: './oracion-del-dia.css'
})
export class OracionDelDia {
  private readonly API_URL = 'https://bible-api.com/?random=verse&translation=rvg';
  private readonly CACHE_KEY = 'ORACION_DEL_DIA_CACHE_KEY';

  // Signals
  loading = signal(true);
  error = signal('');
  texto = signal('');
  referencia = signal('');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const todayStr = new Date().toISOString().split('T')[0];
    const cachedData = this.loadFromCache();

    if (cachedData && cachedData.date === todayStr) {
      // 2. Si encontramos caché de HOY, lo usamos.
      this.texto.set(cachedData.texto);
      this.referencia.set(cachedData.referencia);
      this.loading.set(false);
    } else {
      // 3. Si no hay caché o es de ayer, llamamos a la API
      this.fetchFromApi(todayStr);
    }
  }

  /**
   * Carga el versículo desde el localStorage
   */
  private loadFromCache(): CachedVerse | null {
    try {
      const rawData = localStorage.getItem(this.CACHE_KEY);
      if (rawData) {
        return JSON.parse(rawData) as CachedVerse;
      }
      return null;
    } catch (e) {
      console.error("Error al leer caché de oración", e);
      return null;
    }
  }

  /**
   * Llama a la NUEVA API (bible-api.com)
   */
  private fetchFromApi(todayStr: string) {
    this.loading.set(true);
    this.error.set('');

    this.http.get<VerseResponse>(this.API_URL).pipe(
      catchError(err => {
        console.error("Error al llamar a la API de la Biblia", err);
        this.error.set('No se pudo cargar la oración del día. Intente más tarde.');
        this.loading.set(false);
        return of(null); // Devuelve un observable nulo para que no falle
      })
    ).subscribe(data => {
      // Verificamos que data no sea null (por el catchError)
      if (!data || !data.verses || data.verses.length === 0) {
        // Manejo de error por si la API responde mal
        if (!this.error()) {
          this.error.set('La API no devolvió un versículo válido.');
        }
        this.loading.set(false);
        return;
      }

      const verseText = data.verses[0].text.trim().replace(/\n/g, ' ');
      const verseRef = data.reference;

      // Guardamos en el caché
      const cacheData: CachedVerse = {
        date: todayStr,
        texto: verseText,
        referencia: verseRef,
      };
      
      try {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      } catch (e) {
        console.error("Error al guardar en caché la oración", e);
      }

      // Actualizamos las signals para la vista
      this.texto.set(cacheData.texto);
      this.referencia.set(cacheData.referencia);
      this.loading.set(false);
    });
  }
}
