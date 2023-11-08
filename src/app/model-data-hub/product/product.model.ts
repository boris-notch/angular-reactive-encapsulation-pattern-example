import { BaseModel, IBaseModel } from '../_dependencies/base-model';
import { ProductApiService } from './product-api.service';
import { ProductStore } from './product.store';

export interface IProduct extends IBaseModel<IProduct> {
  name: string | null;
  description: string | null;
  price: number | null;
  availability: boolean | null;
}

export class Product extends BaseModel<Product> implements IProduct {
  public name: string | null = null;
  public description: string | null = null;
  public price: number | null = null;
  public availability: boolean | null = null;

  constructor() {
    super();
    this.setApiService(ProductApiService);
    this.setLocalStore(ProductStore);
  }
}
