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
}
