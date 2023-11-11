import { createState, Store, withProps } from '@ngneat/elf';
import {
  addEntities,
  deleteAllEntities,
  deleteEntities,
  getEntity,
  resetActiveId,
  selectAllEntities,
  selectEntity,
  setEntities,
  updateEntities,
  withActiveId,
} from '@ngneat/elf-entities';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';
import { ICommonDataControl } from './common-data-control-abstraction';

interface IClassType<T> extends Function {
  new (...args: any[]): T;
}

interface IStoreCustomProps {
  LoadingEntityIds: number[];
}

export const abstractStatePart = createState(
  withActiveId(),
  withProps<IStoreCustomProps>({ LoadingEntityIds: [] }),
).state;

export abstract class StoreAbstraction<T> {
  loadingEntitiesSubject: BehaviorSubject<number[]> = new BehaviorSubject<
    number[]
  >([]);
  loadingEntities$ = this.loadingEntitiesSubject.asObservable();

  #baseEntityModel!: IClassType<T & ICommonDataControl<T>>;

  selectAll$: Observable<T[]> = this.store.pipe(
    selectAllEntities(),
    shareReplay({ refCount: true }),
    map((items) => {
      return items.map((item) => {
        return this.#mapItemToClassInstance(item);
      });
    }),
  );

  selectEntityById$ = (id: number): Observable<T> =>
    this.store.pipe(
      selectEntity(id),
      map((item) => (item ? this.#mapItemToClassInstance(item) : item)),
    );

  protected constructor(protected store: Store) {}

  getEntityById = (id: number): T => {
    const item = this.store.query(getEntity(id));
    return item ? this.#mapItemToClassInstance(item) : item;
  };

  // region *** add / update / replace /delete ***
  clearActiveEntity(): void {
    this.store.update(resetActiveId());
  }

  deleteAllEntities(): void {
    this.store.update(deleteAllEntities());
  }

  addItem(item: T): void {
    const itemImmutable = { ...item } as T & { id: number };
    this.store.update(addEntities(itemImmutable));
    this.removeEntityStatusLoading(itemImmutable.id);
  }

  replaceItem(id: number, item: Partial<T>): void {
    const itemImmutable = { ...item };
    this.store.update(updateEntities(id, itemImmutable));
    this.removeEntityStatusLoading(id);
  }

  patchItem(id: number, item: Partial<T>): void {
    const itemImmutable = { ...item };
    this.store.update(
      updateEntities(id, (entity) => ({ ...entity, ...itemImmutable })),
    );
  }

  updateOrAddItem(id: number, item: T): void {
    if (this.getEntityById(id)) {
      this.replaceItem(id, item);
    } else {
      this.addItem(item);
    }
  }

  deleteItem(id: number): void {
    if (this.getEntityById(id)) {
      this.store.update(deleteEntities(id));
    }
  }

  replaceList(list: T[]): void {
    const listImmutable = JSON.parse(JSON.stringify(list));
    this.store.update(setEntities(listImmutable));
  }

  // endregion

  // region *** Entity Loading Status ***

  selectLoadingEntityById$(id: number): Observable<T> {
    let response: Observable<T>;
    if (this.isEntityLoading(id)) {
      response = this.loadingEntities$.pipe(
        filter((items) => {
          return !items.includes(id);
        }),
        switchMap((item) => {
          return this.selectEntityById$(id);
        }),
      );
    } else {
      response = this.selectEntityById$(id);
    }
    return response;
  }

  setEntityStatusLoading(id: number): void {
    this.store.update((state) => ({
      ...state,
      LoadingEntityIds: [...state.LoadingEntityIds, ...[id]],
    }));
    this.loadingEntitiesSubject.next(this.store.getValue().LoadingEntityIds);
  }

  removeEntityStatusLoading(id: number): void {
    this.store.update((state) => ({
      ...state,
      LoadingEntityIds: state.LoadingEntityIds.filter(
        (ItemId: number) => ItemId !== id,
      ),
    }));
    this.loadingEntitiesSubject.next(this.store.getValue().LoadingEntityIds);
  }

  isEntityLoading(id: number): boolean {
    return !!this.store
      .getValue()
      .LoadingEntityIds.find((ItemId: number) => ItemId === id);
  }

  // endregion

  // region *** Tools ***
  #mapItemToClassInstance(item: any): T {
    const result = new this.#baseEntityModel!();
    result.copyValuesFrom(item);
    return result;
  }

  toolsetBaseMapping(
    baseMappingClass: IClassType<T & ICommonDataControl<T>>,
  ): void {
    this.#baseEntityModel = baseMappingClass;
  }

  // endregion
}
