import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chip',
  template: `<div
    class="px-3 py-1.5 rounded-full bg-primary-100 font-semibold text-primary-600 text-sm flex items-center gap-2"
  >
    <ng-content />
  </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {}
