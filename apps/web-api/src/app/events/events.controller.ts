import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthzGuard } from '../../authz/authz.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@UseGuards(AuthzGuard)
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @ApiQuery({
    name: 'start_date',
    type: String,
    description: 'Fecha de inicio',
    required: false,
  })
  @ApiQuery({
    name: 'end_date',
    type: String,
    description: 'Fecha de fin',
    required: false,
  })
  @Get()
  findAll(
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string
  ) {
    return this.eventsService.findAll({ startDate, endDate });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
