import { signalStore, withHooks } from '@ngrx/signals';
import { EventType } from '@talent-trak/models';
import { withCustomEntities } from './entity.feature';

export const EventTypesStore = signalStore(
  withCustomEntities<EventType>({ name: 'event-types' }),
  withHooks({ onInit: ({ fetchItems }) => fetchItems() })
);
