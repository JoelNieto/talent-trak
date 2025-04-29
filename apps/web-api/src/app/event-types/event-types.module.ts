import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypeEntity } from './entities/event-type.entity';
import { EventTypesController } from './event-types.controller';
import { EventTypesService } from './event-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventTypeEntity])],
  controllers: [EventTypesController],
  providers: [EventTypesService],
})
export class EventTypesModule {}
