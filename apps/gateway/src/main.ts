import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.disable('x-powered-by');

  app.use((req: Request, res: Response, next: NextFunction) => {
    next();
  });

  await app.listen(3000);
}
bootstrap();
