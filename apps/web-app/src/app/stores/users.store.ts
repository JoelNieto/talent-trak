import { computed } from '@angular/core';
import { signalStore, withComputed, withHooks } from '@ngrx/signals';
import { User } from '@talent-trak/models';
import { withCustomEntities } from './entity.feature';

export const UsersStore = signalStore(
  withCustomEntities<User>({ name: 'users' }),
  withComputed((state) => ({
    users: computed(() =>
      state
        .entities()
        .map((user) => ({
          full_name: `${user.given_name} ${user.family_name}`,
          ...user,
        }))
    ),
  })),
  withHooks({
    onInit: ({ fetchItems }) => fetchItems(),
  })
);
