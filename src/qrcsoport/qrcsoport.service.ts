import { BadRequestException, Injectable } from '@nestjs/common';
import { QrCsoport } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class QrcsoportService {
  constructor(private prisma: PrismaService) {}

  async create(id: number, uid: number): Promise<QrCsoport> {
    const csoport = await this.prisma.csoport.findUnique({
      where: { id: uid },
      select: { QrCsoport: true, id: true, osztaly: true },
    });
    const qr = await this.prisma.qr.findUnique({ where: { id: +id } });
    const osztaly = await this.prisma.csoport.findMany({
      where: { osztaly: csoport.osztaly },
      select: { QrCsoport: true },
    });
    const qrek = await this.prisma.qrCsoport.findMany({ where: { qrId: qr.id } });

    if (!csoport || !qr) throw new BadRequestException('A kód nem létezik');
    if (!qr.enabled) throw new BadRequestException('A kód nem aktív');
    if (qrek.length >= qr.hasznalhato)
      throw new BadRequestException('A kód már elérte a maximális használatok számát');
    for (const j of osztaly) {
      for (const i of j.QrCsoport) {
        if (i.qrId === qr.id)
          throw new BadRequestException('A kód már hozzá van rendelve az osztályhoz');
      }
    }

    const qrcsoport = this.prisma.qrCsoport.create({
      data: { csoport: { connect: { id: +csoport.id } }, qr: { connect: { id: +id } } },
    });
    return qrcsoport;
  }
}
