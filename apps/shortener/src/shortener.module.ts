import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_SHORTENER_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/shortener/.env',
    }),
    DatabaseModule,
    RmqModule.register({
      name: 'SHORTENER',
    }),
  ],
  controllers: [ShortenerController],
  providers: [ShortenerService, Logger],
})
export class ShortenerModule {}
