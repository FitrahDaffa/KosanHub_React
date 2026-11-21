import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get() findAll(@Query('status') status?: string) { return this.payments.findAll(status); }
  @Get(':id') findOne(@Param('id') id: string) { return this.payments.findOne(id); }
  @Post() create(@Body() data: CreatePaymentDto) { return this.payments.create(data); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: UpdatePaymentDto) { return this.payments.update(id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.payments.remove(id); }
}
