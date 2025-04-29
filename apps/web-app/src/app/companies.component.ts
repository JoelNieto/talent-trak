import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Company } from '@talent-trak/models';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { CompaniesFormComponent } from './companies-form.component';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-companies',
  providers: [DynamicDialogRef, DialogService],
  imports: [TableModule, Button, DatePipe],
  template: ` <p-table
    [value]="companies.entities()"
    [paginator]="true"
    [rows]="10"
    [rowsPerPageOptions]="[10, 20, 50]"
    [loading]="companies.isLoading()"
    [scrollable]="true"
  >
    <ng-template #caption>
      <div class="flex justify-between">
        <h2>Empresas</h2>
        <p-button
          icon="pi pi-plus-circle"
          label="Nuevo"
          (onClick)="editCompany()"
          rounded
        />
      </div>
    </ng-template>
    <ng-template #header>
      <tr>
        <th>Nombre</th>
        <th>Nombre corto</th>
        <th>Descripción</th>
        <th>Creado</th>
        <th>Actualizado</th>
        <th></th>
      </tr>
    </ng-template>
    <ng-template #body let-company>
      <tr>
        <td>{{ company.name }}</td>
        <td>{{ company.short_name }}</td>
        <td>{{ company.description }}</td>
        <td>{{ company.created_at | date : 'short' }}</td>
        <td>{{ company.updated_at | date : 'short' }}</td>
        <td class="flex gap-2">
          <p-button
            icon="pi pi-pen-to-square"
            rounded
            (onClick)="editCompany(company)"
            text
            severity="success"
          />
          <p-button
            icon="pi pi-trash"
            severity="danger"
            rounded
            text
            (onClick)="deleteCompany(company.id)"
          />
        </td>
      </tr>
    </ng-template>
  </p-table>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesComponent {
  public companies = inject(GlobalStore).companies;
  private dialog = inject(DialogService);

  editCompany(company?: Company) {
    this.dialog.open(CompaniesFormComponent, {
      data: {
        company,
      },
      modal: true,
      width: '50vw',
      //TODO:fix breakpoints to the dialog
      breakpoints: {
        '960px': {
          width: '75vw',
        },
        '640px': {
          width: '90vw',
        },
      },
      header: 'Editar empresa',
    });
  }

  deleteCompany(id: string) {
    this.companies.deleteItem(id);
  }
}
