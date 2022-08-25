import { Module } from '@nestjs/common';
import { HibaService } from './hiba.service';
import { HibaController } from './hiba.controller';
import { PrismaService } from 'src/prisma.service';
import { CsoportModule } from 'src/csoport/csoport.module';

@Module({
  controllers: [HibaController],
  providers: [HibaService, PrismaService],
  imports: [CsoportModule],
})
export class HibaModule {}
