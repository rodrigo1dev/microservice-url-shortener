import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule, RmqModule } from '@app/common';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { ShortenerController } from './controllers/shortener.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_USERS_QUEUE: Joi.string().required(),
        RABBIT_MQ_SHORTENER_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/gateway/.env',
    }),
    RmqModule.register({
      name: 'AUTH',
    }),
    RmqModule.register({
      name: 'USERS',
    }),
    RmqModule.register({
      name: 'SHORTENER',
    }),
    AuthModule,
  ],
  controllers: [AuthController, UsersController, ShortenerController],
})
export class GatewayModule {}
