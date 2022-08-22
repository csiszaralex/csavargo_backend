import { PrismaClient, Qr } from '@prisma/client';
import Tasks from './tasks';
const prisma = new PrismaClient();

async function main() {
  //:Csoportok
  const kodBase = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const kodLength = 6;
  const osztalyok = ['Test', 'A', 'B', 'NY', 'KNY', 'E'];
  const csopDb = 2;

  await prisma.csoport.create({ data: { osztaly: 'admin', csoport: 0, kod: `ALEX12` } });
  for (const oszt of osztalyok) {
    for (let i = 1; i <= csopDb; i++) {
      let kod = '';
      for (let i = 0; i < kodLength; i++) {
        kod += kodBase[Math.floor(Math.random() * kodBase.length)];
      }
      await prisma.csoport.create({ data: { osztaly: oszt, csoport: i, kod: kod } });
    }
  }
  //:QR-ek
  const Qrek: Qr[] = [];
  for (let i = 0; i < 15; i++) {
    const ertek = Math.floor(Math.random() * 3) + 1;
    const hasznalhato = Math.floor(Math.random() * 7) + 1;
    const kod = Math.random()
      .toString(36)
      .substring(2, kodLength + 2)
      .toUpperCase();
    const lat = Math.random() * 180 - 90;
    const lng = Math.random() * 360 - 180;
    Qrek.push(
      await prisma.qr.create({
        data: { ertek, hasznalhato, kod, lat, lng },
      }),
    );
  }
  //:Feladatok
  for (const i in Tasks) {
    await prisma.feladat.create({
      data: { feladat: Tasks[i].feladat, megoldas: Tasks[i].megoldas, qrId: Qrek[i].id },
    });
  }
  //:QrCsoport
  for (let i = 0; i < 50; i++) {
    const qr = Qrek[Math.floor(Math.random() * Qrek.length)];
    const csop = await prisma.csoport.findMany({
      where: {
        csoport: Math.floor(Math.random() * csopDb) + 1,
        osztaly: osztalyok[Math.floor(Math.random() * osztalyok.length)],
      },
    });
    const date = new Date(
      2022,
      7,
      Math.floor(Math.random() * 30) + 1,
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      0,
    );
    const qrs = await prisma.qrCsoport.findMany({ where: { qrId: qr.id } });
    if (qrs.length >= qr.hasznalhato) {
      i--;
      continue;
    }
    await prisma.qrCsoport.create({ data: { mikor: date, qrId: qr.id, csoportId: csop[0].id } });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
