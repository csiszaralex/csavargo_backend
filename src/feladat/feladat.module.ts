import { Module } from '@nestjs/common';
import { FeladatService } from './feladat.service';
import { FeladatController } from './feladat.controller';
import { PrismaService } from '../prisma.service';
import { CsoportModule } from 'src/csoport/csoport.module';

@Module({
  controllers: [FeladatController],
  providers: [FeladatService, PrismaService],
  imports: [CsoportModule],
})
export class FeladatModule {}
