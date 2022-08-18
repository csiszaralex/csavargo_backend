import { Module } from '@nestjs/common';
import { QrcsoportService } from './qrcsoport.service';
import { QrcsoportController } from './qrcsoport.controller';
import { PrismaService } from 'src/prisma.service';
import { CsoportModule } from 'src/csoport/csoport.module';

@Module({
  controllers: [QrcsoportController],
  providers: [QrcsoportService, PrismaService],
  imports: [CsoportModule],
})
export class QrcsoportModule {}
