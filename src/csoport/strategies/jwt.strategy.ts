import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { Csoport } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET || 'niszIsTheBest123',
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
    const { id } = payload;
    const csoport: Csoport = await this.prisma.csoport.findUnique({ where: { id } });
    if (!csoport) {
      throw new UnauthorizedException(`Nincs csoport a következő id-vel: ${id}`);
    }

    return { id: csoport.id, osztaly: csoport.osztaly, csoport: csoport.csoport };
  }
}
