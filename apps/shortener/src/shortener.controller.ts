import { Controller } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateUrlShortenerDto } from './dto/create-shortener.dto';

@Controller()
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @MessagePattern({ cmd: 'create-url-shortener' })
  async create(
    @Payload() data: CreateUrlShortenerDto,
    @Ctx() context: RmqContext,
  ) {
    return this.shortenerService.create(data, context);
  }

  @MessagePattern({ cmd: 'count-clicks-and-redirect' })
  async countClicksAndRedirect(
    @Payload() shortUrl: string,
    @Ctx() context: RmqContext,
  ) {
    return this.shortenerService.countClicks(shortUrl, context);
  }
}
