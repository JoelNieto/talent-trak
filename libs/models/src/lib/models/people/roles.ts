import { Company } from '../company/companies';

export type Role = {
  id: string;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
  is_admin: boolean;
  is_super_admin: boolean;
  is_employee: boolean;
  is_client: boolean;
};

export type UserRole = {
  company: Company;
  role: Role;
};
