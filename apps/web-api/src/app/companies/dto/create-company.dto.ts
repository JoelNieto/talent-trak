import { ApiProperty } from '@nestjs/swagger';
import { Company, EntityDto } from '@talent-trak/models';
import { IsBoolean, IsString } from 'class-validator';

export class CreateCompanyDto implements EntityDto<Company> {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ default: '' })
  @IsString()
  description: string;

  @ApiProperty({ default: '' })
  @IsString()
  short_name: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  is_active: boolean;
}
