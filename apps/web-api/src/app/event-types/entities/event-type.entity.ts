import { EventType } from '@talent-trak/models';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'event_types' })
export class EventTypeEntity implements EventType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true, default: '' })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
