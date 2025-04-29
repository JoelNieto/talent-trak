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
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Payment } from '@talent-trak/models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { filter, of, pipe, switchMap, tap } from 'rxjs';
import { UsersStore } from './users.store';

type State = {
  isLoading: boolean;
  error: any | null;
  userId: EntityId | null;
};

export const UserPaymentsStore = signalStore(
  withState<State>({ isLoading: false, error: null, userId: null }),
  withEntities<Payment>(),
  withProps(() => ({
    _http: inject(HttpClient),
    _message: inject(MessageService),
    _confirm: inject(ConfirmationService),
    _users: inject(UsersStore),
  })),
  withMethods((state) => ({
    setUserId: (userId: string | null) => {
      patchState(state, { userId });
    },
    fetchPayment: rxMethod<EntityId | null>(
      pipe(
        filter((userId) => !!userId),
        tap(() => patchState(state, { isLoading: true, error: null })),
        switchMap((userId) =>
          state._http
            .get<Payment[]>(`/api/payments`, { params: { user_id: userId! } })
            .pipe(
              tapResponse({
                next: (payments) => {
                  patchState(state, setAllEntities(payments));
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
    addPayment: (payment: Partial<Payment>) =>
      of(payment).pipe(
        tap(() => patchState(state, { isLoading: true, error: null })),
        switchMap((payment) =>
          state._http.post<Payment>(`/api/payments`, payment).pipe(
            tapResponse({
              next: (payment) => {
                state._message.add({
                  severity: 'success',
                  detail: 'Pago realizado exitosamente',
                  summary: 'Pago agregado',
                });
                patchState(state, addEntity(payment));
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
    deletePayment: (paymentId: string) =>
      of(paymentId).pipe(
        tap(() => patchState(state, { isLoading: true, error: null })),
        switchMap((paymentId) =>
          state._http.delete(`/api/payments/${paymentId}`).pipe(
            tapResponse({
              next: () => {
                patchState(state, removeEntity(paymentId));
                state._message.add({
                  severity: 'success',
                  detail: 'Pago eliminado correctamente',
                  summary: 'Pago eliminado',
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
    onInit({ fetchPayment, _users }) {
      fetchPayment(_users.selectedEntityId());
    },
  })
);
