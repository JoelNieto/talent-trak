import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  EntityId,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Item } from '@talent-trak/models';
import { differenceInSeconds } from 'date-fns';
import { ConfirmationService, MessageService } from 'primeng/api';
import { filter, of, pipe, switchMap, tap } from 'rxjs';

type State = {
  error: any;
  isLoading: boolean;
  selectedEntityId: EntityId | null;
  lastUpdated: Date | null;
};

export const ItemsStore = signalStore(
  withState<State>({
    isLoading: false,
    error: null,
    selectedEntityId: null,
    lastUpdated: null,
  }),
  withEntities<Item>(),
  withProps(() => ({
    _http: inject(HttpClient),
    _message: inject(MessageService),
    _confirm: inject(ConfirmationService),
  })),
  withMethods((state) => ({
    selectEntity: (id: EntityId) => {
      patchState(state, { selectedEntityId: id });
    },
    fetchItems: rxMethod<void>(
      pipe(
        filter(
          () =>
            state.lastUpdated() === null ||
            differenceInSeconds(new Date(), state.lastUpdated() as Date) > 30
        ),
        tap(() => patchState(state, { isLoading: true })),
        switchMap(() =>
          state._http.get<Item[]>('/api/items').pipe(
            tapResponse({
              next: (items) => {
                patchState(state, setAllEntities(items), {
                  lastUpdated: new Date(),
                });
              },
              error: (error) => {
                patchState(state, { error });
                state._message.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error cargando los items',
                });
              },
              finalize: () => patchState(state, { isLoading: false }),
            })
          )
        )
      )
    ),
    createItem(request: FormData) {
      return of(request).pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap(() =>
          state._http.post<Item>('/api/items', request).pipe(
            tapResponse({
              next: (item) => {
                patchState(state, addEntity(item));
                state._message.add({
                  severity: 'success',
                  summary: 'Item creado',
                  detail: 'Item creado correctamente',
                });
              },
              error: (error) => {
                patchState(state, { error });
                state._message.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error creando el item',
                });
              },
              finalize: () => patchState(state, { isLoading: false }),
            })
          )
        )
      );
    },
    editItem({ id, request }: { id: EntityId; request: FormData }) {
      return of(request).pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap(() =>
          state._http.patch<Item>(`/api/items/${id}`, request).pipe(
            tapResponse({
              next: (item) => {
                patchState(state, updateEntity({ id, changes: item }));
                state._message.add({
                  severity: 'success',
                  summary: 'Item editado',
                  detail: 'Item editado correctamente',
                });
              },
              error: (error) => {
                patchState(state, { error });
                state._message.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error editando el item',
                });
              },
              finalize: () => patchState(state, { isLoading: false }),
            })
          )
        )
      );
    },
    deleteItem(id: string) {
      state._confirm.confirm({
        header: 'Confirmación',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-info-circle',
        message: '¿Está seguro que desea eliminar este elemento?',
        rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
          icon: 'pi pi-times',
          rounded: true,
        },
        acceptButtonProps: {
          label: 'Eliminar',
          severity: 'error',
          icon: 'pi pi-trash',
          rounded: true,
        },
        accept: () => {
          patchState(state, { isLoading: true, error: null });
          state._http
            .delete(`/api/items/${id}`)
            .pipe(
              tapResponse({
                next: () => {
                  patchState(state, removeEntity(id));
                  state._message.add({
                    severity: 'info',
                    detail: 'Elemento eliminado con exito',
                    summary: 'Exito',
                  });
                },
                error: (error) => {
                  state._message.add({
                    severity: 'error',
                    detail: 'Algo salio mal, intente de nuevo',
                    summary: 'Error',
                  });
                  patchState(state, { error });
                  console.error(error);
                },
                finalize: () => patchState(state, { isLoading: false }),
              })
            )
            .subscribe();
        },
      });
    },
  })),
  withHooks({ onInit: ({ fetchItems }) => fetchItems() })
);
