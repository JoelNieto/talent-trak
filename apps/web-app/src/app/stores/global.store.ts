import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import {
  signalStore,
  withComputed,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { ChargeConceptsStore } from './charge-concepts.store';
import { CompaniesStore } from './companies.store';
import { EventTypesStore } from './event-types.store';
import { ItemTypesStore } from './item-types.store';
import { ItemsStore } from './items.store ';
import { RolesStore } from './roles.store';
import { UsersStore } from './users.store';

export const GlobalStore = signalStore(
  withProps(() => ({
    companies: inject(CompaniesStore),
    roles: inject(RolesStore),
    users: inject(UsersStore),
    eventTypes: inject(EventTypesStore),
    itemTypes: inject(ItemTypesStore),
    items: inject(ItemsStore),
    auth: inject(AuthService),
    chargeConcepts: inject(ChargeConceptsStore),
  })),
  withComputed((state) => ({
    user: toSignal(state.auth.user$),
  })),
  withMethods((state) => ({
    logout: () => {
      state.auth.logout();
    },
    signIn: () => {
      state.auth.loginWithRedirect();
    },
  }))
);
