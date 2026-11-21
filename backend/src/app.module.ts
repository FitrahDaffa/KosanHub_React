import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { PenghuniModule } from './penghuni/penghuni.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResidentsModule } from './residents/residents.module';
import { RoomsModule } from './rooms/rooms.module';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';

@Module({
  imports: [PrismaModule, RoomsModule, ResidentsModule, PaymentsModule, PenghuniModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class AppModule {}
