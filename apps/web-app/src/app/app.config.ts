import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAnimationsAsync(),
    provideAuth0({
      domain: process.env['AUTH0_DOMAIN'] ?? '',
      clientId: process.env['AUTH0_CLIENT_ID'] ?? '',
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      authorizationParams: {
        redirect_uri: window?.location?.origin,
        audience: process.env['AUTH0_AUDIENCE'] ?? '',
        scope: 'openid profile email',
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `/api/*`,
            tokenOptions: {
              authorizationParams: {
                audience: process.env['AUTH0_AUDIENCE'] ?? '',
                scope: 'openid profile email',
              },
            },
          },
        ],
      },
    }),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, app, tailwind-utilities',
          },
        },
      },
    }),
    MessageService,
    ConfirmationService,
  ],
};
