import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { EventsCalendarComponent } from './events-calendar.component';

@Component({
  selector: 'app-home',
  imports: [TabsModule, Card, EventsCalendarComponent],
  template: `<div class="p-3">
    <h1 class="text-4xl font-black text-surface-700">Inicio</h1>
    <div class="grid grid-cols-4 gap-4 mt-4">
      <p-card class="w-full">
        <ng-template #title>Usuarios</ng-template>
      </p-card>
      <p-card class="w-full">
        <ng-template #title>Usuarios</ng-template>
      </p-card>
      <p-card class="w-full">
        <ng-template #title>Usuarios</ng-template>
      </p-card>
      <p-card class="w-full">
        <ng-template #title>Usuarios</ng-template>
      </p-card>
      <p-card class="w-full col-span-4">
        <ng-template #title>Calendario de actividades</ng-template>
        <app-events-calendar />
      </p-card>
    </div>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
