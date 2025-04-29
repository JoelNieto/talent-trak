import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Item } from '@talent-trak/models';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Image } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { ItemsFormComponent } from './items-form.component';
import { GlobalStore } from './stores/global.store';
@Component({
  selector: 'app-items',
  imports: [TableModule, Button, Image],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-table
    [value]="store.items.entities()"
    [paginator]="true"
    [rows]="10"
    [rowsPerPageOptions]="[10, 20, 50]"
    [loading]="store.items.isLoading()"
    [scrollable]="true"
  >
    <ng-template #caption>
      <div class="flex justify-between">
        <h2>Inventario</h2>
        <p-button
          icon="pi pi-plus-circle"
          label="Nuevo"
          rounded
          (onClick)="editItem()"
        />
      </div>
    </ng-template>
    <ng-template #header>
      <tr>
        <th>Nombre</th>
        <th>Tipo</th>
        <th>Cantidad</th>
        <th>Precio</th>
        <th></th>
      </tr>
    </ng-template>
    <ng-template #body let-item>
      <tr>
        <td>
          <div class="flex gap-2 items-center">
            @if(item.picture_url) {
            <p-image
              [src]="item.picture_url"
              [alt]="item.name"
              width="65"
              preview="true"
            >
              <ng-template #indicator>
                <i class="pi pi-search"></i>
              </ng-template>
              <ng-template #image>
                <img
                  [src]="item.picture_url"
                  [alt]="item.name"
                  class="rounded-lg shadow-lg"
                  width="65"
                />
              </ng-template>
            </p-image>
            } @else {
            <img src="images/no-picture.png" width="65" alt="No picture" />
            }

            <div class="flex flex-col justify-center">
              <p class="text-surface-600 font-bold text-lg">
                {{ item.name }}
              </p>
              <p class="text-surface-400 text-sm">{{ item.description }}</p>
            </div>
          </div>
        </td>
        <td>{{ item.type.name }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.price }}</td>
        <td>
          <p-button
            text
            rounded
            severity="success"
            icon="pi pi-pen-to-square"
            (onClick)="editItem(item)"
          />
          <p-button
            text
            rounded
            severity="danger"
            icon="pi pi-trash"
            (onClick)="store.items.deleteItem(item.id)"
          />
        </td>
      </tr> </ng-template
  ></p-table> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  public store = inject(GlobalStore);
  private dialogService = inject(DialogService);

  editItem(item?: Item) {
    this.dialogService.open(ItemsFormComponent, {
      header: item ? 'Editar item' : 'Agregar item',
      width: '70vw',
      data: { item },
      modal: true,
    });
  }
}
