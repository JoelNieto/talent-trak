import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChargeConceptDto } from './dto/create-charge-concept.dto';
import { UpdateChargeConceptDto } from './dto/update-charge-concept.dto';
import { ChargeConceptEntity } from './entities/charge-concept.entity';

@Injectable()
export class ChargeConceptsService {
  constructor(
    @InjectRepository(ChargeConceptEntity)
    private repo: Repository<ChargeConceptEntity>
  ) {}

  create(createChargeConceptDto: CreateChargeConceptDto) {
    const item = this.repo.create(createChargeConceptDto);
    return this.repo.save(item);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneByOrFail({ id });
  }

  async update(id: string, updateChargeConceptDto: UpdateChargeConceptDto) {
    const item = await this.repo.preload({
      id,
      ...updateChargeConceptDto,
    });

    if (!item) {
      throw new Error(`ChargeConcept with id ${id} not found`);
    }
    return this.repo.save(item);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
