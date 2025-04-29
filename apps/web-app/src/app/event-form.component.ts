import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { startOfHour } from 'date-fns';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-event-form',
  imports: [
    DatePicker,
    InputText,
    Select,
    Button,
    MultiSelect,
    ReactiveFormsModule,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="grid grid-cols-2 gap-4">
      <div class="input-container">
        <label for="title">Titulo</label>
        <input id="title" formControlName="title" pInputText />
      </div>
      <div class="input-container">
        <label for="event_type">Tipo de evento</label>
        <p-select
          id="event_type"
          formControlName="event_type"
          [options]="store.eventTypes.entities()"
          optionLabel="name"
          optionValue="id"
          appendTo="body"
          [showClear]="true"
        />
      </div>

      <div class="input-container">
        <label for="start_date">Fecha de inicio</label>
        <p-datepicker
          id="start_date"
          formControlName="start_date"
          [showIcon]="true"
          dateFormat="mm/dd/yy"
          appendTo="body"
          showButtonBar="true"
          [showTime]="true"
          hourFormat="12"
          stepMinute="5"
        />
      </div>
      <div class="input-container">
        <label for="end_date">Fecha de terminacion</label>
        <p-datepicker
          id="end_date"
          formControlName="end_date"
          [showIcon]="true"
          dateFormat="mm/dd/yy"
          appendTo="body"
          showButtonBar="true"
          [showTime]="true"
          hourFormat="12"
          stepMinute="5"
        />
      </div>
      <div class="input-container">
        <label for="description">Descripción</label>
        <input id="description" formControlName="description" pInputText />
      </div>
      <div class="input-container">
        <label for="comments">Comentarios</label>
        <input id="comments" formControlName="comments" pInputText />
      </div>
      <div class="input-container">
        <label for="location">Ubicación</label>
        <input id="location" formControlName="location" pInputText />
      </div>
      <div class="input-container">
        <label for="company">Compañia</label>
        <p-select
          id="company"
          formControlName="company"
          [options]="store.companies.entities()"
          optionLabel="short_name"
          optionValue="id"
          appendTo="body"
          [showClear]="true"
        />
      </div>
      <div class="input-container">
        <label for="participants">Participantes</label>
        <p-multiselect
          id="participants"
          formControlName="participants"
          [options]="store.users.users()"
          optionValue="id"
          optionLabel="full_name"
          appendTo="body"
          display="chip"
          [showClear]="true"
          placeholder="Seleccionar participantes"
        >
        </p-multiselect>
      </div>
    </div>
    <div class="dialog-actions">
      <p-button
        type="button"
        severity="secondary"
        rounded
        label="Cancelar"
        icon="pi pi-times"
        (click)="dialogRef.close()"
      />
      <p-button
        type="submit"
        pButton
        rounded
        label="Guardar"
        icon="pi pi-check"
      />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent {
  public form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    start_date: new FormControl(startOfHour(new Date())),
    end_date: new FormControl(startOfHour(new Date())),
    comments: new FormControl(''),
    location: new FormControl(''),
    participants: new FormControl<string[]>([]),
    event_type: new FormControl(''),
    company: new FormControl(''),
  });
  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);
  public store = inject(GlobalStore);
  private http = inject(HttpClient);

  saveChanges() {
    this.http.post('/api/events', this.form.getRawValue()).subscribe({
      next: (data) => {
        this.dialogRef.close(data);
      },
      error: (error) => {
        console.error('Error creating event:', error);
      },
    });
  }
}
