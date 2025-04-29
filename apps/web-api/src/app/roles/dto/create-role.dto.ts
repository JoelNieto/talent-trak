import { ApiProperty } from '@nestjs/swagger';
import { EntityDto, Role } from '@talent-trak/models';
import { IsBoolean, IsString } from 'class-validator';

export class CreateRoleDto implements EntityDto<Role> {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  description: string;
  @ApiProperty({ required: false })
  @IsBoolean()
  is_admin: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  is_super_admin: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  is_employee: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  is_client: boolean;
}
