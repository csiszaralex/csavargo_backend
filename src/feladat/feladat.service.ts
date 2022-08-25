import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TryFeladatDto } from './dto/try-feladat.dto';

@Injectable()
export class FeladatService {
  constructor(private prisma: PrismaService) {}

  async getTask(id: number, csopId: number) {
    const task = await this.getFeladat(id);
    const meg = await this.probaMeg(id, csopId);

    const { feladat, type } = task;
    return { feladat, meg, type };
  }

  async try(tryFeladatDto: TryFeladatDto, id: number, csopId: number, force = false) {
    const meg = await this.probaMeg(id, csopId);
    if (meg === 0 && !force)
      throw new BadRequestException('Elérted a próbálkozások maximális számát!');
    const { answer } = tryFeladatDto;
    const clearedAnswer = answer
      .toLowerCase()
      .replace(/\s/g, '')
      .replace('á', 'a')
      .replace('é', 'e')
      .replace('í', 'i')
      .replace('ó', 'o')
      .replace('ö', 'o')
      .replace('ő', 'o')
      .replace('ú', 'u')
      .replace('ü', 'u')
      .replace('ű', 'u')
      .replace(/[.,\-+*/?!'"=]/g, 'u');
    const task = await this.getFeladat(id);
    if (task.megoldas === clearedAnswer || force) {
      await this.prisma.qrCsoport.create({ data: { csoportId: csopId, qrId: task.qrId } });
      await this.prisma.proba.deleteMany({ where: { csoportId: +csopId, feladatId: +id } });
      return { type: 'Siker' };
    }
    const voltmar =
      (await this.prisma.proba.findMany({ where: { proba: clearedAnswer, csoportId: +csopId } }))
        .length > 0;
    if (voltmar) {
      return { voltmar };
    }
    await this.prisma.proba.create({
      data: { csoportId: +csopId, feladatId: +id, proba: answer, cleanProba: clearedAnswer },
    });
    return { meg: meg - 1 };
  }

  async probaMeg(id: number, csopId: number) {
    const task = await this.getFeladat(id);
    const szabadProba = task.maxProba;
    const eddigiProba = (
      await this.prisma.proba.findMany({
        where: { csoportId: +csopId, feladatId: +id },
      })
    ).length;
    return szabadProba - eddigiProba;
  }
  async getFeladat(id: number) {
    const task = await this.prisma.feladat.findUnique({ where: { id: +id } });
    if (!task) throw new NotFoundException('Ilyen feladat nem létezik');
    return task;
  }
  async getProba(id: number) {
    const proba = await this.prisma.proba.findUnique({ where: { id: +id } });
    if (!proba) throw new NotFoundException('Ilyen proba nem létezik');
    return proba;
  }

  async getPicture(id: number) {
    const task = await this.getProba(id);
    const feladat = await this.getFeladat(task.feladatId);
    if (feladat.type !== 'file') throw new BadRequestException('Nem képfeladat');
    return task.proba;
  }
  async getPositions() {
    const csoportok = await this.prisma.csoport.findMany({
      where: { osztaly: { not: 'admin' } },
      include: { Proba: true, QrCsoport: true },
    });
    const utolsok = [];
    for (const csoport of csoportok) {
      const probaMikor = csoport.Proba.sort((a, b) => {
        return b.mikor.getTime() - a.mikor.getTime();
      });
      const qrMikor = csoport.QrCsoport.sort((a, b) => {
        return b.mikor.getTime() - a.mikor.getTime();
      });
      const proba = probaMikor.length > 0 ? probaMikor[0] : null;
      const qr = qrMikor.length > 0 ? qrMikor[0] : null;

      let utolso = { mikor: new Date(0), hely: '', tipus: '' };
      if (!proba && !qr) {
        utolso = { mikor: new Date(0), hely: 'Jedlik', tipus: '-' };
      } else if (!proba || proba.mikor < qr.mikor) {
        utolso = {
          tipus: 'qr',
          mikor: qr.mikor,
          hely: (await this.prisma.qr.findUnique({ where: { id: qr.qrId } })).hely,
        };
      } else {
        const feladat = await this.getFeladat(proba.feladatId);
        utolso = {
          tipus: 'proba',
          mikor: proba.mikor,
          hely: (await this.prisma.qr.findUnique({ where: { id: feladat.qrId } })).hely,
        };
      }

      utolsok.push({
        csoport: `${csoport.osztaly} / ${csoport.csoport}`,
        ...utolso,
      });
    }
    return utolsok;
  }

  async getAcceptable() {
    const attempts = await this.prisma.proba.findMany({
      where: { elutasitva: false },
      select: { csoport: true, feladat: true, proba: true, mikor: true, id: true },
    });
    const cleanedAttempts = attempts.map(attempt => {
      return {
        kerdes: attempt.feladat.feladat,
        megoldas: attempt.feladat.megoldas,
        csoport: `${attempt.csoport.osztaly} / ${attempt.csoport.csoport}`,
        proba: attempt.proba,
        mikor: attempt.mikor,
        felId: attempt.feladat.id,
        csopId: attempt.csoport.id,
        tipus: attempt.feladat.type,
        id: attempt.id,
      };
    });
    return cleanedAttempts;
  }
  async accept(id: number) {
    const proba = await this.prisma.proba.findUnique({ where: { id: +id } });
    if (!proba) throw new NotFoundException('Ilyen proba nem létezik');
    return this.try({ answer: '' }, proba.feladatId, proba.csoportId, true);
  }
  async decline(id: number) {
    const proba = await this.prisma.proba.findUnique({ where: { id: +id } });
    if (!proba) throw new NotFoundException('Ilyen proba nem létezik');
    await this.prisma.proba.update({ where: { id: +id }, data: { elutasitva: true } });
    return { type: 'Siker' };
  }
}
