import { signalStore, withHooks } from '@ngrx/signals';
import { Company } from '@talent-trak/models';
import { withCustomEntities } from './entity.feature';

export const CompaniesStore = signalStore(
  withCustomEntities<Company>({ name: 'companies' }),
  withHooks({ onInit: ({ fetchItems }) => fetchItems() })
);
