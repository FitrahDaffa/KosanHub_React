import { Module } from '@nestjs/common';
import { PenghuniModule } from './penghuni/penghuni.module';

@Module({ imports: [PenghuniModule] })
export class AppModule {}
