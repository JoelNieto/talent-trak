import { Role } from '@talent-trak/models';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity implements Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: false })
  is_admin: boolean;

  @Column({ type: 'boolean', default: false })
  is_super_admin: boolean;

  @Column({ type: 'boolean', default: false })
  is_employee: boolean;

  @Column({ type: 'boolean', default: false })
  is_client: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
