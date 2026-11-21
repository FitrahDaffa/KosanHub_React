import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ResidentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenghuniDto } from './dto/create-penghuni.dto';
import { UpdatePenghuniDto } from './dto/update-penghuni.dto';
import { Penghuni } from './entities/penghuni.entity';

type ResidentWithRoom = Prisma.ResidentGetPayload<{ include: { room: true } }>;

@Injectable()
export class PenghuniService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Penghuni[]> {
    const residents = await this.prisma.resident.findMany({
      include: { room: true },
      orderBy: { createdAt: 'asc' },
    });
    return residents.map((resident) => this.toPenghuni(resident));
  }

  async findOne(id: string): Promise<Penghuni> {
    const resident = await this.prisma.resident.findUnique({ where: { id }, include: { room: true } });
    if (!resident) throw new NotFoundException(`Penghuni dengan id ${id} tidak ditemukan.`);
    return this.toPenghuni(resident);
  }

  async create(dto: CreatePenghuniDto): Promise<Penghuni> {
    const room = await this.prisma.room.findUnique({ where: { number: dto.room } });
    if (!room) throw new NotFoundException(`Kamar ${dto.room} tidak ditemukan.`);
    try {
      const resident = await this.prisma.resident.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          moveInDate: new Date(dto.moveInDate),
          status: this.toDatabaseStatus(dto.status),
          roomId: room.id,
        },
        include: { room: true },
      });
      return this.toPenghuni(resident);
    } catch (error) {
      this.throwRoomConflict(error, dto.room);
      throw error;
    }
  }

  async update(id: string, dto: UpdatePenghuniDto): Promise<Penghuni> {
    const current = await this.prisma.resident.findUnique({ where: { id }, include: { room: true } });
    if (!current) throw new NotFoundException(`Penghuni dengan id ${id} tidak ditemukan.`);

    let roomId: string | undefined;
    if (dto.room !== undefined) {
      const room = await this.prisma.room.findUnique({ where: { number: dto.room } });
      if (!room) throw new NotFoundException(`Kamar ${dto.room} tidak ditemukan.`);
      roomId = room.id;
    }

    try {
      const resident = await this.prisma.resident.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
          ...(dto.moveInDate !== undefined ? { moveInDate: new Date(dto.moveInDate) } : {}),
          ...(dto.status !== undefined ? { status: this.toDatabaseStatus(dto.status) } : {}),
          ...(roomId !== undefined ? { roomId } : {}),
        },
        include: { room: true },
      });
      return this.toPenghuni(resident);
    } catch (error) {
      this.throwRoomConflict(error, dto.room);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    if (!(await this.prisma.resident.findUnique({ where: { id }, select: { id: true } }))) {
      throw new NotFoundException(`Penghuni dengan id ${id} tidak ditemukan.`);
    }
    try {
      await this.prisma.resident.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException('Riwayat pembayaran penghuni harus dihapus terlebih dahulu.');
      }
      throw error;
    }
  }

  private toPenghuni(resident: ResidentWithRoom): Penghuni {
    return new Penghuni({
      id: resident.id,
      name: resident.name,
      room: resident.room?.number ?? '',
      phone: resident.phone,
      moveInDate: resident.moveInDate.toISOString().slice(0, 10),
      status: resident.status === 'LEAVING' ? 'Leaving' : 'Active',
    });
  }

  private toDatabaseStatus(status?: 'Active' | 'Leaving'): ResidentStatus {
    return status === 'Leaving' ? ResidentStatus.LEAVING : ResidentStatus.ACTIVE;
  }

  private throwRoomConflict(error: unknown, room?: string): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException(`Kamar ${room ?? ''} sudah memiliki penghuni.`.trim());
    }
  }
}
