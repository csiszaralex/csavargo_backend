import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    if (!csoport) throw new UnauthorizedException('Hibás csoport kód');
    if (!csoport.enabled) throw new UnauthorizedException('A csoport belépése nem engedélyezett');
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
}
