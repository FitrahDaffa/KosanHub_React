import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePenghuniDto } from './dto/create-penghuni.dto';
import { UpdatePenghuniDto } from './dto/update-penghuni.dto';
import { PenghuniService } from './penghuni.service';

@Controller('penghuni')
export class PenghuniController {
  constructor(private readonly penghuniService: PenghuniService) {}

  @Post()
  create(@Body() dto: CreatePenghuniDto) {
    return this.penghuniService.create(dto);
  }

  @Get()
  findAll() {
    return this.penghuniService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.penghuniService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePenghuniDto,
  ) {
    return this.penghuniService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.penghuniService.remove(id);
  }
}
