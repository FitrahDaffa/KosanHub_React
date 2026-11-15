import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePenghuniDto } from './dto/create-penghuni.dto';
import { UpdatePenghuniDto } from './dto/update-penghuni.dto';
import { Penghuni } from './entities/penghuni.entity';

@Injectable()
export class PenghuniService {
  private nextId = 6;
  private penghuni: Penghuni[] = [
    new Penghuni({ id: 1, name: 'Andi Saputra', room: 'A01', phone: '081234567890', moveInDate: '2026-09-01', status: 'Active' }),
    new Penghuni({ id: 2, name: 'Budi Santoso', room: 'A02', phone: '082345678901', moveInDate: '2026-09-05', status: 'Active' }),
    new Penghuni({ id: 3, name: 'Citra Amelia', room: 'B01', phone: '083456789012', moveInDate: '2026-09-10', status: 'Active' }),
    new Penghuni({ id: 4, name: 'Dewi Lestari', room: 'B02', phone: '085678901234', moveInDate: '2026-09-15', status: 'Active' }),
    new Penghuni({ id: 5, name: 'Eko Pratama', room: 'C01', phone: '087890123456', moveInDate: '2026-09-20', status: 'Leaving' }),
  ];

  findAll(): Penghuni[] {
    return [...this.penghuni];
  }

  findOne(id: number): Penghuni {
    const resident = this.penghuni.find((item) => item.id === id);
    if (!resident) {
      throw new NotFoundException(`Penghuni dengan id ${id} tidak ditemukan.`);
    }
    return resident;
  }

  create(dto: CreatePenghuniDto): Penghuni {
    this.ensureRoomAvailable(dto.room);
    const resident = new Penghuni({
      id: this.nextId++,
      ...dto,
      status: dto.status ?? 'Active',
    });
    this.penghuni.push(resident);
    return resident;
  }

  update(id: number, dto: UpdatePenghuniDto): Penghuni {
    const resident = this.findOne(id);
    if (dto.room) this.ensureRoomAvailable(dto.room, id);
    Object.assign(resident, dto);
    return resident;
  }

  remove(id: number): void {
    this.findOne(id);
    this.penghuni = this.penghuni.filter((item) => item.id !== id);
  }

  private ensureRoomAvailable(room: string, exceptId?: number): void {
    const occupied = this.penghuni.some(
      (item) => item.room === room && item.id !== exceptId,
    );
    if (occupied) {
      throw new ConflictException(`Kamar ${room} sudah memiliki penghuni.`);
    }
  }
}
