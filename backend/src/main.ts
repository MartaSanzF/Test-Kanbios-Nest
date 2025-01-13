import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // activate cors with the default options
  app.enableCors({
    origin: 'http://localhost:5173', // Autorise uniquement cette origine
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Autorise ces méthodes HTTP
    allowedHeaders: ['Content-Type', 'Authorization'], // Autorise ces en-têtes
  });

  // activate the global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
