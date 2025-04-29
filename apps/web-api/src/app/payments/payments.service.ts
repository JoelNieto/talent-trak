import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'uuid';
import { ChargesService } from '../charges/charges.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity) private repo: Repository<PaymentEntity>,
    private charges: ChargesService
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = this.repo.create(createPaymentDto);
      await this.repo.save(payment);
      let charge = await this.charges.findOne(payment.charge.id);
      if (charge) {
        const chargeBalance = charge.balance - payment.amount;
        charge = {
          ...charge,
          is_paid: chargeBalance === 0,
          balance: chargeBalance,
        };
        await this.charges.update(charge.id, charge);
      }
      return this.repo.findOne({ where: { id: payment.id } });
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Error creating payment' },
        HttpStatus.BAD_REQUEST,
        { cause: error }
      );
    }
  }

  findAll({ userId }: { userId?: string }) {
    if (!userId) {
      return this.repo.find();
    }
    if (!validate(userId)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User Id is not a valid UUID',
        },
        HttpStatus.BAD_REQUEST,
        { cause: 'userId' }
      );
    }
    return this.repo.find({ where: { user: { id: userId } } });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.repo.preload({
      id,
      ...updatePaymentDto,
      updated_at: new Date(),
    });
    if (!payment) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Payment not found' },
        HttpStatus.NOT_FOUND,
        { cause: 'payment' }
      );
    }
    try {
      await this.repo.save(payment);
      return this.repo.findOne({ where: { id: payment.id } });
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Error updating payment' },
        HttpStatus.BAD_REQUEST,
        { cause: error }
      );
    }
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
