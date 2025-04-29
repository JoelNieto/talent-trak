import { User } from '../people/users';

export type Item = {
  id: string;
  picture_url?: string;
  name: string;
  type: ItemType | string;
  description: string;
  quantity: number;
  price: number;
  created_at?: Date;
  updated_at?: Date;
};

export type ItemType = {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export type ItemLending = {
  id: string;
  item: Item;
  user: User;
  start_date: Date;
  end_date: Date;
  is_returned: boolean;
  created_at: Date;
  updated_at: Date;
  return_date: Date;
  return_location: string;
  return_condition: string;
  return_notes: string;
};
