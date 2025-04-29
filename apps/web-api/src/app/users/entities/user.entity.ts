import { Role, User } from '@talent-trak/models';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity({ name: 'users' })
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  avatar_url?: string;

  @Column({ type: 'text', nullable: false })
  given_name: string;

  @Column({ type: 'text', nullable: false })
  family_name: string;

  @Column({ type: 'text', nullable: false, unique: true })
  document_id: string;

  @Column({ type: 'text', nullable: false })
  document_type: 'PASSPORT' | 'ID_CARD' | 'DRIVER_LICENSE';

  @ManyToMany(() => RoleEntity, {
    eager: true,
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @Column({ type: 'text', nullable: false, default: 'FEMALE' })
  gender: 'FEMALE' | 'MASCULINE' | 'OTHER';

  @Column({ type: 'date', nullable: false })
  birth_date: Date;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  phone: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_logged_in: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
