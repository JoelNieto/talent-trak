import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { ItemTypeEntity } from './entities/item-type.entity';

@Injectable()
export class ItemTypesService {
  constructor(
    @InjectRepository(ItemTypeEntity) private repo: Repository<ItemTypeEntity>
  ) {}

  create(createItemTypeDto: CreateItemTypeDto) {
    const itemType = this.repo.create(createItemTypeDto);
    return this.repo.save(itemType);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, updateItemTypeDto: UpdateItemTypeDto) {
    const itemType = await this.repo.preload({
      id,
      ...updateItemTypeDto,
      updated_at: new Date(),
    });
    if (!itemType) {
      throw new Error(`ItemType with ID ${id} not found`);
    }
    return this.repo.save(itemType);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
