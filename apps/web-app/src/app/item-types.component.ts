import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ItemType } from '@talent-trak/models';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ItemTypesFormComponent } from './item-types-form.component';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-item-types',
  providers: [DynamicDialogRef, DialogService],
  imports: [TableModule, Button],
  template: ` <p-table
    [value]="itemTypes.entities()"
    [paginator]="true"
    [rows]="10"
    [rowsPerPageOptions]="[10, 20, 50]"
    [loading]="itemTypes.isLoading()"
    [scrollable]="true"
  >
    <ng-template #caption>
      <div class="flex justify-between">
        <h2>Tipo de inventario</h2>
        <p-button
          icon="pi pi-plus-circle"
          label="Nuevo"
          rounded
          (onClick)="editItemType()"
        />
      </div>
    </ng-template>
    <ng-template pTemplate="header">
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th></th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-itemType>
      <tr>
        <td>{{ itemType.name }}</td>
        <td>{{ itemType.description }}</td>
        <td>
          <p-button
            text
            rounded
            icon="pi pi-pen-to-square"
            (onClick)="editItemType(itemType)"
            severity="success"
          />
          <p-button text rounded icon="pi pi-trash" severity="danger" />
        </td>
      </tr>
    </ng-template>
  </p-table>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTypesComponent {
  public itemTypes = inject(GlobalStore).itemTypes;
  private dialog = inject(DialogService);

  editItemType(type?: ItemType) {
    this.dialog.open(ItemTypesFormComponent, {
      data: { type },
      header: 'Editar tipo de inventario',
      width: '50%',
      modal: true,
    });
  }
}
