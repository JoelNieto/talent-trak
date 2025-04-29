import { ApiProperty } from '@nestjs/swagger';
import { Charge, EntityDto, Payment, User } from '@talent-trak/models';
import { IsDate, IsDecimal, IsString } from 'class-validator';

export class CreatePaymentDto implements EntityDto<Payment> {
  @ApiProperty()
  @IsString()
  charge: Charge;

  @ApiProperty()
  @IsString()
  user: User;

  @ApiProperty()
  @IsDecimal()
  amount: number;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty({ required: false, default: '' })
  @IsString()
  comments: string;
}
