import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
  });

  // Global validation: strip unknown fields, reject extras, coerce query params
  // (e.g. ?status=todo) to the DTO's declared types.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Team Task Board API listening on http://localhost:${port}/api`);
}

bootstrap();
