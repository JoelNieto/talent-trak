import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { CalendarComponent } from './calendar.component';
import { ChipComponent } from './chip.component';
import { GlobalStore } from './stores/global.store';
import { UserChargesStore } from './stores/user-charges.store';
import { UserPaymentsStore } from './stores/user-payments.store';
import { UserChargesComponent } from './user-charges.component';
import { UserPaymentsComponent } from './user-payments.component';

@Component({
  selector: 'app-user-details',
  imports: [
    ChipComponent,
    Card,
    Button,
    TabsModule,
    DatePipe,
    CalendarComponent,
    UserChargesComponent,
    UserPaymentsComponent,
  ],
  providers: [UserChargesStore, UserPaymentsStore],
  template: `
    @let user = store.users.selectedEntity(); @if(user) {
    <div class="flex gap-4">
      <div class="w-1/4">
        <p-card>
          <ng-template #header>
            <div class="flex flex-col items-center justify-center gap-4">
              <img
                src="/images/no-picture.png"
                alt="User Picture"
                class="h-64 object-cover"
              />
            </div>
          </ng-template>
          <ng-template #title>
            {{ user.given_name }} {{ user.family_name }}
          </ng-template>
          <ng-template #subtitle>
            {{ user.email }}
          </ng-template>
          <div class="flex flex-col">
            <div>Telefono: {{ user.phone }}</div>
            <div>Documento: {{ user.document_id }}</div>
            <div>Direccion: {{ user.address }}</div>
            <div>Fecha de nacimiento: {{ user.birth_date | date }}</div>
            <div class="flex flex-wrap gap-2">
              @for(role of user.roles; track role.id ) {
              <div class="block w-fit">
                <app-chip>{{ role.name }}</app-chip>
              </div>
              }
            </div>

            <div class="text-xs text-surface-400">
              Creado: {{ user.created_at | date }}
            </div>
          </div>
          <ng-template #footer>
            <div class="flex justify-end">
              <p-button
                label="Edit"
                icon="pi pi-pencil"
                severity="success"
                rounded
                size="small"
                outlined
              />
            </div>
          </ng-template>
        </p-card>
      </div>
      <div class="w-full flex-1 min-w-0">
        <p-card>
          <ng-template #title> Detalles </ng-template>
          <p-tabs value="0">
            <p-tablist>
              <p-tab value="0"><i class="pi pi-calendar"></i> Calendario</p-tab>
              <p-tab value="1"
                ><i class="pi pi-dollar"></i> Estado de cuenta</p-tab
              >
              <p-tab value="2"
                ><i class="pi pi-money-bill"></i> Historial de pagos</p-tab
              >
            </p-tablist>
            <p-tabpanels>
              <p-tabpanel value="0">
                <app-calendar />
              </p-tabpanel>
              <p-tabpanel value="1">
                <app-user-charges />
              </p-tabpanel>
              <p-tabpanel value="2">
                <app-user-payments />
              </p-tabpanel>
            </p-tabpanels>
          </p-tabs>
        </p-card>
      </div>
    </div>

    }
  `,
  styles: `:host {
    @apply block p-4;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit {
  store = inject(GlobalStore);
  chargesStore = inject(UserChargesStore);
  userId = input.required<string>();
  ngOnInit(): void {
    this.store.users.selectEntity(this.userId());
  }
}
