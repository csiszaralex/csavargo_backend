import { BadRequestException, Injectable } from '@nestjs/common';
import { Qr } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrPosDto } from './dto/update-qr-pos.dto';

@Injectable()
export class QrService {
  constructor(private prisma: PrismaService) {}

  create(createQrDto: CreateQrDto): Promise<Qr> {
    const { ertek, hasznalhato, kod, lat, lng } = createQrDto;
    const QR = this.prisma.qr.findUnique({ where: { kod } });
    if (QR) throw new BadRequestException('A QR kód már létezik');
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
    if (!qr) throw new BadRequestException('A QR kód nem létezik');
    return qr;
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
}
