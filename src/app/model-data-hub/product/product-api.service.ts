import { Injectable } from '@angular/core';
import { ApiAbstractionService } from '../_dependencies/api-abstraction.service';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService extends ApiAbstractionService<Product> {
  modelName = 'products';
}
