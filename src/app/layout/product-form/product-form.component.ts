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

    product.read(0.969562726693947).subscribe((resp) => {
      console.log('read', resp);
      const item = resp.cloneSerialized();
      resp.name = 'sdad3';
      resp.patch(resp.extractDifferentValuesFrom(item)).subscribe((resp) => {
        console.log('patch', resp);
      });
      console.log(resp.extractDifferentValuesFrom(item));
    });

    /*    product.list().subscribe((resp) => {
								  console.log('resp', resp);
								});*/
  }
}
