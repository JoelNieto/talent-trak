import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { UserPaymentsStore } from './stores/user-payments.store';

@Component({
  selector: 'app-user-payments',
  imports: [TableModule, CurrencyPipe, DatePipe],
  template: `<p-table
    [value]="payments.entities()"
    [paginator]="true"
    [rows]="10"
    [rowsPerPageOptions]="[10, 20, 50]"
    [loading]="payments.isLoading()"
    [scrollable]="true"
  >
    <ng-template #header>
      <tr>
        <th>Cargo</th>
        <th>Monto</th>
        <th>Fecha de pago</th>
        <th>Comentarios</th>
        <th>Creado</th>
      </tr>
    </ng-template>
    <ng-template #body let-payment>
      <tr>
        <td>{{ payment.charge.name }}</td>
        <td>{{ payment.amount | currency }}</td>
        <td>{{ payment.date | date : 'shortDate' }}</td>
        <td>{{ payment.comments }}</td>
        <td>{{ payment.created_at | date : 'short' }}</td>
      </tr>
    </ng-template>
  </p-table>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPaymentsComponent {
  public payments = inject(UserPaymentsStore);
}
