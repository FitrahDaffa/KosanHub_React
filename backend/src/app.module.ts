import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RoomsModule } from './rooms/rooms.module';
import { ResidentsModule } from './residents/residents.module';
import { PaymentsModule } from './payments/payments.module';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';

@Module({
  imports: [PrismaModule, RoomsModule, ResidentsModule, PaymentsModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class AppModule {}
