import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  private readonly STORAGE_BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/parroquia-sa-1530d.firebasestorage.app/o/';
  private readonly STORAGE_BUCKET_SUFFIX = '?alt=media';

  // URLs construidas para el template
  public logoUrl: string = this.STORAGE_BUCKET_URL + 'logo.png' + this.STORAGE_BUCKET_SUFFIX;
  public footerBgUrl: string = this.STORAGE_BUCKET_URL + 'footer-bg.jpg' + this.STORAGE_BUCKET_SUFFIX;

  // Datos de contacto
  direccion = 'Parroquia San Agustín de Hipona – Pimentel, Chiclayo';
  correo = 'contacto@parroquiasanagustin.pe';
  telefono = '+51 999 999 999';
  telefonoHref = this.telefono.replace(/\s+/g, '');

  // Redes sociales (reemplaza los href por los reales)
  redes = [
    { icon: 'fa-brands fa-facebook-f', label: 'Facebook', href: 'https://facebook.com', color: '#1877F2' },
    { icon: 'fa-brands fa-instagram',  label: 'Instagram', href: 'https://instagram.com', color: '#E4405F' },
    { icon: 'fa-brands fa-whatsapp',   label: 'WhatsApp', href: 'https://wa.me/51999999999', color: '#25D366' },
    { icon: 'fa-brands fa-youtube',    label: 'YouTube', href: 'https://youtube.com', color: '#FF0000' },
  ];

  // Horarios de misas
  misas = [
    { dia: 'Lunes a Viernes', hora: '7:00 PM' },
    { dia: 'Sábados',         hora: '6:00 PM' },
    { dia: 'Domingos',        hora: '11:30 AM y 6:00 PM' },
  ];

  // Exposición al Santísimo
  exposicion = { titulo: 'EXPOSICION AL SANTISIMO', dia: 'Jueves', hora: '7:00 PM' };
}
