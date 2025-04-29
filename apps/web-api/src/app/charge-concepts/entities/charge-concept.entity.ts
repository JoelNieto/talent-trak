import { ChargeConcept } from '@talent-trak/models';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'charge_concepts' })
export class ChargeConceptEntity implements ChargeConcept {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;
}
