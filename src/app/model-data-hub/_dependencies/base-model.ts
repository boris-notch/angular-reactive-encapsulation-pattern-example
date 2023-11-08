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

export interface IBaseModel<T> extends ICommonDataControl {
  id: number;

  create(): Observable<BaseModel<T>>;

  read(id: number, fetchProcedure?: FetchProcedure): Observable<BaseModel<T>>;

  update(): Observable<BaseModel<T>>;

  patch(props: string[]): Observable<BaseModel<T>>;

  delete(): Observable<boolean>;

  list(fetchProcedure?: FetchProcedure): Observable<BaseModel<T>[]>;
}

export class BaseModel<T> extends CommonDataControl implements IBaseModel<T> {
  id = 0;
  #apiService!: ApiAbstractionService<BaseModel<T>>;
  #localStore!: StoreAbstraction<BaseModel<T>>;

  setApiService(
    token: ProviderToken<ApiAbstractionService<BaseModel<T>>>,
  ): void {
    this.#apiService = ServiceLocator.injector.get(token);
  }

  setLocalStore<T>(token: ProviderToken<StoreAbstraction<BaseModel<T>>>): void {
    this.#localStore = ServiceLocator.injector.get(token);
  }

  create(): Observable<BaseModel<T>> {
    this.#validateModelBelongings();
    return this.#apiService.create(this).pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this;
      }),
    );
  }

  read(
    id: number,
    fetchProcedure: FetchProcedure = 'STORE_THEN_API',
  ): Observable<BaseModel<T>> {
    this.#validateModelBelongings();

    let fetchLocation$: Observable<BaseModel<T>>;
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
        return this;
      }),
    );
  }

  update(): Observable<BaseModel<T>> {
    this.#validateModelBelongings();
    return this.#apiService.update(this).pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this;
      }),
    );
  }

  patch(props: string[]): Observable<BaseModel<T>> {
    this.#validateModelBelongings();
    return this.#apiService.patch(this, props).pipe(
      map((item) => {
        this.copyValuesFrom(item);
        return this;
      }),
    );
  }

  delete(): Observable<boolean> {
    this.#validateModelBelongings();
    return this.#apiService.delete(this.id);
  }

  list(): Observable<BaseModel<T>[]> {
    this.#validateModelBelongings();
    return this.#apiService.list();
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
