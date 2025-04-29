import { ApiProperty } from '@nestjs/swagger';
import {
  Company,
  EntityDto,
  Event,
  EventType,
  User,
} from '@talent-trak/models';
import { IsArray, IsBoolean, IsDate, IsString } from 'class-validator';

export class CreateEventDto implements EntityDto<Event> {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  company: Company;

  @ApiProperty({ required: false })
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  comments: string;

  @ApiProperty({ required: true })
  @IsDate()
  start_date: Date;

  @ApiProperty({ required: true })
  @IsArray()
  participants: string[] | User[];

  @ApiProperty({ required: true })
  @IsDate()
  end_date: Date;

  @ApiProperty({ required: true })
  @IsString()
  event_type: string | EventType;

  @ApiProperty({ required: false })
  @IsString()
  location: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  is_active: boolean;
}
