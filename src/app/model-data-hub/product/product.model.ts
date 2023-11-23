import { Nullable } from '@app/utils';
import { BaseModel, IBaseModel } from '../_dependencies/base-model-abstraction';
import { ProductApiService } from './product-api.service';
import { ProductStore } from './product.store';

export interface IProduct extends IBaseModel<IProduct> {
  name: Nullable<string>;
  description: Nullable<string>;
  price: Nullable<null>;
  quantity: Nullable<null>;
}

export class Product extends BaseModel<Product> implements IProduct {
  public name: Nullable<string> = null;
  public description: Nullable<string> = null;
  public price: Nullable<null> = null;
  public quantity: Nullable<null> = null;

  constructor() {
    super();
    this.setApiService(ProductApiService);
    this.setLocalStore(ProductStore);
  }
}
