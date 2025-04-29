import { Role } from './roles';

export type User = {
  id: string;
  avatar_url?: string;
  given_name: string;
  family_name: string;
  document_id: string;
  document_type: 'PASSPORT' | 'ID_CARD' | 'DRIVER_LICENSE';
  roles: Role[];
  birth_date: Date;
  email: string;
  phone: string;
  gender: 'FEMALE' | 'MASCULINE' | 'OTHER';
  address: string;
  is_active: boolean;
  is_logged_in: boolean;
  created_at?: Date;
  updated_at?: Date;
};
