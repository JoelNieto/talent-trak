import { Charge, ChargeConcept, Company, User } from '@talent-trak/models';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChargeConceptEntity } from '../../charge-concepts/entities/charge-concept.entity';
import { CompanyEntity } from '../../companies/entities/company.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'charges' })
export class ChargeEntity implements Charge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CompanyEntity, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'text', nullable: false })
  name: string;

  @ManyToOne(() => ChargeConceptEntity, { eager: true })
  @JoinColumn({ name: 'charge_concept_id' })
  concept: ChargeConcept;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  balance: number;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @Column({ type: 'boolean', default: false })
  is_paid: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
