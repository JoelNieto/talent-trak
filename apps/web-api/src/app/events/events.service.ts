import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity) private repo: Repository<EventEntity>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly usersService: UsersService
  ) {}

  async create(createEventDto: CreateEventDto) {
    try {
      const users = await this.usersService.findUsers(
        createEventDto.participants as string[]
      );
      if (users.length !== createEventDto.participants.length) {
        Logger.warn('Some participants not found', {
          participants: createEventDto.participants,
          found: users.map((user) => user.id),
        });
      }
      createEventDto.participants = users;
      const user = this.request['user'];
      const item = this.repo.create({ ...createEventDto, created_by: user });
      await this.repo.save(item);
      return this.repo.findOne({ where: { id: item.id } });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creating event',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error }
      );
    }
  }

  async findAll({
    startDate,
    endDate,
  }: { startDate?: string; endDate?: string } = {}) {
    if (startDate && endDate) {
      return this.repo
        .find({
          where: {
            start_date: LessThanOrEqual(new Date(endDate)),
            end_date: MoreThanOrEqual(new Date(startDate)),
          },
        })
        .then((events) =>
          events.map((event) => ({
            ...event,
            participants: event.participants.map((user) => ({
              id: user.id,
              given_name: user.given_name,
              family_name: user.family_name,
              email: user.email,
            })),
          }))
        );
    }
    return this.repo.find().then((events) =>
      events.map((event) => ({
        ...event,
        participants: event.participants.map((user) => ({
          id: user.id,
          given_name: user.given_name,
          family_name: user.family_name,
          email: user.email,
        })),
      }))
    );
  }

  findOne(id: string) {
    return this.repo.findOneByOrFail({ id });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const item = await this.repo.preload({
      id,
      ...updateEventDto,
      updated_at: new Date(),
    });
    if (!item) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Event not found' },
        HttpStatus.NOT_FOUND,
        { cause: 'item' }
      );
    }
    try {
      await this.repo.save(item);
      return this.repo.findOneOrFail({ where: { id: item.id } });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error updating event',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error }
      );
    }
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
