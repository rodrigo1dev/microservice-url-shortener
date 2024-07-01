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

  @MessagePattern({ cmd: 'get-all-url-shortener' })
  async findAll(@Payload() userId: string, @Ctx() context: RmqContext) {
    return this.shortenerService.findAll(context, userId);
  }

  @MessagePattern({ cmd: 'update-url-shortener' })
  async update(@Payload() data: any, @Ctx() context: RmqContext) {
    return this.shortenerService.updateUrlOriginalUrl(
      data.id,
      data.newOriginalUrl,
      context,
    );
  }

  @MessagePattern({ cmd: 'delete-url-shortener' })
  async delete(@Payload() shortUrl: string, @Ctx() context: RmqContext) {
    return this.shortenerService.delete(shortUrl, context);
  }
}
