import { ItemType } from '@talent-trak/models';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'item_types' })
export class ItemTypeEntity implements ItemType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
