import { ApiProperty } from '@nestjs/swagger';
import { EntityDto, ItemType } from '@talent-trak/models';
import { IsString } from 'class-validator';

export class CreateItemTypeDto implements EntityDto<ItemType> {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  description: string;
}
