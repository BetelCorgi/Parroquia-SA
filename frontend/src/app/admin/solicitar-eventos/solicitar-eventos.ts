import { Component, signal } from '@angular/core';
import { CommonModule} from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EventRequests } from '../shared/event-requests';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitar-eventos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-eventos.html',
  styleUrl: './solicitar-eventos.css'
})
export class SolicitarEventos {
  // para previsualizar la portada
  portadaPreview = signal<string | null>(null);
  tipos = [ 'Misa', 'Bautizo', 'Matrimonio', 'Confirmación', 'Primera Comunión', 'Exequias/Funeral', 'Acción de Gracias', 'Otro' ];
  form: FormGroup;
  sending = signal(false);
  error = signal('');
  ok = signal('');

  constructor(
    private fb: FormBuilder,
    // CORRECCIÓN: Se inyecta el servicio con el nombre correcto
    private events: EventRequests,
    private router: Router
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(80)]],
      asunto: ['', [Validators.required, Validators.maxLength(500)]],
      invitados: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      horaFin: [''],
      ubicacion: ['', Validators.required],
      tipo: ['', Validators.required],
      enlaceVideo: [''],
      portada: [null as File | null]
    });
  }

  onPortadaChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.form.patchValue({ portada: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.portadaPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.portadaPreview.set(null);
    }
  }

  submit() {
    this.error.set('');
    this.ok.set('');

    if (this.form.invalid) {
      this.error.set('Complete correctamente los campos requeridos.');
      this.form.markAllAsTouched();
      return;
    }

    this.sending.set(true);

    const v = this.form.value;
    // El payload coincide con el método `add` del nuevo servicio
    const payload = {
      titulo: v.titulo!.trim(),
      asunto: v.asunto!.trim(),
      invitados: Number(v.invitados),
      fecha: v.fecha!,
      hora: v.hora!,
      horaFin: v.horaFin || undefined,
      ubicacion: v.ubicacion!.trim(),
      tipo: v.tipo!,
      enlaceVideo: v.enlaceVideo?.trim() || undefined,
      portadaUrl: this.portadaPreview() || undefined,
    };

    this.events.add(payload);

    this.ok.set('Solicitud enviada con éxito. Redirigiendo a Notificaciones...');
    setTimeout(() => {
      this.router.navigate(['/admin/notificaciones']);
    }, 900);
  }
}
