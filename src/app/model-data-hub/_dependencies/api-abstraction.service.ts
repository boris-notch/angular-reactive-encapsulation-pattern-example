import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { pick } from 'lodash-es';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { IBaseModel } from './base-model-abstraction';
import { StoreAbstraction } from './store-abstraction.service';

export abstract class ApiAbstractionService<T> {
  private apiUrl = environment.serverDomain;
  abstract modelName: string;
  abstract store: StoreAbstraction<T>;
  private http = inject(HttpClient);

  create(item: IBaseModel<T>): Observable<T> {
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

  update(item: IBaseModel<T>): Observable<T> {
    return this.http.put<any>(`${this.#buildUri(item.id)}`, item).pipe(
      switchMap((resp) => {
        this.store.updateOrAddItem(item.id, resp);
        return this.store.selectEntityById$(item.id);
      }),
    );
  }

  patch(item: IBaseModel<T>, propsToUpdate: string[]): Observable<T> {
    if (propsToUpdate.length < 0) {
      throw new Error(`Patch request is empty`);
    }
    return this.http
      .patch<any>(`${this.#buildUri(item.id)}`, pick(item, propsToUpdate))
      .pipe(
        switchMap((resp) => {
          this.store.updateOrAddItem(item.id, resp);
          return this.store.selectEntityById$(item.id);
        }),
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.#buildUri(id)}`).pipe(
      catchError((err) => {
        return throwError(err);
      }),
      map((resp) => {
        return true;
      }),
      tap((resp) => {
        this.store.deleteItem(id);
      }),
    );
  }

  list(): Observable<T[]> {
    return this.http.get<any[]>(this.#buildUri()).pipe(
      tap((resp) => {
        this.store.replaceList(resp);
      }),
      switchMap((resp) => {
        this.store.replaceList(resp);
        return this.store.selectAll$;
      }),
    );
  }

  #buildUri(id?: number): string {
    const uri = `${this.apiUrl}/${this.modelName}`;
    return id ? `${uri}/${id}` : uri;
  }
}
