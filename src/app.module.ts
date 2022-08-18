import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CsoportModule } from './csoport/csoport.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
    }),
    CsoportModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
