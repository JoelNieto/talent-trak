import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { iif } from 'rxjs';
import { v4 } from 'uuid';
import { markGroupDirty } from './services/util.service';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-event-types-form',
  imports: [ReactiveFormsModule, Button, InputText, Textarea],
  template: `<form
    [formGroup]="form"
    (ngSubmit)="saveChanges()"
    class="flex flex-col gap-4"
  >
    <div class="input-container">
      <label for="name">Nombre</label>
      <input
        id="name"
        type="text"
        pInputText
        formControlName="name"
        placeholder="Nombre del evento"
      />
    </div>
    <div class="input-container">
      <label for="description">Descripción</label>
      <textarea
        id="description"
        pTextarea
        formControlName="description"
        placeholder="Descripción del evento"
        rows="3"
      ></textarea>
    </div>
    <div class="dialog-actions">
      <p-button
        type="button"
        label="Cancelar"
        (click)="dialogRef.close()"
        icon="pi pi-times"
        severity="secondary"
        rounded
      />
      <p-button type="submit" icon="pi pi-save" label="Guardar" rounded />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTypesFormComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', { nonNullable: true }),
  });
  dialog = inject(DynamicDialogConfig);
  dialogRef = inject(DynamicDialogRef);
  private store = inject(GlobalStore);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    const { eventType } = this.dialog.data;
    if (eventType) {
      this.form.patchValue(eventType);
    }
  }

  saveChanges() {
    if (this.form.invalid) {
      markGroupDirty(this.form);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos',
      });
      return;
    }

    if (this.form.pristine) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin cambios',
        detail: 'No se realizaron cambios',
      });
      return;
    }

    const { eventType } = this.dialog.data;
    iif(
      () => eventType,
      this.store.eventTypes.editItem(this.form.getRawValue()),
      this.store.eventTypes.createItem(this.form.getRawValue())
    ).subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }
}
