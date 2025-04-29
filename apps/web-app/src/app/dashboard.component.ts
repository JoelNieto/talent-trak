import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { ChargeConceptsStore } from './stores/charge-concepts.store';
import { CompaniesStore } from './stores/companies.store';
import { EventTypesStore } from './stores/event-types.store';
import { GlobalStore } from './stores/global.store';
import { ItemTypesStore } from './stores/item-types.store';
import { ItemsStore } from './stores/items.store ';
import { RolesStore } from './stores/roles.store';
import { UsersStore } from './stores/users.store';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    ToastModule,
    ConfirmDialogModule,
    RouterLink,
    RouterLinkActive,
    Avatar,
    Button,
    MenuModule,
  ],
  providers: [
    GlobalStore,
    CompaniesStore,
    RolesStore,
    UsersStore,
    EventTypesStore,
    ItemTypesStore,
    ItemsStore,
    ChargeConceptsStore,
  ],
  template: `
    <p-toast />
    <p-confirmDialog />
    <div class="flex w-screen h-screen overflow-hidden">
      <aside class="w-64 flex-shrink-0">
        <nav
          class="flex flex-col py-4 bg-surface-700 text-surface-200 h-full static"
        >
          <h1 class="text-2xl font-semibold mb-3">Talentrak</h1>
          <a routerLink="/home" routerLinkActive="active" class="link"
            ><i class="pi pi-home"></i> Inicio</a
          >
          <a routerLink="/companies" routerLinkActive="active" class="link"
            ><i class="pi pi-building"></i> Empresas</a
          >
          <a routerLink="/roles" routerLinkActive="active" class="link"
            ><i class="pi pi-user-plus"></i>Roles</a
          >
          <a routerLink="/event-types" routerLinkActive="active" class="link"
            ><i class="pi pi-calendar"></i>Tipos de eventos</a
          >
          <a routerLink="/items" routerLinkActive="active" class="link"
            ><i class="pi pi-box"></i>Inventario</a
          >
          <a routerLink="/item-types" routerLinkActive="active" class="link"
            ><i class="pi pi-warehouse"></i>Tipos de inventario</a
          >
          <a
            routerLink="/charge-concepts"
            routerLinkActive="active"
            class="link"
            ><i class="pi pi-money-bill"></i>Conceptos de cobro</a
          >
          <a routerLink="/users" routerLinkActive="active" class="link"
            ><i class="pi pi-users"></i>Usuarios</a
          >
        </nav>
      </aside>
      <main class=" flex-1 h-screen flex flex-col w-full min-w-0">
        <header
          class="bg-primary-600 text-surface-200 border-b static border-surface-200 py-4 px-6 flex items-center justify-between"
        >
          <h2 class="text-xl font-semibold">Dashboard</h2>
          @let user = store.user(); @if(user) {
          <div class="flex items-center gap-2">
            <p-avatar [image]="store.user()?.picture" shape="circle" />
            <div>{{ user.name }}</div>
          </div>
          } @else {
          <p-button (onClick)="store.signIn()" label="Login" />
          }
        </header>
        <div class="flex-1 overflow-y-scroll bg-surface-100">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: `
  .link {
    @apply text-surface-300 hover:text-surface-100 px-6 py-3 border-l-4 border-transparent flex items-center gap-4;
  }
  .active {
    @apply text-surface-100 bg-surface-600 border-primary-600;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public store = inject(GlobalStore);
}
