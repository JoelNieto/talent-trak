import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemEntity } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity) private repo: Repository<ItemEntity>,
    private readonly filesService: FilesService
  ) {}
  async create(createItemDto: CreateItemDto) {
    const { picture, ...itemData } = createItemDto;
    try {
      if (picture) {
        itemData.picture_url = await this.filesService.uploadFile(
          picture,
          'items'
        );
      }
      createItemDto = { ...itemData };
      const item = this.repo.create(createItemDto);
      await this.repo.save(item);
      return this.repo.findOneOrFail({ where: { id: item.id } });
    } catch (error) {
      Logger.error('Error uploading file', error);
      throw new Error('Error uploading file');
    }
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneOrFail({ where: { id } });
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    const { picture, picture_url, ...itemData } = updateItemDto;

    const item = await this.repo.preload({
      id,
      ...itemData,
      updated_at: new Date(),
    });

    try {
      if (picture && item.picture_url !== picture_url) {
        item.picture_url = await this.filesService.uploadFile(picture);
      }
      await this.repo.save(item);
      return this.repo.findOneOrFail({ where: { id: item.id } });
    } catch (error) {
      Logger.error('Error uploading file', error);
      throw new Error('Error uploading file');
    }
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
