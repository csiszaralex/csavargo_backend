import { Module } from '@nestjs/common';
import { CsoportService } from './csoport.service';
import { CsoportController } from './csoport.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CsoportController],
  providers: [CsoportService, PrismaService],
})
export class CsoportModule {}
