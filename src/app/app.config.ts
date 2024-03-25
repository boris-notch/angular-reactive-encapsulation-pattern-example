import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  Injector,
  LOCALE_ID,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { setupServiceLocator } from '@app/utils';
import { environment } from '../environment/environment';
import { elfDevtools } from './elf-dev-tools';

registerLocaleData(localeFr);
export const appConfig: ApplicationConfig = {
  providers: [
    !environment.production ? elfDevtools() : [],

    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (injector: Injector) => () => setupServiceLocator(injector),
      deps: [Injector],
      multi: true,
    },
    provideAnimations(),
    provideHttpClient(),
  ],
};
