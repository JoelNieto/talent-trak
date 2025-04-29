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
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { iif } from 'rxjs';
import { v4 } from 'uuid';
import { markGroupDirty } from './services/util.service';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-charge-concepts-form',
  imports: [ReactiveFormsModule, Button, InputText, Textarea],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input
          id="name"
          type="text"
          pInputText
          formControlName="name"
          placeholder="Nombre del concepto"
        />
      </div>
      <div class="input-container">
        <label for="description">Descripcion</label>
        <input
          id="description"
          type="text"
          pTextarea
          formControlName="description"
          placeholder="Descripcion del concepto"
        />
      </div>
      <div class="input-container">
        <label for="amount">Monto</label>
        <input
          id="amount"
          type="number"
          pInputText
          formControlName="amount"
          placeholder="Monto del concepto"
        />
      </div>
    </div>
    <div class="dialog-actions">
      <p-button
        type="button"
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        rounded
        (click)="dialogRef.close()"
      />
      <p-button
        type="submit"
        label="Guardar"
        icon="pi pi-save"
        rounded
        (click)="dialogRef.close(form.value)"
        [loading]="store.isLoading()"
      />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChargeConceptsFormComponent implements OnInit {
  public store = inject(GlobalStore).chargeConcepts;
  private dialog = inject(DynamicDialogConfig);
  public dialogRef = inject(DynamicDialogRef);
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', { nonNullable: true }),
    amount: new FormControl(0, { nonNullable: true }),
  });

  ngOnInit(): void {
    const { concept } = this.dialog.data;
    if (concept) {
      this.form.patchValue(concept);
    }
  }

  saveChanges() {
    if (this.form.invalid) {
      markGroupDirty(this.form);
      return;
    }

    iif(
      () => this.dialog.data.concept,
      this.store.editItem(this.form.getRawValue()),
      this.store.createItem(this.form.getRawValue())
    ).subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }
}
