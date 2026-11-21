import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get() findAll(@Query('type') type?: string) { return this.rooms.findAll(type); }
  @Get(':id') findOne(@Param('id') id: string) { return this.rooms.findOne(id); }
  @Post() create(@Body() data: CreateRoomDto) { return this.rooms.create(data); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: UpdateRoomDto) { return this.rooms.update(id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.rooms.remove(id); }
}
