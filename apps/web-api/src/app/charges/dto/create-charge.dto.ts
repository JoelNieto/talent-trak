import { ApiProperty } from '@nestjs/swagger';
import {
  Charge,
  ChargeConcept,
  Company,
  EntityDto,
  User,
} from '@talent-trak/models';
import { IsBoolean, IsDate, IsDecimal, IsString } from 'class-validator';

export class CreateChargeDto implements EntityDto<Charge> {
  @ApiProperty()
  @IsString()
  company: Company;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  concept: ChargeConcept;

  @ApiProperty()
  @IsString()
  user: User;

  @ApiProperty({ required: false })
  @IsString()
  description: string;

  @ApiProperty()
  @IsDecimal()
  amount: number;

  @ApiProperty()
  @IsDecimal()
  balance: number;

  @ApiProperty({ required: false })
  @IsDate()
  due_date: Date;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  is_paid: boolean;
}
