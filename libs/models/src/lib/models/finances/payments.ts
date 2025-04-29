import { User } from '../people/users';
import { Charge } from './charges';

export type Payment = {
  id: string;
  charge: Charge | string;
  user: User | string;
  amount: number;
  date: Date;
  comments: string;
  created_at?: Date;
  updated_at?: Date;
};
