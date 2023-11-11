import { ProviderToken } from '@angular/core';
import { ServiceLocator } from '@app/utils';
import { map, Observable } from 'rxjs';
import { ApiAbstractionService } from './api-abstraction.service';
import {
  CommonDataControlAbstraction,
  ICommonDataControl,
} from './common-data-control-abstraction';
import { StoreAbstraction } from './store-abstraction.service';

type FetchProcedure = 'STORE_THEN_API' | 'FETCH_FROM_STORE' | 'FETCH_FROM_API';

export interface IBaseModel<T> extends ICommonDataControl<T> {
  id: number;

  addItemSelect$(): Observable<T>;

  fetchItemSelect$(id: number, fetchProcedure?: FetchProcedure): Observable<T>;

  updateItemSelect$(): Observable<T>;

  patchItemSelect$(props: string[]): Observable<T>;

  deleteItem$(): Observable<boolean>;

  fetchAllSelect$(fetchProcedure?: FetchProcedure): Observable<T[]>;
}

export abstract class BaseModel<T>
  extends CommonDataControlAbstraction<T>
  implements IBaseModel<T>
{
  id = 0;
  #apiService!: ApiAbstractionService<T>;
  #localStore!: StoreAbstraction<T>;

  setApiService(token: ProviderToken<ApiAbstractionService<T>>): void {
    this.#apiService = ServiceLocator.injector.get(token);
  }

  setLocalStore(token: ProviderToken<StoreAbstraction<T>>): void {
    this.#localStore = ServiceLocator.injector.get(token);
  }

  addItemSelect$(): Observable<T> {
    this.#validateModelBelongings();
    return this.#apiService.create(this).pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this.#getThisAsTEntity();
      }),
    );
  }

  fetchItemSelect$(
    id: number,
    fetchProcedure: FetchProcedure = 'STORE_THEN_API',
  ): Observable<T> {
    this.#validateModelBelongings();

    let fetchLocation$: Observable<T>;
    switch (fetchProcedure) {
      case 'STORE_THEN_API': {
        const storeItem = this.#localStore.getEntityById(id);
        const isItemLoading = this.#localStore.isEntityLoading(id);

        if (storeItem || isItemLoading) {
          fetchLocation$ = this.#localStore.selectLoadingEntityById$(id);
        } else {
          fetchLocation$ = this.#apiService.read(id);
        }
        break;
      }
      case 'FETCH_FROM_STORE': {
        fetchLocation$ = this.#localStore.selectEntityById$(id);
        break;
      }
      case 'FETCH_FROM_API': {
        fetchLocation$ = this.#apiService.read(id);
        break;
      }
    }

    return fetchLocation$.pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this.#getThisAsTEntity();
      }),
    );
  }

  updateItemSelect$(): Observable<T> {
    this.#validateModelBelongings();
    return this.#apiService.update(this).pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this.#getThisAsTEntity();
      }),
    );
  }

  patchItemSelect$(props: string[]): Observable<T> {
    this.#validateModelBelongings();
    return this.#apiService.patch(this, props).pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this.#getThisAsTEntity();
      }),
    );
  }

  deleteItem$(): Observable<boolean> {
    this.#validateModelBelongings();
    return this.#apiService.delete(this.id);
  }

  fetchAllSelect$(): Observable<T[]> {
    this.#validateModelBelongings();
    return this.#apiService.list();
  }

  #getThisAsTEntity(): T {
    // workaround to dump un necessities from the BaseModel
    return this as unknown as T;
  }

  #validateModelBelongings(): void {
    if (!this.#apiService) {
      throw new Error(
        'API service is missing from the model ' + this.constructor.name,
      );
    }
    if (!this.#localStore) {
      throw new Error(
        'Local store is missing from the model ' + this.constructor.name,
      );
    }
  }
}
