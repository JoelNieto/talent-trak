import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Role } from '@talent-trak/models';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { BooleanIconComponent } from './boolean-icon.component';
import { RolesFormComponent } from './roles-form.component';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-roles',
  imports: [TableModule, Button, DatePipe, BooleanIconComponent],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-table
    [value]="roles.entities()"
    [paginator]="true"
    [rows]="10"
    [rowsPerPageOptions]="[10, 20, 50]"
    [loading]="roles.isLoading()"
    [scrollable]="true"
  >
    <ng-template #caption>
      <div class="flex justify-between">
        <h2>Roles</h2>
        <p-button
          icon="pi pi-plus-circle"
          label="Nuevo"
          rounded
          (onClick)="editRole()"
        />
      </div>
    </ng-template>
    <ng-template #header>
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Admin</th>
        <th>SuperAdmin</th>
        <th>Empleado</th>
        <th>Cliente</th>
        <th>Creado</th>
        <th>Actualizado</th>
        <th></th>
      </tr>
    </ng-template>
    <ng-template #body let-role>
      <tr>
        <td>{{ role.name }}</td>
        <td>{{ role.description }}</td>
        <td><app-boolean-icon [value]="role.is_admin" /></td>
        <td><app-boolean-icon [value]="role.is_super_admin" /></td>
        <td><app-boolean-icon [value]="role.is_employee" /></td>
        <td><app-boolean-icon [value]="role.is_client" /></td>
        <td>{{ role.created_at | date : 'short' }}</td>
        <td>{{ role.updated_at | date : 'short' }}</td>
        <td class="flex gap-2">
          <p-button
            icon="pi pi-pen-to-square"
            rounded
            (onClick)="editRole(role)"
            text
            severity="success"
          />
          <p-button
            icon="pi pi-trash"
            severity="danger"
            rounded
            text
            (onClick)="deleteRole(role.id)"
          />
        </td>
      </tr>
    </ng-template>
  </p-table>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent {
  public roles = inject(GlobalStore).roles;
  private dialogService = inject(DialogService);

  editRole(role?: Role) {
    this.dialogService.open(RolesFormComponent, {
      header: role ? 'Editar rol' : 'Agregar rol',
      width: '50%',
      data: { role },
      modal: true,
    });
  }

  deleteRole(id: string) {
    this.roles.deleteItem(id);
  }
}
