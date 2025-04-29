import { Charge, Payment, User } from '@talent-trak/models';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChargeEntity } from '../../charges/entities/charge.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'payments' })
export class PaymentEntity implements Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ChargeEntity, { eager: true })
  @JoinColumn({ name: 'charge_id' })
  charge: Charge;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
