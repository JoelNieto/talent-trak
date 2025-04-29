import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./companies.component').then((m) => m.CompaniesComponent),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./roles.component').then((m) => m.RolesComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'event-types',
        loadComponent: () =>
          import('./event-types.component').then((m) => m.EventTypesComponent),
      },
      {
        path: 'item-types',
        loadComponent: () =>
          import('./item-types.component').then((m) => m.ItemTypesComponent),
      },
      {
        path: 'items',
        loadComponent: () =>
          import('./items.component').then((m) => m.ItemsComponent),
      },
      {
        path: 'charge-concepts',
        loadComponent: () =>
          import('./charge-concepts.component').then(
            (m) => m.ChargeConceptsComponent
          ),
      },
      {
        path: 'users/:userId',
        loadComponent: () =>
          import('./user-details.component').then(
            (m) => m.UserDetailsComponent
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
