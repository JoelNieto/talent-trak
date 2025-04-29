import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: ` <router-outlet /> `,
  styles: ``,
})
export class AppComponent {
  title = 'web-app';
  public auth = inject(AuthService);
}
