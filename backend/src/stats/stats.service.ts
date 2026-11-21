import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [rooms, residents, payments, paid] = await Promise.all([
      this.prisma.room.count(),
      this.prisma.resident.count(),
      this.prisma.payment.count(),
      this.prisma.payment.aggregate({ where: { status: 'LUNAS' }, _sum: { amount: true } }),
    ]);
    return { rooms, residents, payments, paidAmount: paid._sum.amount ?? 0 };
  }
}
