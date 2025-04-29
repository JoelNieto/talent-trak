import { CurrencyPipe } from '@angular/common';
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
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { markGroupDirty } from './services/util.service';
import { GlobalStore } from './stores/global.store';
import { UserChargesStore } from './stores/user-charges.store';
import { UserPaymentsStore } from './stores/user-payments.store';

@Component({
  selector: 'app-payment-form',
  imports: [
    Button,
    Select,
    InputText,
    ReactiveFormsModule,
    DatePicker,
    CurrencyPipe,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChange()">
    <div class="grid grid-cols-2 gap-4">
      <div class="input-container ">
        <label for="amount">Monto</label>
        <input
          pInputText
          id="amount"
          formControlName="amount"
          type="number"
          placeholder="Monto"
        />
      </div>
      <div class="input-container ">
        <label for="description">Descripcion</label>
        <input
          pInputText
          id="comments"
          formControlName="comments"
          type="text"
          placeholder="Comentarios"
        />
      </div>
      <div class="input-container ">
        <label for="date">Fecha</label>
        <p-date-picker
          id="date"
          formControlName="date"
          appendTo="body"
          [showIcon]="true"
          dateFormat="mm/dd/yy"
        />
      </div>
      <div class="input-container">
        <label for="user">Cargo</label>
        <p-select
          id="charge"
          formControlName="charge"
          [options]="chargesStore.entities()"
          optionLabel="name"
          optionValue="id"
          placeholder="Seleccione un cargo"
          appendTo="body"
        >
          <ng-template #selectedItem let-selected>
            {{ selected.name }} - {{ selected.amount | currency }}
          </ng-template>
          <ng-template #item let-item>
            {{ item.name }} - {{ item.amount | currency }}
          </ng-template></p-select
        >
      </div>
      <div class="input-container">
        <label for="user">Usuario</label>
        <p-select
          id="user"
          formControlName="user"
          [options]="store.users.entities()"
          optionValue="id"
          optionLabel="given_name"
          placeholder="Seleccione un usuario"
          appendTo="body"
        >
          <ng-template #selectedItem let-selected>
            {{ selected.given_name }} {{ selected.family_name }}
          </ng-template>
          <ng-template #item let-item>
            {{ item.given_name }} {{ item.family_name }}
          </ng-template>
        </p-select>
      </div>
    </div>
    <div class="dialog-actions">
      <p-button
        label="Cancelar"
        icon="pi pi-times"
        (onClick)="dialogRef.close()"
        severity="secondary"
        rounded
      />
      <p-button label="Guardar" icon="pi pi-save" type="submit" rounded />
    </div>
  </form> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentFormComponent implements OnInit {
  public form = new FormGroup({
    amount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(0.01), Validators.required],
    }),
    user: new FormControl('', { nonNullable: true }),
    charge: new FormControl('', { nonNullable: true }),
    comments: new FormControl('', { nonNullable: true }),
    date: new FormControl(new Date(), { nonNullable: true }),
  });

  public dialogRef = inject(DynamicDialogRef);
  private message = inject(MessageService);
  private dialog = inject(DynamicDialogConfig);
  public store = inject(GlobalStore);
  public chargesStore = inject(UserChargesStore);
  paymentStore = inject(UserPaymentsStore);

  ngOnInit(): void {
    const { userId, charge } = this.dialog.data;
    if (userId) {
      this.form.get('user')?.setValue(userId);
    }
    if (charge) {
      this.form.get('charge')?.setValue(charge.id);
      this.form.get('amount')?.setValue(charge.balance);
      this.form.get('comments')?.setValue(charge.description);
    }
  }

  saveChange() {
    if (this.form.invalid) {
      markGroupDirty(this.form);
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos',
      });
      return;
    }

    this.paymentStore.addPayment(this.form.getRawValue()).subscribe({
      next: () => this.dialogRef.close(),
    });
  }
}
