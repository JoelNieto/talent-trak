import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargesService } from '../charges/charges.service';
import { ChargeEntity } from '../charges/entities/charge.entity';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, ChargeEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService, ChargesService],
})
export class PaymentsModule {}
