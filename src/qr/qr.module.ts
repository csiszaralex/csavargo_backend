import { Module } from '@nestjs/common';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';
import { CsoportModule } from 'src/csoport/csoport.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [QrController],
  providers: [QrService, PrismaService],
  imports: [CsoportModule],
})
export class QrModule {}
