import { ProviderToken } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ServiceLocator } from '../locator.service';
import { ApiAbstractionService } from './api-abstraction.service';
import { CommonDataControl, ICommonDataControl } from './common-data-control';
import { StoreAbstraction } from './store-abstraction.service';

export type FetchProcedure =
  | 'STORE_THEN_API'
  | 'FETCH_FROM_STORE'
  | 'FETCH_FROM_API';
type CommonProps<T, U> = {
  [K in Extract<keyof T, keyof U>]: T[K];
};

export interface IBaseModel<T> extends ICommonDataControl<T> {
  id: number;

  create(): Observable<T>;

  read(id: number, fetchProcedure?: FetchProcedure): Observable<T>;

  update(): Observable<T>;

  patch(props: string[]): Observable<T>;

  delete(): Observable<boolean>;

  list(fetchProcedure?: FetchProcedure): Observable<T[]>;
}

export class BaseModel<T>
  extends CommonDataControl<T>
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

  create(): Observable<T> {
    this.#validateModelBelongings();
    return this.#apiService.create(this).pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this.#getThisAsTEntity();
      }),
    );
  }

  read(
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

  update(): Observable<T> {
    this.#validateModelBelongings();
    return this.#apiService.update(this).pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this.#getThisAsTEntity();
      }),
    );
  }

  patch(props: string[]): Observable<T> {
    this.#validateModelBelongings();
    return this.#apiService.patch(this, props).pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this.#getThisAsTEntity();
      }),
    );
  }

  delete(): Observable<boolean> {
    this.#validateModelBelongings();
    return this.#apiService.delete(this.id);
  }

  list(): Observable<T[]> {
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
