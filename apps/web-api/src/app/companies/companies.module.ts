import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthzModule } from '../../authz/authz.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanyEntity } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), AuthzModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
