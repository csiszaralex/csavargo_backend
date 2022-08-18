import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
