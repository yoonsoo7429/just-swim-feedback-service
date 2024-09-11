import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api'); // 글로벌 프리픽스 설정
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(80);
}
bootstrap();
