import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TryFeladatDto } from './dto/try-feladat.dto';

@Injectable()
export class FeladatService {
  constructor(private prisma: PrismaService) {}

  async getTask(id: number, csopId: number) {
    const task = await this.getFeladat(id);
    const meg = await this.probaMeg(id, csopId);

    const { feladat } = task;
    return { feladat, meg };
  }

  async try(tryFeladatDto: TryFeladatDto, id: number, csopId: number) {
    const meg = await this.probaMeg(id, csopId);
    if (meg === 0) throw new BadRequestException('Elérted a próbálkozások maximális számát!');
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
      .replace('ű', 'u');

    const task = await this.getFeladat(id);
    if (task.megoldas === clearedAnswer) {
      await this.prisma.qrCsoport.create({ data: { csoportId: csopId, qrId: task.qrId } });
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
}
