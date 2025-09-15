// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Let /payments/webhook receive the raw body (needed for signature verification)
  app.use('/payments/webhook', express.raw({ type: 'application/json' }));

  // Now global pipes, CORS, etc (these run for other routes)
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
