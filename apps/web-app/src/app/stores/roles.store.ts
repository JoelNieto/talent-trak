import { signalStore, withHooks } from '@ngrx/signals';
import { Role } from '@talent-trak/models';
import { withCustomEntities } from './entity.feature';

export const RolesStore = signalStore(
  withCustomEntities<Role>({ name: 'roles' }),
  withHooks({ onInit: ({ fetchItems }) => fetchItems() })
);
