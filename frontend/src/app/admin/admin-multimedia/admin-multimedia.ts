// admin-multimedia.component.ts
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

interface RedSocial {
  id: number;
  url: string;
  tipo: 'youtube' | 'facebook' | 'instagram' | 'twitter' | 'otros';
}

interface Personal {
  id: number;
  nombre: string;
  cargo: string;
  foto: string;
  telefono: string;
  email: string;
}

@Component({
  selector: 'app-admin-multimedia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './admin-multimedia.html',
  styleUrls: ['./admin-multimedia.css'], // ✅ debe ser styleUrls (plural)
})
export class AdminMultimedia implements OnDestroy {
  video = {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    frameInicio: '0:01',
    frameFinal: '0:01',
  };

  redes: RedSocial[] = [
    { id: 1, url: 'youtube.com/@parroquia', tipo: 'youtube' },
    { id: 2, url: 'facebook.com/parroquia', tipo: 'facebook' },
  ];

  mapa = {
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.714832421517!2d-79.8951593!3d-6.8045034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904cef8d6f9e692f%3A0xa040d415a83f36b4!2sParroquia%20San%20Agust%C3%ADn%20de%20Hipona%20-%20Orden%20de%20San%20Agust%C3%ADn%2C%20Diocesis%20de%20Chiclayo!5e0!3m2!1ses-419!2spe!4v1759720541992!5m2!1ses-419!2spe',
  };

  personal: Personal[] = [
    {
      id: 1,
      nombre: 'Padre José García',
      cargo: 'Párroco',
      foto: '',
      telefono: '123-456-7890',
      email: 'padre@parroquia.com',
    },
    {
      id: 2,
      nombre: 'Hermana María López',
      cargo: 'Catequista',
      foto: '',
      telefono: '123-456-7891',
      email: 'maria@parroquia.com',
    },
  ];

  mostrarFormPersonal = false;
  nuevoPersonal: Partial<Personal> = {
    nombre: '',
    cargo: '',
    telefono: '',
    email: '',
  };

  currentUrl = '';
  private sub!: Subscription;

  constructor(private router: Router, private sanitizer: DomSanitizer) {
    // Escucha cambios de ruta para resaltar activo
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentUrl = e.urlAfterRedirects || e.url;
      });
  }

  ngOnDestroy() {
    // Evitar fugas de memoria
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  obtenerVideoEmbedUrl(): SafeResourceUrl {
    let embedUrl = this.video.url;

    if (embedUrl.includes('youtube.com/watch?v=')) {
      const videoId = embedUrl.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (embedUrl.includes('youtu.be/')) {
      const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (!embedUrl.includes('youtube.com/embed/')) {
      embedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  obtenerMapaEmbedUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.mapa.url);
  }

  detectarRedSocial(url: string): 'youtube' | 'facebook' | 'instagram' | 'twitter' | 'otros' {
    if (url.includes('youtube')) return 'youtube';
    if (url.includes('facebook')) return 'facebook';
    if (url.includes('instagram')) return 'instagram';
    if (url.includes('twitter') || url.includes('x.com')) return 'twitter';
    return 'otros';
  }

  agregarRed() {
    const nuevaRed: RedSocial = {
      id: Date.now(),
      url: '',
      tipo: 'otros',
    };
    this.redes.push(nuevaRed);
  }

  actualizarRed(id: number, url: string) {
    const tipo = this.detectarRedSocial(url);
    const index = this.redes.findIndex((red) => red.id === id);
    if (index !== -1) {
      this.redes[index] = { ...this.redes[index], url, tipo };
    }
  }

  eliminarRed(id: number) {
    this.redes = this.redes.filter((red) => red.id !== id);
  }

  agregarPersonal() {
    if (this.nuevoPersonal.nombre && this.nuevoPersonal.cargo) {
      const persona: Personal = {
        id: Date.now(),
        nombre: this.nuevoPersonal.nombre!,
        cargo: this.nuevoPersonal.cargo!,
        telefono: this.nuevoPersonal.telefono || '',
        email: this.nuevoPersonal.email || '',
        foto: '',
      };
      this.personal.push(persona);
      this.nuevoPersonal = { nombre: '', cargo: '', telefono: '', email: '' };
      this.mostrarFormPersonal = false;
    }
  }

  eliminarPersonal(id: number) {
    this.personal = this.personal.filter((p) => p.id !== id);
  }

  guardarTodo() {
    console.log('Video:', this.video);
    console.log('Redes:', this.redes);
    console.log('Mapa:', this.mapa);
    console.log('Personal:', this.personal);
    alert('✅ Todos los cambios han sido guardados correctamente');
  }

  irABoletines() {
    console.log('Ir a boletines');
    this.router.navigate(['/admin/avisos']);
  }

  irAGaleria() {
    console.log('Ir a galería');
    this.router.navigate(['/admin/galeria-publica']);
  }

  irAAdministrarPersonal() {
    console.log('Ir a administrar personal');
    this.router.navigate(['/admin/personal']);
  }
}
