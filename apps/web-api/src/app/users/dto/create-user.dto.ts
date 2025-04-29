import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@talent-trak/models';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  given_name: string;

  @ApiProperty({ required: true })
  @IsString()
  family_name: string;

  @ApiProperty({ required: true, uniqueItems: true })
  @IsString()
  document_id: string;

  @ApiProperty({
    required: true,
    enum: ['PASSPORT', 'ID_CARD', 'DRIVER_LICENSE'],
  })
  @IsString()
  document_type: 'PASSPORT' | 'ID_CARD' | 'DRIVER_LICENSE';

  @ApiProperty({
    required: true,
    enum: ['FEMALE', 'FEMALE', 'FEMALE'],
  })
  @IsString()
  gender: 'FEMALE' | 'MASCULINE' | 'OTHER';

  @ApiProperty({ required: true })
  @IsArray()
  roles: Role[] | string[];

  @ApiProperty({ required: true })
  @IsDate()
  birth_date: Date;

  @ApiProperty({ required: true, uniqueItems: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsPhoneNumber('PA')
  phone: string;

  @ApiProperty({ required: false })
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ readOnly: true })
  @IsBoolean()
  is_logged_in: boolean;
}
