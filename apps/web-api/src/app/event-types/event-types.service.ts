import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { EventTypeEntity } from './entities/event-type.entity';

@Injectable()
export class EventTypesService {
  constructor(
    @InjectRepository(EventTypeEntity) private repo: Repository<EventTypeEntity>
  ) {}
  create(createEventTypeDto: CreateEventTypeDto) {
    const item = this.repo.create(createEventTypeDto);
    return this.repo.save(item);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneByOrFail({ id });
  }

  async update(id: string, updateEventTypeDto: UpdateEventTypeDto) {
    const item = await this.repo.preload({
      id,
      ...updateEventTypeDto,
      updated_at: new Date(),
    });
    return this.repo.save(item);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
