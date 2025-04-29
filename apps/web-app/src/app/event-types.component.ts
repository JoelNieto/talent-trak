import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EventType } from '@talent-trak/models';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { EventTypesFormComponent } from './event-types-form.component';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-event-types',
  imports: [TableModule, Button, DatePipe],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-table
    [value]="store.eventTypes.entities()"
    [paginator]="true"
    [rows]="10"
    [rowsPerPageOptions]="[10, 20, 50]"
    [loading]="store.eventTypes.isLoading()"
    [scrollable]="true"
  >
    <ng-template #caption>
      <div class="flex justify-between">
        <h2>Tipos de eventos</h2>
        <p-button
          icon="pi pi-plus-circle"
          label="Nuevo"
          rounded
          (onClick)="editEventType()"
        />
      </div>
    </ng-template>
    <ng-template #header>
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Creado</th>
        <th>Actualizado</th>
        <th></th>
      </tr>
    </ng-template>
    <ng-template #body let-eventType>
      <tr>
        <td>{{ eventType.name }}</td>
        <td>{{ eventType.description }}</td>
        <td>{{ eventType.created_at | date : 'short' }}</td>
        <td>{{ eventType.updated_at | date : 'short' }}</td>
        <td class="flex gap-2">
          <p-button
            icon="pi pi-pen-to-square"
            rounded
            (onClick)="editEventType(eventType)"
            text
            severity="success"
          />
          <p-button
            icon="pi pi-trash"
            rounded
            (onClick)="deleteEventType(eventType)"
            text
            severity="danger"
          />
        </td>
      </tr>
    </ng-template>
  </p-table> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTypesComponent {
  public store = inject(GlobalStore);
  private dialogService = inject(DialogService);

  editEventType(eventType?: EventType) {
    this.dialogService.open(EventTypesFormComponent, {
      data: { eventType },
      header: 'Editar tipo de evento',
      width: '50%',
      modal: true,
    });
  }

  deleteEventType(id: string) {
    this.store.eventTypes.deleteItem(id);
  }
}
