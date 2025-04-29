import { signalStore, withHooks } from '@ngrx/signals';
import { ItemType } from '@talent-trak/models';
import { withCustomEntities } from './entity.feature';

export const ItemTypesStore = signalStore(
  withCustomEntities<ItemType>({ name: 'item-types' }),
  withHooks({ onInit: ({ fetchItems }) => fetchItems() })
);
