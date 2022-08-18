import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const kodBase = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const kodLength = 6;
  const osztalyok = ['Test', 'A', 'B', 'NY', 'KNY', 'E'];
  const csopDb = 2;

  await prisma.csoport.create({ data: { oztaly: 'admin', csoport: 0, kod: `alex` } });
  for (const oszt of osztalyok) {
    for (let i = 1; i <= csopDb; i++) {
      let kod = '';
      for (let i = 0; i < kodLength; i++) {
        kod += kodBase[Math.floor(Math.random() * kodBase.length)];
      }
      await prisma.csoport.create({ data: { oztaly: oszt, csoport: i, kod: kod } });
    }
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
