import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { ShortenerModule } from './shortener.module';

async function bootstrap() {
  const app = await NestFactory.create(ShortenerModule);
  app.useGlobalPipes(new ValidationPipe());
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('SHORTENER'));
  await app.startAllMicroservices();
}
bootstrap();
