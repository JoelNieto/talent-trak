import { User } from '../people/users';
import { Company } from './companies';

export type EventType = {
  id: string;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
};

export type Event = {
  id: string;
  title: string;
  company: Company | string;
  description: string;
  comments: string;
  start_date: Date;
  participants: User[] | string[];
  end_date: Date;
  event_type: EventType | string;
  location: string;
  is_active: boolean;
  created_by: User | string;
  created_at?: Date;
  updated_at?: Date;
};
