import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export interface AppConfig {
  apiBase: string;
  wsUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_CONFIG,
      useValue: {
        apiBase: 'http://localhost:4201/api',
        wsUrl: 'ws://localhost:4201/ws',
      } satisfies AppConfig,
    },
  ],
};
