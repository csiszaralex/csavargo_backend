import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('START');
  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT') || 3000, () => {
    logger.debug('-----------------------');
  });
}

bootstrap();
