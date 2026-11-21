import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: string) {
    return this.prisma.payment.findMany({
      where: status ? { status: status as 'LUNAS' | 'MENUNGGU' | 'TERTUNDA' } : undefined,
      include: { resident: { include: { room: true } } },
      orderBy: { paidAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id }, include: { resident: { include: { room: true } } } });
    if (!payment) throw new NotFoundException('Pembayaran tidak ditemukan');
    return payment;
  }

  create(data: CreatePaymentDto) {
    const { residentId, paidAt, ...payment } = data;
    return this.prisma.payment.create({
      data: { ...payment, paidAt: new Date(paidAt), resident: { connect: { id: residentId } } },
      include: { resident: { include: { room: true } } },
    });
  }

  async update(id: string, data: UpdatePaymentDto) {
    await this.findOne(id);
    const { residentId, paidAt, ...payment } = data;
    return this.prisma.payment.update({
      where: { id },
      data: { ...payment, ...(paidAt ? { paidAt: new Date(paidAt) } : {}), ...(residentId ? { resident: { connect: { id: residentId } } } : {}) },
      include: { resident: { include: { room: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.payment.delete({ where: { id } });
  }
}
