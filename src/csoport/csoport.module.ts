import { Module } from '@nestjs/common';
import { CsoportService } from './csoport.service';
import { CsoportController } from './csoport.controller';
import { PrismaService } from 'src/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [CsoportController],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET || 'secret',
      signOptions: { expiresIn: process.env.EXPIRES_IN || '1h' },
    }),
  ],
  providers: [CsoportService, PrismaService, JwtStrategy],
  exports: [CsoportModule, JwtStrategy, PassportModule],
})
export class CsoportModule {}
