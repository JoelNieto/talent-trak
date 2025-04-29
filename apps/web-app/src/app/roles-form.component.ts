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
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-roles-form',
  imports: [ReactiveFormsModule, InputText, ToggleSwitch, Button],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="grid grid-cols-2 gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input
          id="name"
          type="text"
          pInputText
          formControlName="name"
          placeholder="Nombre del rol"
        />
      </div>
      <div class="input-container">
        <label for="description">Descripción</label>
        <input
          id="description"
          type="text"
          pInputText
          formControlName="description"
          placeholder="Descripción del rol"
        />
      </div>
      <div class="flex w-full gap-4 col-span-4">
        <div class="flex items-center gap-2 w-full">
          <label for="is_admin">Admin</label>
          <p-toggleswitch
            id="is_admin"
            formControlName="is_admin"
            onLabel="Sí"
            offLabel="No"
          />
        </div>
        <div class="flex items-center gap-2 w-full">
          <label for="is_super_admin">Super Admin</label>
          <p-toggleswitch
            id="is_super_admin"
            formControlName="is_super_admin"
            onLabel="Sí"
            offLabel="No"
          />
        </div>
        <div class="flex items-center gap-2 w-full">
          <label for="is_admin">Empleado</label>
          <p-toggleswitch
            id="is_employee"
            formControlName="is_employee"
            onLabel="Sí"
            offLabel="No"
          />
        </div>
        <div class="flex items-center gap-2 w-full">
          <label for="is_super_admin">Cliente</label>
          <p-toggleswitch
            id="is_client"
            formControlName="is_client"
            onLabel="Sí"
            offLabel="No"
          />
        </div>
      </div>
    </div>
    <div class="dialog-actions">
      <p-button
        icon="pi pi-times"
        label="Cancelar"
        type="button"
        (onClick)="dialogRef.close()"
        rounded
        severity="secondary"
        outlined
      />
      <p-button icon="pi pi-check" label="Guardar" type="submit" rounded />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesFormComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    is_admin: new FormControl(false, { nonNullable: true }),
    is_super_admin: new FormControl(false, { nonNullable: true }),
    is_employee: new FormControl(false, { nonNullable: true }),
    is_client: new FormControl(false, { nonNullable: true }),
  });

  public dialogRef = inject(DynamicDialogRef);
  private store = inject(GlobalStore);
  dialog = inject(DynamicDialogConfig);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  ngOnInit(): void {
    const { role } = this.dialog.data;
    if (role) {
      this.form.patchValue(role);
    }
  }

  saveChanges() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.pristine) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No se realizaron cambios',
        detail: 'No se realizaron cambios en el formulario.',
      });
      this.dialogRef.close();
      return;
    }
    iif(
      () => this.dialog.data.role,
      this.store.roles.editItem(this.form.getRawValue()),
      this.store.roles.createItem(this.form.getRawValue())
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.dialogRef.close() });
  }
}
