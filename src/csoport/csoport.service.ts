import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SigninCsoportDto } from './dto/signin-csoport.dto';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CsoportService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signin(signinCsoportDto: SigninCsoportDto) /*: Promise<JwtPayloadInterface> */ {
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

  async whoami(id: number) {
    return id;
  }
  async renew() {
    throw Error('Not implemented');
  }
  async signout() {
    throw Error('Not implemented');
  }
  async disable() {
    throw Error('Not implemented');
  }
  async editPass() {
    throw Error('Not implemented');
  }
}
