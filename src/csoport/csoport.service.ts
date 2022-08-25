import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SigninCsoportDto } from './dto/signin-csoport.dto';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignInPayloadInterface } from './interfaces/signin-payload.interface';
import { Csoport } from '@prisma/client';

@Injectable()
export class CsoportService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signin(signinCsoportDto: SigninCsoportDto): Promise<SignInPayloadInterface> {
    const { code } = signinCsoportDto;
    const csoport = await this.prisma.csoport.findUnique({ where: { kod: code } });
    if (!csoport) throw new ForbiddenException('Hibás csoport kód');
    if (!csoport.enabled) throw new ForbiddenException('A csoport belépése nem engedélyezett');
    const payload: JwtPayloadInterface = {
      id: csoport.id,
      osztaly: csoport.osztaly,
      csoport: csoport.csoport,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async renew(id: number): Promise<SignInPayloadInterface> {
    const csoport = await this.prisma.csoport.findUnique({ where: { id } });
    return this.signin({ code: csoport.kod });
  }
  async disable(id: number): Promise<Csoport> {
    let csoport = await this.prisma.csoport.findUnique({ where: { id } });
    await this.prisma.csoport.update({ data: { enabled: !csoport.enabled }, where: { id } });
    csoport = await this.prisma.csoport.findUnique({ where: { id } });
    return csoport;
  }
  async editPass(id: number, signinCsoportDto: SigninCsoportDto): Promise<Csoport> {
    const { code } = signinCsoportDto;
    let csoport = await this.prisma.csoport.findUnique({ where: { id } });
    await this.prisma.csoport.update({ data: { kod: code }, where: { id } });
    csoport = await this.prisma.csoport.findUnique({ where: { id } });
    return csoport;
  }

  async getQrs(id: number) {
    const qrs = [];

    const QR_csopok = await this.prisma.qrCsoport.findMany({
      where: { csoportId: id },
      select: { qr: true, mikor: true },
    });
    for (const i of QR_csopok) {
      qrs.push({ Érték: i.qr.ertek, Mikor: i.mikor });
    }
    qrs.sort((a, b) => b.Mikor - a.Mikor);

    return qrs;
  }

  async getQrOsztaly(id: number) {
    const qrs = [];

    const { osztaly } = await this.prisma.csoport.findUnique({
      where: { id },
      select: { osztaly: true },
    });
    const csoportok = await this.prisma.csoport.findMany({
      where: { osztaly },
      select: { id: true },
    });
    const csoportIdk = csoportok.map(({ id }) => id);

    for (const csId of csoportIdk) {
      const QR_csopok = await this.prisma.qrCsoport.findMany({
        where: { csoportId: csId },
        select: { qr: true, mikor: true, csoportId: true },
      });
      for (const i of QR_csopok) {
        qrs.push({ Csoport: i.csoportId - 1, Érték: i.qr.ertek, Mikor: i.mikor });
      }
    }
    qrs.sort((a, b) => b.Mikor - a.Mikor);

    return qrs;
  }

  async getStat() {
    const stat: { osztaly: string; csoport: number; kod: string; pont: number }[] = [];
    const csoportok = await this.prisma.csoport.findMany({
      where: { osztaly: { not: 'admin' } },
      select: { id: true, osztaly: true, csoport: true, QrCsoport: true, kod: true },
    });
    for (const csoport of csoportok) {
      let pont = 0;
      const qrek = await this.prisma.qrCsoport.findMany({
        where: { csoportId: csoport.id },
        select: { qr: true },
      });
      for (const qr of qrek) {
        pont += qr.qr.ertek;
      }
      stat.push({ osztaly: csoport.osztaly, csoport: csoport.csoport, kod: csoport.kod, pont });
    }
    stat.sort((a, b) => b.pont - a.pont);
    return stat;
  }
  async getOsztalyStat() {
    const stat = await this.getStat();
    const osztalyok: { osztaly: string; pont: number }[] = [];

    for (const csoport of stat) {
      const osztaly = osztalyok.find(({ osztaly }) => osztaly === csoport.osztaly);
      if (osztaly) {
        osztaly.pont += csoport.pont;
      } else {
        osztalyok.push({ osztaly: csoport.osztaly, pont: csoport.pont });
      }
    }
    osztalyok.sort((a, b) => b.pont - a.pont);
    return osztalyok;
  }
}
