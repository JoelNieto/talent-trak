import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity) private repo: Repository<RoleEntity>
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const item = this.repo.create(createRoleDto);
    return this.repo.save(item);
  }

  findAll() {
    return this.repo.find();
  }

  findRoles(ids: string[]) {
    return this.repo.findBy({ id: In(ids) });
  }

  findOne(id: string) {
    return this.repo.findOneByOrFail({ id });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const item = await this.repo.preload({
      id,
      ...updateRoleDto,
      updated_at: new Date(),
    });
    return this.repo.save(item);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
