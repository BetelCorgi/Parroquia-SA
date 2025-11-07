import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './oracion-del-dia.html',
  styleUrl: './oracion-del-dia.css'
})
export class OracionDelDia {
  private readonly API_URL = 'https://bible-api.com/?random=verse&translation=rvg';
  private readonly CATHOLIC_API = (dateYMD: string) => `https://feed.evangelizo.org/v2/reader.php?date=${dateYMD}&type=json&lang=SP`;
  private readonly CORS_PROXY = (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  // Nueva API alternativa (wldeh/bible-api en Deno)
  private readonly WLD_BASE = 'https://bible-api.deno.dev';
  private readonly WLD_LANG = 'es';
  private readonly WLD_VERSION = 'RVR1960';
  private readonly CACHE_KEY = 'ORACION_DEL_DIA_CACHE_KEY_V2';
  private readonly LOCAL_PLAN_KEY = 'ORACION_DEL_DIA_PLAN_V1';
  private readonly ENABLE_NETWORK = false;

  // Signals
  loading = signal(true);
  error = signal('');
  texto = signal('');
  referencia = signal('');
  lecturas = signal<{ tipo: string; referencia: string; texto: string }[]>([]);
  editMode = signal(false);
  newRef = signal('');
  newText = signal('');

  // UI helpers
  today = new Date();
  private tips: string[] = [
    'Lee el versículo en voz alta y en silencio.',
    'Subraya una palabra que te llame la atención.',
    'Agradece a Dios por algo concreto hoy.',
    'Escribe una breve oración en una línea.',
    'Comparte este versículo con alguien que lo necesite.',
    'Detente 60 segundos y repítelo lentamente.',
    'Pon en práctica una acción pequeña inspirada en el texto.'
  ];

  get tipOfDay(): string {
    const days = Math.floor(this.today.getTime() / 86400000);
    return this.tips[days % this.tips.length];
  }

  // Corrige textos con tildes dañadas (mojibake) que puedan venir de almacenamiento previo
  fixEncoding(text: string | null | undefined): string {
    if (!text) return '';
    return text
      .replace(/Ã¡/g, 'á')
      .replace(/Ã©/g, 'é')
      .replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã±/g, 'ñ')
      .replace(/Ã/g, 'Á')
      .replace(/Ã/g, 'É')
      .replace(/Ã/g, 'Í')
      .replace(/Ã/g, 'Ó')
      .replace(/Ã/g, 'Ú')
      .replace(/Ã/g, 'Ñ')
      .replace(/dÃ­a/gi, 'día')
      .replace(/versÃ­culo/gi, 'versículo');
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const todayStr = new Date().toISOString().split('T')[0];
    const cachedData = this.loadFromCache();

    if (cachedData && cachedData.date === todayStr) {
      // 2. Si encontramos cachÃ© de HOY, lo usamos.
      this.texto.set(cachedData.texto);
      this.referencia.set(cachedData.referencia);
      this.lecturas.set([{ tipo: 'VersÃ­culo del dÃ­a', referencia: cachedData.referencia, texto: cachedData.texto }]);
      this.loading.set(false);
    } else {
      // 3. Si no hay cachÃ© o es de ayer, llamamos a la API
      const picked = this.pickFromLocalPlan(todayStr);
      if (picked) {
      this.applyAndCache(todayStr, picked.texto, picked.referencia);
      this.lecturas.set([{ tipo: 'Versículo del día', referencia: picked.referencia, texto: picked.texto }]);
      } else {
      this.error.set('Agrega lecturas locales o habilita red.');
      this.loading.set(false);
      }
    }
  }

  /**
   * Carga el versÃ­culo desde el localStorage
   */
  private loadFromCache(): CachedVerse | null {
    try {
      const rawData = localStorage.getItem(this.CACHE_KEY);
      if (rawData) {
        return JSON.parse(rawData) as CachedVerse;
      }
      return null;
    } catch (e) {
      console.error("Error al leer cachÃ© de oraciÃ³n", e);
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
        this.error.set('No se pudo cargar la oraciÃ³n del dÃ­a. Intente mÃ¡s tarde.');
        this.loading.set(false);
        return of(null); // Devuelve un observable nulo para que no falle
      })
    ).subscribe(data => {
      // Verificamos que data no sea null (por el catchError)
      if (!data || !data.verses || data.verses.length === 0) {
        // Manejo de error por si la API responde mal
        if (!this.error()) {
          this.error.set('La API no devolviÃ³ un versÃ­culo vÃ¡lido.');
        }
        this.loading.set(false);
        return;
      }

      const verseText = data.verses[0].text.trim().replace(/\n/g, ' ');
      const verseRef = data.reference;

      // Guardamos en el cachÃ©
      const cacheData: CachedVerse = {
        date: todayStr,
        texto: verseText,
        referencia: verseRef,
      };
      
      try {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      } catch (e) {
        console.error("Error al guardar en cachÃ© la oraciÃ³n", e);
      }

      // Actualizamos las signals para la vista
      this.texto.set(cacheData.texto);
      this.referencia.set(cacheData.referencia);
      this.lecturas.set([{ tipo: 'VersÃ­culo del dÃ­a', referencia: cacheData.referencia, texto: cacheData.texto }]);
      this.loading.set(false);
    });
  }

  /**
   * Intenta obtener la cita del dÃ­a desde Evangelizo (catÃ³lica).
   * Si falla (por CORS u otro error), usa la API existente como respaldo.
   */
  private fetchCatholicOrFallback(todayStr: string) {
    this.loading.set(true);
    this.error.set('');

    const dateYMD = todayStr.replace(/-/g, '');
    const url = this.CATHOLIC_API(dateYMD);

    this.http.get<any>(url).pipe(
      catchError(err => {
        console.warn('Fallo API catÃ³lica; usando respaldo', err);
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        const parsed = this.extractFromEvangelizo(data);
        if (parsed) {
          this.applyAndCache(todayStr, parsed.texto, parsed.referencia);
          return;
        }
      }
      // Respaldo: misma API previa
      this.fetchFromApi(todayStr);
    });
  }

  /**
   * Extrae cita y referencia del posible JSON de Evangelizo.
   */
  private extractFromEvangelizo(payload: any): { texto: string; referencia: string } | null {
    try {
      const pick = (obj: any) => {
        if (!obj) return null;
        const text = (obj.text || obj.content || obj.reading || '').toString();
        const ref = (obj.reference || obj.title || obj.short_title || '').toString();
        if (!text && !ref) return null;
        return { texto: text, referencia: ref };
      };

      let sel = pick(payload?.gospel) || pick(payload?.reading1) || pick(payload?.first_reading) || pick(payload?.psalm);
      if (!sel && Array.isArray(payload?.readings) && payload.readings.length) {
        sel = pick(payload.readings[0]);
      }
      if (!sel) return null;

      const clean = sel.texto.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const preview = clean.length > 240 ? clean.slice(0, 240) + 'â€¦' : clean;
      const ref = sel.referencia || 'Lecturas del dÃ­a';
      return { texto: preview, referencia: ref };
    } catch {
      return null;
    }
  }

  private applyAndCache(dateStr: string, texto: string, referencia: string) {
    const cacheData: CachedVerse = { date: dateStr, texto, referencia };
    try { localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData)); } catch {}
    this.texto.set(texto);
    this.referencia.set(referencia);
    this.loading.set(false);
  }

  // Nueva versiÃ³n con proxy CORS y mÃºltiples lecturas
  private fetchCatholicOrFallback2(todayStr: string) {
    this.loading.set(true);
    this.error.set('');

    const dateYMD = todayStr.replace(/-/g, '');
    const url = this.CATHOLIC_API(dateYMD);

    const handle = (data: any) => {
      if (data) {
        const list = this.extractEvangelizoAll(data);
        if (list.length) {
          this.lecturas.set(list);
          const first = list[0];
          this.applyAndCache(todayStr, first.texto, first.referencia);
          return true;
        }
      }
      return false;
    };

    // 1) Proxy CORS
    this.http.get<any>(this.CORS_PROXY(url)).pipe(catchError(() => of(null))).subscribe(proxy => {
      if (handle(proxy)) return;
      // 2) Directo
      this.http.get<any>(url).pipe(catchError(() => of(null))).subscribe(dir => {
        if (handle(dir)) return;
        // 3) Intento con wldeh/bible-api
        this.fetchFromWldeh(todayStr, (ok) => {
          if (!ok) {
            // 4) Respaldo final
            this.fetchFromApi(todayStr);
          }
        });
      });
    });
  }

  private extractEvangelizoAll(payload: any): { tipo: string; referencia: string; texto: string }[] {
    const items: { tipo: string; referencia: string; texto: string }[] = [];
    const push = (tipo: string, obj: any) => {
      if (!obj) return;
      const ref = (obj.reference || obj.title || obj.short_title || '').toString();
      const text = (obj.text || obj.content || obj.reading || '').toString();
      const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (!ref && !clean) return;
      const preview = clean.length > 280 ? clean.slice(0, 280) + 'â€¦' : clean;
      items.push({ tipo, referencia: ref || tipo, texto: preview });
    };

    try {
      push('Primera lectura', payload?.reading1 || payload?.first_reading);
      push('Salmo', payload?.psalm);
      push('Evangelio', payload?.gospel);
      if (!items.length && Array.isArray(payload?.readings)) {
        for (const r of payload.readings) push('Lectura', r);
      }
    } catch {}
    return items;
  }

  // Consume la API de wldeh/bible-api para un versÃ­culo aleatorio en espaÃ±ol
  private fetchFromWldeh(todayStr: string, done: (ok: boolean) => void) {
    const url = `${this.WLD_BASE}/api/verses/${this.WLD_LANG}/${this.WLD_VERSION}/random`;
    this.http.get<any>(url).pipe(catchError(() => of(null))).subscribe(res => {
      if (!res) { done(false); return; }
      try {
        let text = '';
        let ref = '';
        if (Array.isArray(res.verses) && res.verses.length) {
          const v = res.verses[0];
          text = (v.text || '').toString().trim();
          const book = v.book_name || v.book || '';
          const chap = v.chapter || v.chapter_id || '';
          const ver = v.verse || v.verse_id || '';
          ref = res.reference || `${book} ${chap}:${ver}`;
        } else {
          text = (res.text || res.content || '').toString().trim();
          ref = res.reference || res.ref || '';
        }
        if (!text) { done(false); return; }
        const clean = text.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
        const preview = clean.length > 280 ? clean.slice(0, 280) + 'â€¦' : clean;
        const referencia = ref || 'VersÃ­culo del dÃ­a';
        this.lecturas.set([{ tipo: 'VersÃ­culo del dÃ­a', referencia, texto: preview }]);
        this.applyAndCache(todayStr, preview, referencia);
        done(true);
      } catch {
        done(false);
      }
    });
  }
  // ====== Plan local (sin APIs) ======
  private defaultPlan(): { referencia: string; texto: string }[] {
    return [
      { referencia: 'Juan 3:16', texto: 'Porque de tal manera amo Dios al mundo, que ha dado a su Hijo unigenito, para que todo aquel que en el cree no se pierda, mas tenga vida eterna.' },
      { referencia: 'Salmo 23:1', texto: 'Jehova es mi pastor; nada me faltara.' },
      { referencia: 'Filipenses 4:13', texto: 'Todo lo puedo en Cristo que me fortalece.' },
      { referencia: 'Mateo 5:9', texto: 'Bienaventurados los pacificadores, porque ellos seran llamados hijos de Dios.' },
      { referencia: 'Romanos 12:12', texto: 'Gozosos en la esperanza; sufridos en la tribulacion; constantes en la oracion.' },
      { referencia: 'Salmo 27:1', texto: 'Jehova es mi luz y mi salvacion; de quien temere?' },
      { referencia: '1 Corintios 13:13', texto: 'Y ahora permanecen la fe, la esperanza y el amor; pero el mayor de ellos es el amor.' }
    ];
  }

  private loadPlan(): { referencia: string; texto: string; date?: string }[] {
    try {
      const raw = localStorage.getItem(this.LOCAL_PLAN_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch {}
    return this.defaultPlan();
  }

  private savePlan(plan: { referencia: string; texto: string; date?: string }[]) {
    try { localStorage.setItem(this.LOCAL_PLAN_KEY, JSON.stringify(plan)); } catch {}
  }

  private pickFromLocalPlan(todayStr: string): { referencia: string; texto: string } | null {
    const plan = this.loadPlan();
    if (!plan.length) return null;
    const dated = plan.find(p => (p as any).date === todayStr);
    if (dated) return { referencia: dated.referencia, texto: dated.texto };
    const daysSinceEpoch = Math.floor(new Date(todayStr).getTime() / 86400000);
    const idx = daysSinceEpoch % plan.length;
    const pick = plan[idx];
    return { referencia: pick.referencia, texto: pick.texto };
  }

  toggleEditMode() {
    this.editMode.set(!this.editMode());
  }

  addLocalReading() {
    const referencia = this.newRef().trim();
    const texto = this.newText().trim();
    if (!referencia || !texto) return;
    const plan = this.loadPlan();
    plan.push({ referencia, texto });
    this.savePlan(plan);
    this.newRef.set('');
    this.newText.set('');
  }
}
