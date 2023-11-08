import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { IBaseModel } from './base-model';
import { StoreAbstraction } from './store-abstraction.service';

export abstract class ApiAbstractionService<T> {
  private apiUrl = environment.serverDomain;
  abstract modelName: string;
  abstract store: StoreAbstraction<T>;
  private http = inject(HttpClient);

  create(item: T): Observable<T> {
    return this.http.post<any>(this.#buildUri(), item).pipe(
      switchMap((resp) => {
        this.store.addItem(resp);
        return this.store.selectEntityById$(resp.id);
      }),
    );
  }

  read(id: number): Observable<T> | never {
    this.store.setEntityStatusLoading(id);
    return this.http.get<any>(`${this.#buildUri(id)}`).pipe(
      switchMap((resp) => {
        this.store.updateOrAddItem(id, resp);
        return this.store.selectEntityById$(id);
      }),
    );
  }

  update(item: T & IBaseModel<T>): Observable<T> {
    return this.http.put<any>(`${this.#buildUri(item.id)}`, item);
  }

  patch(item: T & IBaseModel<T>, propsToUpdate: string[]): Observable<T> {
    if (propsToUpdate.length < 0) {
      throw new Error(`Patch request is empty`);
    }
    return this.http.patch<any>(
      `${this.#buildUri(item.id)}`,
      this.#keepSelectedProperties(item, propsToUpdate),
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.#buildUri(id)}`);
  }

  list(): Observable<T[]> {
    return this.http.get<any[]>(this.#buildUri());
  }

  #buildUri(id?: number): string {
    const uri = `${this.apiUrl}/${this.modelName}`;
    return id ? `${uri}/${id}` : uri;
  }

  #keepSelectedProperties<T>(
    obj: object,
    selectedProperties: (keyof T)[],
  ): Partial<T> {
    return Object.keys(obj).reduce((acc, key) => {
      const typedKey = key as keyof object;
      if (selectedProperties.includes(typedKey)) {
        acc[typedKey] = obj[typedKey];
      }
      return acc;
    }, {} as Partial<T>);
  }
}
