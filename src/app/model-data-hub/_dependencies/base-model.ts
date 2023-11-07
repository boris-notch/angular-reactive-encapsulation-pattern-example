import { inject, ProviderToken } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiAbstractionService } from './api-abstraction.service';
import { CommonDataControl, ICommonDataControl } from './common-data-control';

export interface IBaseModel<T> extends ICommonDataControl {
  id: string;

  create(): Observable<BaseModel<T>>;

  read(id: string): Observable<BaseModel<T>>;

  update(): Observable<BaseModel<T>>;

  patch(props: string[]): Observable<BaseModel<T>>;

  delete(): Observable<boolean>;

  list(): Observable<BaseModel<T>[]>;
}

export class BaseModel<T> extends CommonDataControl implements IBaseModel<T> {
  id = '';
  #apiService!: ApiAbstractionService<BaseModel<T>>;

  setApiService(
    token: ProviderToken<ApiAbstractionService<BaseModel<T>>>,
  ): void {
    this.#apiService = inject(token);
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

  read(id: string): Observable<BaseModel<T>> {
    this.#validateModelBelongings();

    return this.#apiService.read(id).pipe(
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
  }
}
