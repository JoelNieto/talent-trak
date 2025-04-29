import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Charge } from '@talent-trak/models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { filter, of, pipe, switchMap, tap } from 'rxjs';

type State = {
  isLoading: boolean;
  error: any | null;
  userId: string | undefined;
};

export const UserChargesStore = signalStore(
  withState<State>({ isLoading: false, error: null, userId: undefined }),
  withEntities<Charge>(),
  withProps(() => ({
    _http: inject(HttpClient),
    _message: inject(MessageService),
    _confirm: inject(ConfirmationService),
  })),
  withComputed((state) => ({
    balance: computed(() =>
      state.entities().reduce((acc, charge) => acc + Number(charge.balance), 0)
    ),
  })),
  withMethods((state) => ({
    setUserId: (userId: string | undefined) => {
      patchState(state, { userId });
    },
    fetchCharges: rxMethod<string | undefined>(
      pipe(
        filter((userId) => !!userId),
        tap(() => patchState(state, { isLoading: true, error: null })),
        switchMap((userId) =>
          state._http
            .get<Charge[]>(`/api/charges`, { params: { user_id: userId! } })
            .pipe(
              tapResponse({
                next: (charges) => {
                  patchState(state, setAllEntities(charges));
                },
                error: (error) => {
                  patchState(state, { error });
                  state._message.add({
                    severity: 'error',
                    detail: 'Algo salio mal, intente de nuevo',
                    summary: 'Error',
                  });
                },
                finalize: () => patchState(state, { isLoading: false }),
              })
            )
        )
      )
    ),
    addCharge: (charge: Charge) =>
      of(charge).pipe(
        tap(() => patchState(state, { isLoading: true, error: null })),
        switchMap((charge) =>
          state._http.post<Charge>(`/api/charges`, charge).pipe(
            tapResponse({
              next: (charge) => {
                patchState(state, addEntity(charge));
                state._message.add({
                  severity: 'success',
                  detail: 'Cargo creado correctamente',
                  summary: 'Carga creada',
                });
              },
              error: (error) => {
                patchState(state, { error });
                state._message.add({
                  severity: 'error',
                  detail: 'Algo salio mal, intente de nuevo',
                  summary: 'Error',
                });
              },
              finalize: () => patchState(state, { isLoading: false }),
            })
          )
        )
      ),
    editCharge: (charge: Charge) =>
      of(charge).pipe(
        tap(() => patchState(state, { isLoading: true, error: null })),
        switchMap((charge) =>
          state._http.patch<Charge>(`/api/charges/${charge.id}`, charge).pipe(
            tapResponse({
              next: (charge) => {
                patchState(state, addEntity(charge));
                state._message.add({
                  severity: 'success',
                  detail: 'Cargo editado correctamente',
                  summary: 'Carga editada',
                });
              },
              error: (error) => {
                patchState(state, { error });
                state._message.add({
                  severity: 'error',
                  detail: 'Algo salio mal, intente de nuevo',
                  summary: 'Error',
                });
              },
              finalize: () => patchState(state, { isLoading: false }),
            })
          )
        )
      ),
  })),
  withHooks({
    onInit({ fetchCharges, userId }) {
      fetchCharges(userId);
    },
  })
);
