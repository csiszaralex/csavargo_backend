import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Qr } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrPosDto } from './dto/update-qr-pos.dto';
import { VerifyQrDto } from './dto/verify-qr.dto';

@Injectable()
export class QrService {
  constructor(private prisma: PrismaService) {}

  create(createQrDto: CreateQrDto): Promise<Qr> {
    const { ertek, hasznalhato, kod, lat, lng } = createQrDto;
    const QR = this.prisma.qr.findUnique({ where: { kod } });
    if (QR) throw new NotFoundException('A kód már létezik');
    const qr = this.prisma.qr.create({
      data: { ertek: +ertek, hasznalhato: +hasznalhato, kod, lat, lng },
    });
    return qr;
  }

  findAll(): Promise<Qr[]> {
    return this.prisma.qr.findMany();
  }

  findOne(id: number): Promise<Qr> {
    const qr = this.prisma.qr.findUnique({ where: { id } });
    if (!qr) throw new NotFoundException('A kód nem létezik');
    return qr;
  }

  async available(
    verifyQrDto: VerifyQrDto,
    csopId: number,
  ): Promise<{ available: boolean; id: number }> {
    const { code } = verifyQrDto;
    const qr = await this.prisma.qr.findUnique({
      where: { kod: code },
      select: { hasznalhato: true, id: true },
    });
    if (!qr) throw new NotFoundException('A kód nem létezik');
    const { hasznalhato, id } = qr;
    const hasznalt = await this.prisma.qrCsoport.findMany({ where: { qrId: id } });
    const myCsop = await this.prisma.csoport.findUnique({ where: { id: csopId } });
    for (const qrcsop of hasznalt) {
      const csop = await this.prisma.csoport.findUnique({ where: { id: qrcsop.csoportId } });
      if (myCsop.osztaly === csop.osztaly)
        throw new BadRequestException(
          'Ezt a QR kódot Ti vagy az osztály másik része már megtalálta',
        );
    }

    return { available: hasznalhato > hasznalt.length, id: id };
  }

  async update(id: number, createQrDto: CreateQrDto): Promise<Qr> {
    const { ertek, hasznalhato, kod, lat, lng } = createQrDto;
    const qr = await this.findOne(id);
    return this.prisma.qr.update({
      data: {
        ertek: +ertek || qr.ertek,
        hasznalhato: +hasznalhato || qr.hasznalhato,
        kod: kod || qr.kod,
        lat: lat || qr.lat,
        lng: lng || qr.lng,
      },
      where: { id },
    });
  }

  async move(id: number, updateQrPosDto: UpdateQrPosDto): Promise<Qr> {
    const qr = await this.findOne(id);
    const { lat, lng } = updateQrPosDto;
    return this.prisma.qr.update({ where: { id: qr.id }, data: { lat, lng } });
  }

  async disable(id: number): Promise<Qr> {
    let qr = await this.prisma.qr.findUnique({ where: { id } });
    await this.prisma.qr.update({ data: { enabled: !qr.enabled }, where: { id } });
    qr = await this.prisma.qr.findUnique({ where: { id } });
    return qr;
  }

  async runOut() {
    const qrs = await this.prisma.qr.findMany({
      include: { QrCsoport: true },
    });
    return qrs
      .map(qr => {
        return {
          id: qr.id,
          ertek: qr.ertek,
          hasznalhato: qr.hasznalhato,
          maradt: qr.hasznalhato - qr.QrCsoport.length,
          hely: qr.hely,
        };
      })
      .filter(qr => qr.maradt <= 2)
      .sort((a, b) => b.maradt - a.maradt);
  }
  async increaseQr(id: number) {
    const qr = await this.findOne(id);
    return this.prisma.qr.update({
      data: { hasznalhato: qr.hasznalhato + 1 },
      where: { id },
    });
  }
}
