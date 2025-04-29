import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'uuid';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { ChargeEntity } from './entities/charge.entity';

@Injectable()
export class ChargesService {
  constructor(
    @InjectRepository(ChargeEntity) private repo: Repository<ChargeEntity>
  ) {}

  async create(createChargeDto: CreateChargeDto) {
    try {
      const charge = this.repo.create(createChargeDto);
      await this.repo.save(charge);
      return this.repo.findOne({ where: { id: charge.id } });
    } catch (error) {
      Logger.error('Error creating charge', error);
      throw new Error('Error creating charge');
    }
  }

  findAll({ userId }: { userId?: string }) {
    if (!userId) {
      return this.repo.find();
    }

    if (!validate(userId)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User Id is not a valid UUID',
        },
        HttpStatus.BAD_REQUEST,
        { cause: 'userId' }
      );
    }

    return this.repo.find({ where: { user: { id: userId } } });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, updateChargeDto: UpdateChargeDto) {
    try {
      const charge = await this.repo.preload({
        id,
        ...updateChargeDto,
        updated_at: new Date(),
      });
      await this.repo.save(charge);
      return this.repo.findOne({ where: { id: charge.id } });
    } catch (error) {
      Logger.error('Error updating charge', error);
      throw new Error('Error updating charge');
    }
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
