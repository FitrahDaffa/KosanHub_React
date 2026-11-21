import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(type?: string) {
    return this.prisma.room.findMany({
      where: type ? { type: { contains: type, mode: 'insensitive' } } : undefined,
      include: { resident: true },
      orderBy: { number: 'asc' },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({ where: { id }, include: { resident: true } });
    if (!room) throw new NotFoundException('Kamar tidak ditemukan');
    return room;
  }

  create(data: CreateRoomDto) {
    return this.prisma.room.create({ data });
  }

  async update(id: string, data: UpdateRoomDto) {
    await this.findOne(id);
    return this.prisma.room.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.room.delete({ where: { id } });
  }
}
