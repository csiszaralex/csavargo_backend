import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('START');
  const configService = app.get(ConfigService);
  const swaggerConf = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_NAME || '')
    .setDescription(process.env.SWAGGER_DESC || '')
    .setVersion(process.env.npm_package_version)
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConf);
  SwaggerModule.setup(process.env.SWAGGER_LINK || 'api', app, swaggerDoc);

  app.enableCors({ origin: process.env.CORS || '*' });
  await app.listen(configService.get('PORT') || 3000, () => {
    logger.debug('-----------------------');
  });
}

bootstrap();
