import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@talent-trak/models';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ChipComponent } from './chip.component';
import { GlobalStore } from './stores/global.store';
import { UsersFormComponent } from './users-form.component';
@Component({
  selector: 'app-users',
  imports: [
    TableModule,
    Button,
    DatePipe,
    IconField,
    InputIcon,
    InputText,
    RouterLink,
    ChipComponent,
  ],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-table
    #dt
    [value]="store.users.entities()"
    [paginator]="true"
    [rows]="10"
    [rowsPerPageOptions]="[10, 20, 50]"
    [loading]="store.users.isLoading()"
    [scrollable]="true"
    [globalFilterFields]="['given_name', 'family_name', 'email', 'document_id']"
  >
    <ng-template #caption>
      <div class="flex justify-between">
        <h2>Usuarios</h2>
        <div class="flex gap-2">
          <p-iconfield iconPosition="left" class="ml-auto">
            <p-inputicon>
              <i class="pi pi-search"></i>
            </p-inputicon>
            <input
              pInputText
              type="text"
              (input)="dt.filterGlobal($event.target?.value, 'contains')"
              placeholder="Buscar"
            />
          </p-iconfield>
          <p-button
            icon="pi pi-plus-circle"
            label="Nuevo"
            rounded
            (onClick)="editUser()"
          />
        </div>
      </div>
    </ng-template>
    <ng-template #header>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Documento</th>
        <th>Genero</th>
        <th>Telefono</th>
        <th>Roles</th>
        <th>Creado</th>
        <th>Actualizado</th>
        <th></th>
      </tr>
    </ng-template>
    <ng-template #body let-user>
      <tr>
        <td>
          <a [routerLink]="user.id"
            >{{ user.given_name }} {{ user.family_name }}</a
          >
        </td>
        <td>{{ user.email }}</td>
        <td>{{ user.document_id }}</td>
        <td>{{ user.gender }}</td>
        <td>{{ user.phone }}</td>
        <td>
          <div class="flex gap-2">
            @for(role of user.roles; track role.id) {
            <app-chip>{{ role.name }}</app-chip>
            }
          </div>
        </td>
        <td>{{ user.created_at | date : 'short' }}</td>
        <td>{{ user.updated_at | date : 'short' }}</td>
        <td class="flex gap-2">
          <p-button
            icon="pi pi-pen-to-square"
            (onClick)="editUser(user)"
            rounded
            text
            severity="success"
          />
          <p-button
            icon="pi pi-trash"
            severity="danger"
            text
            (onClick)="store.users.deleteItem(user.id)"
            rounded
          />
        </td>
      </tr>
    </ng-template>
  </p-table>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  public store = inject(GlobalStore);
  private dialogService = inject(DialogService);

  editUser(user?: User) {
    this.dialogService.open(UsersFormComponent, {
      data: { user },
      header: user ? 'Editar usuario' : 'Agregar usuario',
      width: '70%',
      modal: true,
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
    });
  }
}
