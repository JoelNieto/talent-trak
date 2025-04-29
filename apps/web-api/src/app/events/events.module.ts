import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthzModule } from '../../authz/authz.module';
import { EventEntity } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity]), AuthzModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
