import { Module } from '@nestjs/common';
import { PenghuniController } from './penghuni.controller';
import { PenghuniService } from './penghuni.service';

@Module({
  controllers: [PenghuniController],
  providers: [PenghuniService],
})
export class PenghuniModule {}
