import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  model,
  OnInit,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfToday,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-calendar',
  imports: [Button, NgClass, DatePipe, NgTemplateOutlet],
  template: `<div class="calendar-container">
    <header class="calendar-header my-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-surface-500">
        {{ this.currentMonth() }}
      </h2>

      <div class="flex items-center gap-1">
        <p-button
          rounded
          icon="pi pi-plus-circle"
          label="Agregar"
          severity="success"
          (onClick)="this.newEvent.emit(undefined)"
        />
        <p-button
          (onClick)="this.toCurrentMonth()"
          label="Mes actual"
          rounded
          [disabled]="isCurrentMonth()"
        />
        <p-button
          icon="pi pi-chevron-left"
          outlined
          rounded
          (onClick)="prevMonth()"
        />
        <p-button
          icon="pi pi-chevron-right"
          rounded
          outlined
          (onClick)="nextMonth()"
        />
      </div>
    </header>
    <div
      class="mt-4 grid grid-cols-7 text-center text-xs leading-6 text-surface-600"
    >
      @for (item of this.dayNamesFormatted; track item.dayName) {
      <div
        class="uppercase"
        [ngClass]="[
          item.isToday ? 'text-primary' : 'text-slate-500',
          item.isToday ? 'font-bold' : 'font-normal'
        ]"
      >
        {{ item.dayName }}
      </div>
      }
    </div>
    <div class="calendar-grid mt-2 grid grid-cols-7 gap-1 text-sm">
      @for (day of daysWithMarkers(); track day.day) {
      <div
        [ngClass]="[
          'mx-auto',
          'relative',
          'flex',
          'h-24',
          'md:h-24',
          'md:h-28',
          'w-full',
          'flex-col',
          'hover:cursor-pointer',
          'hover:bg-surface-100',
          'hover:shadow-sm',
          'items-center',
          'justify-center',
          'rounded-xl',
          'overflow-y-auto',
          'bg-surface-50',
          day.colStartClass,
          'text-tertiary',
          day.isToday ? 'font-semibold text-primary-600' : 'font-normal'
        ]"
      >
        <div class="w-full flex-auto p-2 overflow-y-scroll">
          @if (this.markerTpl(); as markerTpl) {
          <ng-container
            *ngTemplateOutlet="markerTpl; context: { $implicit: day.markers }"
          ></ng-container>
          }
        </div>
        <footer
          class="flex h-4 w-4 p-2 flex-shrink-0 items-center justify-center rounded-full text-lg md:absolute md:bottom-2 md:right-2 md:self-end"
        >
          {{ day.day | date : 'd' }}
        </footer>
      </div>
      }
    </div>
  </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  public markers = input<CalendarMarkerData[], CalendarMarkerData[] | null>(
    [],
    {
      transform: (data) => data || [],
    }
  );

  private injector = inject(Injector);

  public newEvent = output<Date | undefined>();

  public markerTpl = input<TemplateRef<{ $implicit: CalendarMarkerData[] }>>();

  public currentRange = model<{ start: Date; end: Date }>();

  protected currentDate = signal(startOfToday());
  protected currentMonth = computed(() =>
    format(this.currentDate(), 'MMMM yyyy', { locale: es })
  );

  ngOnInit(): void {
    effect(
      () => {
        this.currentRange.set({
          start: this.startOfSelectedMonth(),
          end: this.endOfSelectedMonth(),
        });
      },
      { injector: this.injector }
    );
  }

  protected readonly startOfSelectedMonth = computed(() =>
    startOfMonth(this.currentDate())
  );
  protected readonly endOfSelectedMonth = computed(() =>
    endOfMonth(this.currentDate())
  );

  protected readonly days = computed(() =>
    eachDayOfInterval({
      start: this.startOfSelectedMonth(),
      end: this.endOfSelectedMonth(),
    })
  );

  readonly #COL_START_CLASSES = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
  ];

  readonly #markersMap = computed(() => {
    const map: Map<string, CalendarMarkerData[]> = new Map();
    this.markers().forEach((marker) => {
      const { date } = marker;

      const markers = map.get(this.getMarkerMapKey(date)) || [];

      markers.push(marker);
      map.set(this.getMarkerMapKey(date), markers);
    });

    return map;
  });

  protected readonly daysWithMarkers = computed(() =>
    this.days().map((day, i) => ({
      day,
      isToday: isSameDay(day, startOfToday()),
      colStartClass: i === 0 ? this.#COL_START_CLASSES[day.getDay()] : '',
      markers: this.#markersMap().get(this.getMarkerMapKey(day)) || [],
    }))
  );

  readonly #dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

  protected isCurrentMonth = computed(() =>
    isSameMonth(new Date(), this.currentDate())
  );

  protected readonly dayNamesFormatted = this.#dayNames.map((dayName) => ({
    dayName,
    isToday: dayName === format(startOfToday(), 'EEE', { locale: es }),
  }));

  protected nextMonth() {
    this.currentDate.update((date) => addMonths(date, 1));
  }

  protected prevMonth() {
    this.currentDate.update((date) => subMonths(date, 1));
  }

  protected toCurrentMonth() {
    this.currentDate.set(startOfToday());
  }

  protected getMarkerMapKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }
}

export interface CalendarMarkerData<Data = any> {
  date: Date;
  data: Data;
}
