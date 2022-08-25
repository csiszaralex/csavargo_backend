import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CsoportModule } from './csoport/csoport.module';
import { QrModule } from './qr/qr.module';
import { QrcsoportModule } from './qrcsoport/qrcsoport.module';
import { FeladatModule } from './feladat/feladat.module';
import { HibaModule } from './hiba/hiba.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
    }),
    CsoportModule,
    QrModule,
    QrcsoportModule,
    FeladatModule,
    HibaModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
