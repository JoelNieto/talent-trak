import { Item, ItemType } from '@talent-trak/models';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemTypeEntity } from '../../item-types/entities/item-type.entity';

@Entity({ name: 'items' })
export class ItemEntity implements Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  picture_url?: string;

  @ManyToOne(() => ItemTypeEntity, { eager: true })
  @JoinColumn({ name: 'item_type_id' })
  type: ItemType;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
