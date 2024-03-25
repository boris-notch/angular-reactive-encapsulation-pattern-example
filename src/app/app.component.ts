import { Component } from '@angular/core';
import { ProductListComponent } from './layout/product-list/product-list.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [ProductListComponent],
})
export class AppComponent {
  title = 'angular-data-model-encapsulation';
}
