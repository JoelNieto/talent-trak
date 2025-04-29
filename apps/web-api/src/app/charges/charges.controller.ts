import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChargesService } from './charges.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

@ApiTags('Charges')
@Controller('charges')
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Post()
  create(@Body() createChargeDto: CreateChargeDto) {
    return this.chargesService.create(createChargeDto);
  }

  @ApiQuery({
    name: 'user_id',
    type: String,
    description: 'Usuario',
    required: false,
  })
  @Get()
  findAll(@Query('user_id') userId?: string) {
    return this.chargesService.findAll({ userId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chargesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChargeDto: UpdateChargeDto) {
    return this.chargesService.update(id, updateChargeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chargesService.remove(id);
  }
}
