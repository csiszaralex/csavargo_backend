import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('START');

  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT || 3000, () => {
    logger.debug('-----------------------');
  });
}
bootstrap();
