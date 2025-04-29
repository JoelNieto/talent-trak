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
import { iif } from 'rxjs';
import { v4 } from 'uuid';
import { markGroupDirty } from './services/util.service';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-item-types-form',
  imports: [ReactiveFormsModule, InputText, Button],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input
          id="name"
          type="text"
          pInputText
          formControlName="name"
          placeholder="Nombre del item"
        />
      </div>
      <div class="input-container">
        <label for="description">Descripción</label>
        <input
          id="description"
          type="text"
          pInputText
          formControlName="description"
          placeholder="Descripción del item"
        />
      </div>
    </div>
    <div class="dialog-actions">
      <p-button
        label="Cancelar"
        icon="pi pi-times"
        type="button"
        (onClick)="dialogRef.close()"
        rounded
        severity="secondary"
      />
      <p-button label="Guardar" icon="pi pi-check" type="submit" rounded />
    </div>
  </form> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTypesFormComponent implements OnInit {
  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);
  private messageService = inject(MessageService);
  private store = inject(GlobalStore);
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    const { type } = this.dialog.data;
    if (type) {
      this.form.patchValue(type);
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
        detail: 'No se han realizado cambios en el formulario',
      });
      return;
    }

    iif(
      () => this.dialog.data.type,
      this.store.itemTypes.editItem(this.form.getRawValue()),
      this.store.itemTypes.createItem(this.form.getRawValue())
    ).subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }
}
