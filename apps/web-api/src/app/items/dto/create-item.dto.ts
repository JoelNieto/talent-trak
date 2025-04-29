import { ApiProperty } from '@nestjs/swagger';
import { ItemType } from '@talent-trak/models';
import { IsDecimal, IsInt, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  picture?: Express.Multer.File;

  picture_url?: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: ItemType;

  @ApiProperty({ required: false })
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsInt()
  quantity: number;

  @ApiProperty({ required: false })
  @IsDecimal()
  price: number;
}
