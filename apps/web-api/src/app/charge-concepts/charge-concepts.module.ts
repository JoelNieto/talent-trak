import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargeConceptsController } from './charge-concepts.controller';
import { ChargeConceptsService } from './charge-concepts.service';
import { ChargeConceptEntity } from './entities/charge-concept.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChargeConceptEntity])],
  controllers: [ChargeConceptsController],
  providers: [ChargeConceptsService],
})
export class ChargeConceptsModule {}
