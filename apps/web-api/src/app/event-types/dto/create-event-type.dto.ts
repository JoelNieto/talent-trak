import { ApiProperty } from '@nestjs/swagger';
import { EntityDto, EventType } from '@talent-trak/models';
import { IsString } from 'class-validator';

export class CreateEventTypeDto implements EntityDto<EventType> {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  description: string;
}
