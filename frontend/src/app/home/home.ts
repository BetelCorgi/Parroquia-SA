import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  eventos = [
    {
      imagen: '../assets/img/evento1.jpg',
      subtitulo: 'Convocatorias',
      titulo: 'Apostolado',
      descripcion:
        'Nuestra parroquia recolecta las donaciones obtenidas, asi como el apoyo a diversos eventos caritativos.',
    },
    {
      imagen: '../assets/img/evento2.jpg',
      subtitulo: 'Charlas',
      titulo: 'En Vivo',
      descripcion: 'Desarrollamos charlas de diversos temas, de forma virtual o presencial.',
    },
    {
      imagen: '../assets/img/evento3.jpg',
      subtitulo: 'Retiros de Comunión',
      titulo: 'Retiros',
      descripcion:
        'Movimiento espiritual hecho para padres de familia bajo la iniciativa de frailes y laicos de la provincia Nuestra Señora de Gracia del Perú.',
    },
    // agregar más eventos según se necesite
  ];

  // Variables para carrusel
  currentIndex = 0;

  // Constante para el espacio entre cards (20px según tu CSS)
  private gap = 20;

  // Lógica para ir al slide anterior
  prevSlide() {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
    this.updateCarousel();
  }

  // Lógica para ir al siguiente slide
  nextSlide() {
    const cardsPerView = window.innerWidth <= 768 ? 1 : 3;
    // Límite máximo: No ir más allá del punto donde la última tarjeta es visible
    const maxIndex = this.eventos.length - cardsPerView;

    // Asegurarse de que el índice no supere el límite
    this.currentIndex = Math.min(this.currentIndex + 1, maxIndex);
    this.updateCarousel();
  }

  // Lógica para actualizar el carrusel
  updateCarousel() {
    const carousel = document.querySelector('.carousel') as HTMLElement;
    if (carousel) {
      // Usar getComputedStyle para obtener el ancho exacto y manejar el 33%
      const card = carousel.querySelector('.event-card') as HTMLElement;
      if (!card) return;

      const cardWidth = card.offsetWidth;

      // El desplazamiento es el índice * (ancho de la tarjeta + gap)
      const offset = this.currentIndex * (cardWidth + this.gap);

      carousel.style.transform = `translateX(-${offset}px)`;
    }
  }

  // --- FRAILES ---
  frailes = [
    {
      imagen: '../assets/img/fraile1.jpg',
      nombre: 'Fr. Juan Pérez, O.S.A.',
      cargo: 'Párroco',
      descripcion: 'Acompaña la pastoral parroquial y la animación de grupos de servicio.',
    },
    {
      imagen: '../assets/img/fraile2.jpg',
      nombre: 'Fr. Miguel López, O.S.A.',
      cargo: 'Vicario Parroquial',
      descripcion: 'Responsable de catequesis familiar y formación de jóvenes.',
    },
    {
      imagen: '../assets/img/fraile3.jpg',
      nombre: 'Fr. Carlos Medina, O.S.A.',
      cargo: 'Vicario Parroquial',
      descripcion: 'Coordina la acción social y actividades de caridad.',
    },
    // Puedes agregar más frailes
  ];

  frailesIndex = 0;

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
    const carousel = document.querySelector('.frailes-carousel') as HTMLElement;
    if (!carousel) return;
    const card = carousel.querySelector('.fraile-card') as HTMLElement;
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const offset = this.frailesIndex * (cardWidth + this.gap);
    carousel.style.transform = `translateX(-${offset}px)`;
  }

  // --- GALERÍA ---
  galeria = [
    { src: '../assets/img/gal1.jpg', alt: 'Actividad parroquial 1' },
    { src: '../assets/img/gal2.jpg', alt: 'Actividad parroquial 2' },
    { src: '../assets/img/gal3.jpg', alt: 'Actividad parroquial 3' },
    { src: '../assets/img/gal4.jpg', alt: 'Actividad parroquial 4' },
    { src: '../assets/img/gal5.jpg', alt: 'Actividad parroquial 5' },
  ];

  galleryIndex = 0;
  galleryTransform = 'translateX(0px)';
  private galleryGap = 20; // debe coincidir con CSS
  private galleryInterval: any = null; // autoplay handler
  private autoplayMs = 2000;

  ngOnInit() {
    this.updateGalleryTransform();
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.clearAutoplay();
  }

  private startAutoplay() {
    this.clearAutoplay();
    this.galleryInterval = setInterval(() => this.nextGallery(), this.autoplayMs);
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

  nextGallery() {
    this.galleryIndex = (this.galleryIndex + 1) % this.galeria.length;
    this.updateGalleryTransform();
  }
  goToGallery(i: number) {
    this.galleryIndex = i;
    this.updateGalleryTransform();
  }

  // centra la tarjeta "galleryIndex" según el layout actual
  updateGalleryTransform() {
    const track = document.querySelector('.galeria-carousel') as HTMLElement;
    if (!track) return;

    const card = track.querySelector('.galeria-card') as HTMLElement;
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = this.galleryGap;

    // offset = (anchoCard + gap) * index - centrado
    const container = document.querySelector('.galeria-carousel-container') as HTMLElement;
    const containerWidth = container?.offsetWidth || window.innerWidth;

    // Queremos que la card “galleryIndex” quede centrada:
    const targetOffset = (cardWidth + gap) * this.galleryIndex;
    const centerOffset = (containerWidth - cardWidth) / 2;
    const translate = targetOffset - centerOffset;

    this.galleryTransform = `translateX(-${translate}px)`;
  }

  // Lightbox: solo abre si se hace clic en la imagen central
  lightboxOpen = false;
  onGalleryClick(i: number) {
    if (i === this.galleryIndex) {
      this.lightboxOpen = true;
      this.pauseGallery();
    }
  }
  closeLightbox() {
    this.lightboxOpen = false;
    this.resumeGallery();
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
}
