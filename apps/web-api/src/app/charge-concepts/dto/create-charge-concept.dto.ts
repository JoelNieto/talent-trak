import { ApiProperty } from '@nestjs/swagger';
import { ChargeConcept, EntityDto } from '@talent-trak/models';
import { IsDecimal, IsString } from 'class-validator';

export class CreateChargeConceptDto implements EntityDto<ChargeConcept> {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  description: string;

  @ApiProperty({ default: 0 })
  @IsDecimal()
  amount: number;
}
