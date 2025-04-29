import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TZDate } from '@date-fns/tz';
import { Event } from '@talent-trak/models';
import { eachDayOfInterval, formatDate } from 'date-fns';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PopoverModule } from 'primeng/popover';
import { CalendarComponent } from './calendar.component';
import { EventFormComponent } from './event-form.component';

@Component({
  selector: 'app-events-calendar',
  imports: [CalendarComponent, DatePipe, PopoverModule],
  providers: [DynamicDialogRef, DialogService],
  template: ` <app-calendar
      [markers]="eventDates()"
      (newEvent)="createEvent($event)"
      [(currentRange)]="calendarMonth"
      [markerTpl]="markerTpl"
    />
    <ng-template #markerTpl let-data>
      <div class="flex flex-col gap-1 w-full h-full overflow-y-scroll">
        @for(marker of data; track marker.id){
        <li
          (click)="($event.stopPropagation); op.toggle($event)"
          (keydown.enter)="($event.stopPropagation); op.toggle($event)"
          tabindex="0"
          class="flex flex-col text-xs font-normal rounded-lg px-2 bg-primary-200 text-primary-600 py-1 cursor-pointer w-full"
        >
          <p class="font-semibold">{{ marker.data.title }}</p>
          {{ marker.data.start_date | date : 'shortTime' }} -
          {{ marker.data.end_date | date : 'shortTime' }}
        </li>
        <p-popover
          #op
          [appendTo]="'body'"
          [style]="{ width: '300px' }"
          [baseZIndex]="10000"
          [autoZIndex]="true"
        >
          <div class="flex flex-col">
            @let data = marker.data;
            <p class="font-semibold text-surface-700 text-lg">
              {{ data.title }}
            </p>
            <p>{{ data.event_type.name }}</p>
            <p>
              {{ data.start_date | date : 'short' }} -
              {{ data.end_date | date : 'short' }}
            </p>
            <p>Participantes: {{ data.participants.length }}</p>
            <p>
              Creado por: {{ data.created_by.given_name }}
              {{ data.created_by.family_name }}
            </p>
          </div></p-popover
        >
        }
      </div>
    </ng-template>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsCalendarComponent {
  public calendarMonth = signal({ end: new Date(), start: new Date() });
  private dialogService = inject(DialogService);
  eventsResource = httpResource<Event[]>(
    () => ({
      url: '/api/events',
      method: 'GET',
      params: {
        start_date: formatDate(this.calendarMonth().start, 'yyyy-MM-dd'),
        end_date: formatDate(this.calendarMonth().end, 'yyyy-MM-dd'),
      },
    }),
    {
      defaultValue: [],
    }
  );
  eventDates = computed(() =>
    this.eventsResource
      .value()
      .map((data) =>
        eachDayOfInterval({
          start: new TZDate(data.start_date, 'America/Panama'),
          end: new TZDate(data.end_date, 'America/Panama'),
        }).map((date) => ({ date, data }))
      )
      .flat()
  );

  createEvent(date: Date = new Date()) {
    const ref = this.dialogService.open(EventFormComponent, {
      header: 'Crear evento',
      width: '70%',
      data: {
        date,
      },
      modal: true,
    });
    ref.onClose.subscribe((event) => {
      if (event) {
        this.eventsResource.reload();
      }
    });
  }
}
