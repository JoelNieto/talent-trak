import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { iif } from 'rxjs';
import { v4 } from 'uuid';
import { markGroupDirty } from './services/util.service';
import { GlobalStore } from './stores/global.store';
@Component({
  selector: 'app-companies-form',
  imports: [FormsModule, ReactiveFormsModule, InputText, ToggleSwitch, Button],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input
          id="name"
          type="text"
          pInputText
          formControlName="name"
          placeholder="Nombre de la empresa"
        />
      </div>
      <div class="input-container">
        <label for="short_name">Nombre corto</label>
        <input
          id="short_name"
          type="text"
          pInputText
          formControlName="short_name"
          placeholder="Nombre corto de la empresa"
        />
      </div>
      <div class="input-container">
        <label for="description">Descripción</label>
        <input
          id="description"
          type="text"
          pInputText
          formControlName="description"
          placeholder="Descripción de la empresa"
        />
      </div>
      <div class="flex items-center gap-2">
        <p-toggleswitch formControlName="is_active" inputId="active" />
        <label for="active">Activo</label>
      </div>
    </div>
    <div class="dialog-actions">
      <p-button
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        (click)="dialogRef.close()"
        rounded
      />
      <p-button
        label="Guardar cambios"
        icon="pi pi-save"
        type="submit"
        rounded
      />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesFormComponent implements OnInit {
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    short_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    is_active: new FormControl(true, { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
  });
  private messageService = inject(MessageService);

  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);
  private store = inject(GlobalStore);
  private destroyRef = inject(DestroyRef);
  ngOnInit(): void {
    const { company } = this.dialog.data;
    if (company) {
      this.form.patchValue(company);
    }
  }

  saveChanges() {
    if (this.form.invalid) {
      markGroupDirty(this.form);
      return;
    }

    if (this.form.pristine) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No se realizaron cambios',
        detail: 'No se realizaron cambios en el formulario',
      });
      this.dialogRef.close();
      return;
    }

    iif(
      () => this.dialog.data.company,
      this.store.companies.editItem(this.form.getRawValue()),
      this.store.companies.createItem(this.form.getRawValue())
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.dialogRef.close() });
  }
}
