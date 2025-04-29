import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChargeConceptsService } from './charge-concepts.service';
import { CreateChargeConceptDto } from './dto/create-charge-concept.dto';
import { UpdateChargeConceptDto } from './dto/update-charge-concept.dto';

@ApiTags('Charge Concepts')
@Controller('charge-concepts')
export class ChargeConceptsController {
  constructor(private readonly chargeConceptsService: ChargeConceptsService) {}

  @Post()
  create(@Body() createChargeConceptDto: CreateChargeConceptDto) {
    return this.chargeConceptsService.create(createChargeConceptDto);
  }

  @Get()
  findAll() {
    return this.chargeConceptsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chargeConceptsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChargeConceptDto: UpdateChargeConceptDto
  ) {
    return this.chargeConceptsService.update(id, updateChargeConceptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chargeConceptsService.remove(id);
  }
}
