import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  exports: [RolesService],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
