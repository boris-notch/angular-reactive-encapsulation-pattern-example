import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environment/environment';

import { AppComponent } from './app.component';
import { elfDevtools } from './elf-dev-tools';
import { ProductFormComponent } from './layout/product-form/product-form.component';
import { ProductListComponent } from './layout/product-list/product-list.component';
import { ServiceLocator } from './model-data-hub/locator.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ProductListComponent,
    ProductFormComponent,
  ],
  providers: [!environment.production ? elfDevtools() : []],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    ServiceLocator.injector = injector;
  }
}
