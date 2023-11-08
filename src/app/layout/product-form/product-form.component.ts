import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../../model-data-hub/product/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {
  constructor() {
    const product = new Product();
  }
}
