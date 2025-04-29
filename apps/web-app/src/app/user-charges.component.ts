import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Charge } from '@talent-trak/models';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { PaymentFormComponent } from './payment-form.component';
import { GlobalStore } from './stores/global.store';
import { UserChargesStore } from './stores/user-charges.store';

@Component({
  selector: 'app-user-charges',
  imports: [TableModule, CurrencyPipe, DatePipe, Button, Card],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-card>
      <ng-template #title>
        Saldo: {{ chargesStore.balance() | currency }}
      </ng-template>
    </p-card>
    <p-table
      [value]="chargesStore.entities()"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 20, 50]"
      [loading]="chargesStore.isLoading()"
      [scrollable]="true"
    >
      <ng-template #header>
        <tr>
          <th>Nombre</th>
          <th>Descripcion</th>
          <th>Monto</th>
          <th>Saldo</th>
          <th>Fecha de vencimiento</th>
          <th>Creado</th>
          <th>Actualizado</th>
          <th alignFrozen="right" pFrozenColumn></th>
        </tr>
      </ng-template>
      <ng-template #body let-charge>
        <tr>
          <td>{{ charge.name }}</td>
          <td>{{ charge.description }}</td>
          <td>{{ charge.amount | currency }}</td>
          <td>{{ charge.balance | currency }}</td>
          <td>{{ charge.due_date | date : 'shortDate' }}</td>
          <td>{{ charge.created_at | date : 'short' }}</td>
          <td>{{ charge.updated_at | date : 'short' }}</td>
          <td alignFrozen="right" pFrozenColumn>
            <p-button
              icon="pi pi-money-bill"
              text
              rounded
              severity="success"
              (onClick)="addPayment(charge)"
            />
            <p-button icon="pi pi-pen-to-square" text rounded />
            <p-button icon="pi pi-trash" text rounded severity="danger" />
          </td>
        </tr>
      </ng-template>
    </p-table>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserChargesComponent implements OnInit {
  public chargesStore = inject(UserChargesStore);
  private store = inject(GlobalStore);
  private dialogService = inject(DialogService);
  private ref = inject(DynamicDialogRef);

  ngOnInit(): void {
    this.chargesStore.setUserId(this.store.users.selectedEntity()?.id);
  }

  public addPayment(charge: Charge) {
    this.ref = this.dialogService.open(PaymentFormComponent, {
      header: 'Agregar pago',
      width: '50%',
      modal: true,
      data: {
        userId: this.store.users.selectedEntity()?.id,
        charge: charge,
      },
    });
  }
}
