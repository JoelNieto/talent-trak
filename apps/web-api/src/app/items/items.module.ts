import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from '../files/files.service';
import { ItemEntity } from './entities/item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  controllers: [ItemsController],
  providers: [ItemsService, FilesService],
})
export class ItemsModule {}
