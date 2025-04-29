import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-boolean-icon',
  imports: [],
  template: `@if(value()) {
    <i class="pi pi-check text-green-500"></i>
    } @else {
    <i class="pi pi-times text-red-500"></i>
    }`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooleanIconComponent {
  public value = input.required<boolean>();
}
