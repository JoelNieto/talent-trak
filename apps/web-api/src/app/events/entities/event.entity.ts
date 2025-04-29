import { Company, Event, EventType, User } from '@talent-trak/models';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { EventTypeEntity } from '../../event-types/entities/event-type.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'events' })
export class EventEntity implements Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @ManyToOne(() => CompanyEntity, {
    eager: true,
    cascade: ['soft-remove', 'recover'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'company_id' })
  company: string | Company;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'timestamp', nullable: false })
  start_date: Date;

  @ManyToMany(() => UserEntity, { eager: true })
  @JoinTable({
    name: 'event_participants',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  participants: string[] | User[];

  @Column({ type: 'timestamp', nullable: false })
  end_date: Date;

  @ManyToOne(() => EventTypeEntity, { eager: true })
  @JoinColumn({ name: 'event_type_id' })
  event_type: string | EventType;

  @Column({ type: 'text', nullable: false })
  location: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'created_by' })
  created_by: string | User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
