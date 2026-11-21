import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto, UpdateResidentDto } from './dto/resident.dto';

@Injectable()
export class ResidentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search?: string) {
    return this.prisma.resident.findMany({
      where: search ? { OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { room: { number: { contains: search, mode: 'insensitive' } } },
      ] } : undefined,
      include: { room: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const resident = await this.prisma.resident.findUnique({ where: { id }, include: { room: true } });
    if (!resident) throw new NotFoundException('Penghuni tidak ditemukan');
    return resident;
  }

  create(data: CreateResidentDto) {
    const { roomId, ...resident } = data;
    return this.prisma.resident.create({
      data: { ...resident, ...(roomId ? { room: { connect: { id: roomId } } } : {}) },
      include: { room: true },
    });
  }

  async update(id: string, data: UpdateResidentDto) {
    await this.findOne(id);
    const { roomId, ...resident } = data;
    return this.prisma.resident.update({
      where: { id },
      data: { ...resident, ...(roomId === null ? { room: { disconnect: true } } : roomId ? { room: { connect: { id: roomId } } } : {}) },
      include: { room: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.resident.delete({ where: { id } });
  }
}
