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
import { Role } from '@talent-trak/models';
import { toDate } from 'date-fns';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { iif } from 'rxjs';
import { v4 } from 'uuid';
import { markGroupDirty } from './services/util.service';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-users-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Select,
    DatePicker,
    MultiSelect,
  ],
  template: `<form
    [formGroup]="form"
    (ngSubmit)="saveChanges()"
    class="flex md:grid grid-cols-4 gap-4"
  >
    <div class="input-container">
      <label for="given_name">Nombre</label>
      <input pInputText formControlName="given_name" id="given_name" />
    </div>
    <div class="input-container">
      <label for="family_name">Apellido</label>
      <input pInputText formControlName="family_name" id="family_name" />
    </div>
    <div class="input-container">
      <label for="email">Email</label>
      <input pInputText formControlName="email" type="email" id="email" />
    </div>
    <div class="input-container">
      <label for="phone">Teléfono</label>
      <input pInputText formControlName="phone" type="tel" id="phone" />
    </div>
    <div class="input-container">
      <label for="document-type">Tipo de documento</label>
      <p-select
        id="document_type"
        formControlName="document_type"
        [options]="[
          { label: 'Cedula', value: 'ID_CARD' },
          { label: 'Pasaporte', value: 'PASSPORT' }
        ]"
        appendTo="body"
      />
    </div>
    <div class="input-container">
      <label for="document_id">Documento</label>
      <input pInputText id="document_id" formControlName="document_id" />
    </div>
    <div class="input-container">
      <label for="gender">Genero</label>
      <p-select
        id="gender"
        appendTo="body"
        formControlName="gender"
        [options]="[
          { label: 'Femenino', value: 'FEMALE' },
          { label: 'Masculino', value: 'MALE' }
        ]"
      />
    </div>
    <div class="input-container">
      <label for="birth_date">Fecha de nacimiento</label>
      <p-date-picker
        id="birth_date"
        formControlName="birth_date"
        appendTo="body"
        [showIcon]="true"
        [showButtonBar]="true"
        dateFormat="mm/dd/yy"
        yearRange="1900:2100"
      />
    </div>
    <div class="input-container">
      <label for="role">Roles</label>
      <p-multiSelect
        id="roles"
        formControlName="roles"
        [options]="store.roles.entities()"
        optionLabel="name"
        optionValue="id"
        [showClear]="true"
        appendTo="body"
        display="chip"
        [placeholder]="'Selecciona un rol'"
      />
    </div>
    <div class="dialog-actions col-span-4">
      <p-button
        label="Cancelar"
        icon="pi pi-times"
        type="button"
        severity="secondary"
        rounded
        (onClick)="dialogRef.close()"
      />
      <p-button label="Guardar" icon="pi pi-check" type="submit" rounded />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFormComponent implements OnInit {
  public store = inject(GlobalStore);

  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    given_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    family_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    document_id: new FormControl('', { nonNullable: true }),
    document_type: new FormControl<'ID_CARD' | 'PASSPORT' | 'DRIVER_LICENSE'>(
      'ID_CARD',
      { nonNullable: true }
    ),
    birth_date: new FormControl(new Date(), { nonNullable: true }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
    gender: new FormControl<'FEMALE' | 'MASCULINE' | 'OTHER'>('MASCULINE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    roles: new FormControl<string[]>([], {
      validators: [Validators.required, Validators.minLength(1)],
      nonNullable: true,
    }),
  });

  private messageService = inject(MessageService);
  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const { user } = this.dialog.data;
    if (user) {
      this.form.patchValue(user);
      this.form
        .get('roles')
        ?.patchValue(user.roles.map((role: Role) => role.id));
      this.form.get('birth_date')?.patchValue(toDate(user.birth_date));
    }
  }

  saveChanges() {
    if (this.form.invalid) {
      markGroupDirty(this.form);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos.',
      });
      return;
    }

    if (this.form.get('roles')?.value.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor agrega al menos un rol.',
      });
      return;
    }
    console.log(this.form.getRawValue());
    iif(
      () => this.dialog.data.user,
      this.store.users.editItem(this.form.getRawValue()),
      this.store.users.createItem(this.form.getRawValue())
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }
}
