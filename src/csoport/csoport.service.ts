import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Csoport } from '@prisma/client';
import { SigninCsoportDto } from './dto/signin-csoport.dto';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';

@Injectable()
export class CsoportService {
  constructor(private prisma: PrismaService) {}

  //TODO signin
  async signin(signinCsoportDto: SigninCsoportDto) /*: Promise<JwtPayloadInterface> */ {
    const { code } = signinCsoportDto;
    const csoport = await this.prisma.csoport.findUnique({ where: { kod: code } });
    if (!csoport) throw new UnauthorizedException('Hibás csoport kód');
    

    return csoport;
  }
  //TODO renew
  //TODO signout
  //TODO disable
  //TODO editPass
}
