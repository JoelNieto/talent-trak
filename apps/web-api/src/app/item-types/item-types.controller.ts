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
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { ItemTypesService } from './item-types.service';

@ApiTags('Item Types')
@Controller('item-types')
export class ItemTypesController {
  constructor(private readonly itemTypesService: ItemTypesService) {}

  @Post()
  create(@Body() createItemTypeDto: CreateItemTypeDto) {
    return this.itemTypesService.create(createItemTypeDto);
  }

  @Get()
  findAll() {
    return this.itemTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemTypeDto: UpdateItemTypeDto
  ) {
    return this.itemTypesService.update(id, updateItemTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemTypesService.remove(id);
  }
}
