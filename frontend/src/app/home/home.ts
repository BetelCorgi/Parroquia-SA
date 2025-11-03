import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  
  readonly STORAGE_BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/parroquia-sa-1530d.firebasestorage.app/o/';
  readonly STORAGE_BUCKET_SUFFIX = '?alt=media';

  // --- EVENTOS --- //
  eventos = [
    {
      imagen: this.STORAGE_BUCKET_URL + 'evento1.jpg' + this.STORAGE_BUCKET_SUFFIX,
      subtitulo: 'Convocatorias',
      titulo: 'Apostolado',
      descripcion:
        'Nuestra parroquia recolecta las donaciones obtenidas, asi como el apoyo a diversos eventos caritativos.',
    },
    {
      imagen: this.STORAGE_BUCKET_URL + 'evento2.jpg' + this.STORAGE_BUCKET_SUFFIX,
      subtitulo: 'Charlas',
      titulo: 'En Vivo',
      descripcion: 'Desarrollamos charlas de diversos temas, de forma virtual o presencial.',
    },
    {
      imagen: this.STORAGE_BUCKET_URL + 'evento3.jpg' + this.STORAGE_BUCKET_SUFFIX,
      subtitulo: 'Retiros de Comunión',
      titulo: 'Retiros',
      descripcion:
        'Movimiento espiritual hecho para padres de familia bajo la iniciativa de frailes y laicos de la provincia Nuestra Señora de Gracia del Perú.',
    },
  ];

  currentIndex = 0;
  private gap = 20;
  eventosTransform = 'translateX(0px)';

  // Lógica para ir al slide anterior
  prevSlide() {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
    this.updateCarousel();
  }

  // Lógica para ir al siguiente slide
  nextSlide() {
    const cardsPerView = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = this.eventos.length - cardsPerView;
    this.currentIndex = Math.min(this.currentIndex + 1, maxIndex);
    this.updateCarousel();
  }

  // Lógica para actualizar el carrusel
  updateCarousel() {
    const cardWidth = this.calculateCardWidth('.carousel', '.event-card');
    if (cardWidth === 0) return;
    const offset = this.currentIndex * (cardWidth + this.gap);
    this.eventosTransform = `translateX(-${offset}px)`;
  }

  // --- IMAGEN SOBRE NOSOTROS ---
  sobreNosotrosImagen: string =this.STORAGE_BUCKET_URL + 'parroquia.jpg' + this.STORAGE_BUCKET_SUFFIX;

  // --- FRAILES --- //
  frailes = [
    {
      imagen: this.STORAGE_BUCKET_URL + 'fraile1.jpg' + this.STORAGE_BUCKET_SUFFIX,
      nombre: 'Fr. Juan Pérez, O.S.A.',
      cargo: 'Párroco',
      descripcion: 'Acompaña la pastoral parroquial y la animación de grupos de servicio.',
    },
    {
      imagen: this.STORAGE_BUCKET_URL + 'fraile2.jpg' + this.STORAGE_BUCKET_SUFFIX,
      nombre: 'Fr. Miguel López, O.S.A.',
      cargo: 'Vicario Parroquial',
      descripcion: 'Responsable de catequesis familiar y formación de jóvenes.',
    },
    {
      imagen: this.STORAGE_BUCKET_URL + 'fraile3.jpg' + this.STORAGE_BUCKET_SUFFIX,
      nombre: 'Fr. Carlos Medina, O.S.A.',
      cargo: 'Vicario Parroquial',
      descripcion: 'Coordina la acción social y actividades de caridad.',
    },
    {
      imagen: this.STORAGE_BUCKET_URL + 'fraile3.jpg' + this.STORAGE_BUCKET_SUFFIX,
      nombre: 'Fr. Carlos Medina, O.S.A.',
      cargo: 'Vicario Parroquial',
      descripcion: 'Coordina la acción social y actividades de caridad.',
    },
  ];

  frailesIndex = 0;
  frailesTransform = 'translateX(0px)';

  private frailesCardsPerView(): number {
    return window.innerWidth <= 768 ? 1 : 3;
  }
  private frailesMaxIndex(): number {
    return Math.max(this.frailes.length - this.frailesCardsPerView(), 0);
  }

  prevFraile() {
    this.frailesIndex = Math.max(this.frailesIndex - 1, 0);
    this.updateFrailesCarousel();
  }
  nextFraile() {
    this.frailesIndex = Math.min(this.frailesIndex + 1, this.frailesMaxIndex());
    this.updateFrailesCarousel();
  }

  updateFrailesCarousel() {
    const cardWidth = this.calculateCardWidth('.frailes-carousel', '.fraile-card');
    if (cardWidth === 0) return;
    const offset = this.frailesIndex * (cardWidth + this.gap);
    this.frailesTransform = `translateX(-${offset}px)`;
  }

  // --- GALERÍA ---
  galeria = [
    {
      src: this.STORAGE_BUCKET_URL + 'gal1.jpg' + this.STORAGE_BUCKET_SUFFIX,
      alt: 'Actividad parroquial 1',
      titulo: 'Jornada de Jóvenes',
      descripcion: 'Nuestra última jornada de jóvenes reunió a más de 50 participantes para un día de reflexión y comunidad.'
    },
    {
      src: this.STORAGE_BUCKET_URL + 'gal2.jpg' + this.STORAGE_BUCKET_SUFFIX,
      alt: 'Actividad parroquial 2',
      titulo: 'Retiro de Emaús',
      descripcion: 'El retiro de Emaús fue un encuentro transformador para los hombres de nuestra parroquia.'
    },
    {
      src: this.STORAGE_BUCKET_URL + 'gal3.jpg' + this.STORAGE_BUCKET_SUFFIX,
      alt: 'Actividad parroquial 3',
      titulo: 'Confirmaciones 2025',
      descripcion: 'Celebración del sacramento de la Confirmación, presidida por nuestro Obispo.'
    },
    {
      src: this.STORAGE_BUCKET_URL + 'gal4.jpg' + this.STORAGE_BUCKET_SUFFIX,
      alt: 'Actividad parroquial 4',
      titulo: 'Navidad Solidaria',
      descripcion: 'Repartiendo sonrisas y ayuda a las familias más necesitadas de nuestra comunidad.'
    },
    {
      src: this.STORAGE_BUCKET_URL + 'gal5.jpg' + this.STORAGE_BUCKET_SUFFIX,
      alt: 'Actividad parroquial 5',
      titulo: 'Procesión del Corpus Christi',
      descripcion: 'Recorriendo las calles de Pimentel con fe y devoción en la solemnidad del Corpus Christi.'
    },
  ];

  galleryIndex = 0;
  galleryTransform = 'translateX(0px)';
  private galleryGap = 20;
  private galleryInterval: any = null;
  private autoplayMs = 3000;
  lightboxOpen = false;

  ngOnInit() {
    setTimeout(() => {
      this.updateGalleryTransform();
      this.updateCarousel();
      this.updateFrailesCarousel();
      this.startAutoplay();
    }, 100);
  }

  ngOnDestroy() {
    this.clearAutoplay();
  }

  // --- Lógica de Autoplay de Galería ---
  private startAutoplay() {
    this.clearAutoplay();
    this.galleryInterval = setInterval(() => {
      // Bucle infinito tipo "mundo"
      this.galleryIndex = (this.galleryIndex + 1) % this.galeria.length;
      this.updateGalleryTransform();
    }, this.autoplayMs);
  }
  private clearAutoplay() {
    if (this.galleryInterval) {
      clearInterval(this.galleryInterval);
      this.galleryInterval = null;
    }
  }
  pauseGallery() {
    this.clearAutoplay();
  }
  resumeGallery() {
    this.startAutoplay();
  }

  // --- Lógica de Navegación de Galería ---
  goToGallery(i: number) {
    this.galleryIndex = i;
    this.updateGalleryTransform();
  }

  updateGalleryTransform() {
    const track = document.querySelector('.galeria-carousel') as HTMLElement;
    if (!track) return;
    const card = track.querySelector('.galeria-card') as HTMLElement;
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const container = document.querySelector('.galeria-carousel-container') as HTMLElement;
    const containerWidth = container?.offsetWidth || window.innerWidth;

    const targetOffset = (cardWidth + this.galleryGap) * this.galleryIndex;
    const centerOffset = (containerWidth - cardWidth) / 2;
    const paddingOffset = parseFloat(window.getComputedStyle(container).paddingLeft) || 0;
    const translate = targetOffset - centerOffset + (paddingOffset / 2);
    this.galleryTransform = `translateX(-${translate}px)`;
  }

  // --- NUEVA Lógica de Lightbox Interactivo ---

  // Click en el carrusel
  onGalleryClick(i: number) {
    if (i === this.galleryIndex) {
      this.lightboxOpen = true;
      this.pauseGallery();
    } else {
      this.goToGallery(i);
    }
  }

  // Cerrar el lightbox
  closeLightbox() {
    this.lightboxOpen = false;
    this.resumeGallery();
  }

  // Navegación DENTRO del lightbox
  lightboxNext() {
    this.galleryIndex = (this.galleryIndex + 1) % this.galeria.length;
  }

  lightboxPrev() {
    this.galleryIndex = (this.galleryIndex - 1 + this.galeria.length) % this.galeria.length;
  }

  @HostListener('window:resize')
  onResize() {
    // --- Eventos ---
    const eventosCardsPerView = window.innerWidth <= 768 ? 1 : 3;
    this.currentIndex = Math.min(
      this.currentIndex,
      Math.max(this.eventos.length - eventosCardsPerView, 0)
    );
    this.updateCarousel();

    // --- Frailes ---
    this.frailesIndex = Math.min(this.frailesIndex, this.frailesMaxIndex());
    this.updateFrailesCarousel();

    // --- Galería ---
    this.updateGalleryTransform();
  }

  // --- FUNCIÓN UTILITARIA ---
  // Para calcular el ancho de la tarjeta de forma segura
  private calculateCardWidth(carouselSelector: string, cardSelector: string): number {
    const carousel = document.querySelector(carouselSelector) as HTMLElement;
    if (!carousel) return 0;
    const card = carousel.querySelector(cardSelector) as HTMLElement;
    if (!card) return 0;
    return card.offsetWidth;
  }
}
