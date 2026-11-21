import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rooms = [
    { number: 'A01', type: 'Standar', price: 500000, resident: { name: 'Andi Saputra', phone: '0812-3456-7890' } },
    { number: 'A02', type: 'Standar', price: 500000, resident: { name: 'Budi Santoso', phone: '0823-4567-8901' } },
    { number: 'B01', type: 'Premium', price: 750000, resident: { name: 'Citra Amelia', phone: '0834-5678-9012' } },
    { number: 'B02', type: 'Premium', price: 750000, resident: { name: 'Dewi Lestari', phone: '0856-7890-1234' } },
    { number: 'C01', type: 'Standar', price: 500000, resident: { name: 'Eko Pratama', phone: '0878-9012-3456' } },
    { number: 'C02', type: 'Standar', price: 500000, resident: null },
  ];

  for (const item of rooms) {
    const room = await prisma.room.upsert({
      where: { number: item.number },
      update: { type: item.type, price: item.price },
      create: { number: item.number, type: item.type, price: item.price },
    });
    if (item.resident) {
      const resident = await prisma.resident.upsert({
        where: { roomId: room.id },
        update: { name: item.resident.name, phone: item.resident.phone },
        create: { ...item.resident, roomId: room.id },
      });
      const code = `SEED-${item.number}`;
      await prisma.payment.upsert({
        where: { code },
        update: {},
        create: { code, amount: item.price, paidAt: new Date('2026-10-01T00:00:00.000Z'), status: 'LUNAS', residentId: resident.id },
      });
    }
  }
}

main()
  .then(() => console.log('Data awal KosanHub siap.'))
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => prisma.$disconnect());
