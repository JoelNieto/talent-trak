import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChargeConcept } from '@talent-trak/models';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ChargeConceptsFormComponent } from './charge-concepts-form.component';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-charge-concepts',
  imports: [TableModule, Button],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-table
    [value]="store.chargeConcepts.entities()"
    [paginator]="true"
    [rows]="10"
  >
    <ng-template #caption>
      <div class="flex justify-between">
        <h2>Conceptos de cargos</h2>
        <p-button
          label="Nuevo"
          icon="pi pi-plus-circle"
          rounded
          (onClick)="editChargeConcept()"
        />
      </div>
    </ng-template>
    <ng-template #header>
      <tr>
        <th>Concepto</th>
        <th>Descripcion</th>
        <th>Monto</th>
        <th></th>
      </tr>
    </ng-template>
    <ng-template #body let-concept>
      <tr>
        <td>{{ concept.name }}</td>
        <td>{{ concept.description }}</td>
        <td>{{ concept.amount }}</td>
        <td>
          <p-button
            rounded
            text
            severity="success"
            icon="pi pi-pen-to-square"
            (onClick)="editChargeConcept(concept)"
          />
          <p-button
            rounded
            text
            severity="danger"
            (onClick)="store.chargeConcepts.deleteItem(concept.id)"
            icon="pi pi-trash"
          ></p-button>
        </td>
      </tr>
    </ng-template>
  </p-table>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChargeConceptsComponent {
  public store = inject(GlobalStore);
  private dialogService = inject(DialogService);

  editChargeConcept(concept?: ChargeConcept) {
    this.dialogService.open(ChargeConceptsFormComponent, {
      data: { concept },
      header: 'Editar Concepto de Carga',
      width: '50%',
      modal: true,
    });
  }
}
