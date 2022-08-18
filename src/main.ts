import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('START');
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3000;
  const swaggerConf = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_NAME') || '')
    .setDescription(configService.get('SWAGGER_DESC') || '')
    .setVersion(configService.get('npm_package_version'))
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConf);
  SwaggerModule.setup(process.env.SWAGGER_LINK || 'api', app, swaggerDoc);

  app.enableCors({ origin: process.env.CORS || '*' });
  await app.listen(PORT, () => {
    logger.debug(`---------- Server started on port ${PORT} ----------`);
  });
}

bootstrap();
