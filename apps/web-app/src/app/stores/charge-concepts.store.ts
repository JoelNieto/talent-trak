import { signalStore, withHooks } from '@ngrx/signals';
import { ChargeConcept } from '@talent-trak/models';
import { withCustomEntities } from './entity.feature';

export const ChargeConceptsStore = signalStore(
  withCustomEntities<ChargeConcept>({ name: 'charge-concepts' }),
  withHooks({ onInit: ({ fetchItems }) => fetchItems() })
);
