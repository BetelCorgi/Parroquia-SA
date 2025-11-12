import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fiel-edicion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edicion.html',
  styleUrl: './edicion.css',
})
export class FielEdicion {
  videoUrl = 'https://youtube.com/…';
  startFrame = '00:01';
  endFrame = '00:45';

  socialLinks = [
    { name: 'YouTube', url: 'https://youtube.com/parroquia' },
    { name: 'Facebook', url: 'https://facebook.com/parroquia' },
    { name: 'Mapa', url: 'https://maps.google.com/?q=Parroquia+San+Agustin' },
  ];
}
