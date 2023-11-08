import {ENVIRONMENT_INITIALIZER} from '@angular/core';
import {devTools} from '@ngneat/elf-devtools';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function elfDevtools() {
  return {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory: () => () => devTools(),
  };
}
