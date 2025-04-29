export * from './lib/models/company/companies';
export * from './lib/models/company/events';
export * from './lib/models/company/items';
export * from './lib/models/finances/charges';
export * from './lib/models/finances/payments';
export * from './lib/models/people/roles';
export * from './lib/models/people/users';
export type EntityDto<T> = Omit<
  T,
  'id' | 'created_at' | 'updated_at' | 'created_by'
>;
