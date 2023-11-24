import { inject, Injectable } from '@angular/core';
import { Product } from '@app/models';
import { ApiAbstractionService } from '../_dependencies/api-abstraction.service';
import { ProductStore } from './product.store';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService extends ApiAbstractionService<Product> {
  endpointName = 'products';
  store = inject(ProductStore);
}
