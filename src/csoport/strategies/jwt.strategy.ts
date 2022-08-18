import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET || 'secret',
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
    const prisma = new PrismaService();
    const { id } = payload;

    const csoport = await prisma.csoport.findUnique({ where: { id } });

    if (!csoport) throw new UnauthorizedException('Hibás csoport kód');
    if (!csoport.enabled) throw new UnauthorizedException('A csoport belépése nem engedélyezett');
    return payload;
  }
}
