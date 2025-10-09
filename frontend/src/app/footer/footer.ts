import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
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
