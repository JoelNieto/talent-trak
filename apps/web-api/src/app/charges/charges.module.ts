import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargesController } from './charges.controller';
import { ChargesService } from './charges.service';
import { ChargeEntity } from './entities/charge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChargeEntity])],
  controllers: [ChargesController],
  providers: [ChargesService],
})
export class ChargesModule {}
