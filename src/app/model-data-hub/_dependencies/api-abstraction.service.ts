import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseModel } from './base-model';

export abstract class ApiAbstractionService<T> {
  private apiUrl = 'http://localhost:3000'; // mocked server host
  abstract modelName: string;

  private http = inject(HttpClient);

  create(item: T): Observable<T> {
    return this.http.post<any>(this.#buildUri(), item);
  }

  read(id: string): Observable<T> | never {
    return this.http.get<any>(`${this.#buildUri(id)}`);
  }

  update(item: T & IBaseModel<T>): Observable<T> {
    return this.http.put<any>(`${this.#buildUri(item.id)}`, item);
  }

  patch(item: T & IBaseModel<T>, propsToUpdate: string[]): Observable<T> {
    return this.http.patch<any>(`${this.#buildUri(item.id)}`, item);
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<any>(`${this.#buildUri(id)}`);
  }

  list(): Observable<T[]> {
    return this.http.get<any[]>(this.#buildUri());
  }

  #buildUri(id?: string): string {
    const uri = `${this.apiUrl}/${this.modelName}`;

    return id ? `${uri}/${id}` : uri;
  }
}
