import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity) private repo: Repository<CompanyEntity>
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    const item = this.repo.create(createCompanyDto);
    return this.repo.save(item);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneByOrFail({ id });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const item = await this.repo.preload({
      id,
      ...updateCompanyDto,
      updated_at: new Date(),
    });
    return this.repo.save(item);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
