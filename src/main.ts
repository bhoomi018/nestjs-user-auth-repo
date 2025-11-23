// src/main.ts
// Application entry point: sets up global pipes, interceptors, filters and starts server.

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validate and transform incoming requests
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Wrap successful responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Unified error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
