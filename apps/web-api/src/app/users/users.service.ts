import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
    private readonly roles: RolesService
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      if (!createUserDto.roles.length) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Roles are required',
          },
          HttpStatus.BAD_REQUEST
        );
      }
      const roles = await this.roles.findRoles(createUserDto.roles as string[]);
      if (roles.length !== createUserDto.roles.length) {
        Logger.warn('Some roles not found', {
          roles: createUserDto.roles,
          found: roles.map((role) => role.id),
        });
      }
      const item = this.repo.create({ ...createUserDto, roles });
      await this.repo.save(item);
      return this.repo.findOne({ where: { id: item.id } });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creating user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error }
      );
    }
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneByOrFail({ id });
  }

  findUsers(ids: string[]) {
    return this.repo.findBy({ id: In(ids) });
  }

  findByEmail(email: string) {
    return this.repo.findOneByOrFail({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!updateUserDto.roles.length) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Roles are required',
          },
          HttpStatus.BAD_REQUEST
        );
      }
      const roles = await this.roles.findRoles(updateUserDto.roles as string[]);
      const item = await this.repo.preload({
        id,
        ...updateUserDto,
        roles,
        updated_at: new Date(),
      });
      await this.repo.save(item);
      return this.repo.findOne({ where: { id: item.id } });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error updating user',
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
