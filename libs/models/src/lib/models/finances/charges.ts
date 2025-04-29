import { Company } from '../company/companies';
import { User } from '../people/users';

export type Charge = {
  id: string;
  company: Company | string;
  name: string;
  concept: ChargeConcept | string;
  user: User | string;
  description: string;
  amount: number;
  balance: number;
  due_date: Date;
  is_paid: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type ChargeConcept = {
  id: string;
  name: string;
  description: string;
  amount: number;
};
