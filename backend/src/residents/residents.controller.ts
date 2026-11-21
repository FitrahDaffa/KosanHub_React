import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateResidentDto, UpdateResidentDto } from './dto/resident.dto';
import { ResidentsService } from './residents.service';

@Controller('residents')
export class ResidentsController {
  constructor(private readonly residents: ResidentsService) {}

  @Get() findAll(@Query('search') search?: string) { return this.residents.findAll(search); }
  @Get(':id') findOne(@Param('id') id: string) { return this.residents.findOne(id); }
  @Post() create(@Body() data: CreateResidentDto) { return this.residents.create(data); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: UpdateResidentDto) { return this.residents.update(id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.residents.remove(id); }
}
