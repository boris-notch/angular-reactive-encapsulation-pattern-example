import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { Injector, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceLocator } from '@app/utils';
import { environment } from '../environment/environment';
import { AppComponent } from './app.component';
import { elfDevtools } from './elf-dev-tools';
import { ProductListComponent } from './layout/product-list/product-list.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ProductListComponent,
  ],
  providers: [
    !environment.production ? elfDevtools() : [],
    {
      provide: LOCALE_ID,
      useValue: 'fr',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    ServiceLocator.injector = injector;
  }
}
