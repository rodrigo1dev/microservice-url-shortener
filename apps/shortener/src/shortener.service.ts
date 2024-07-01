import { Injectable } from '@nestjs/common';
import { DatabaseService, RmqService } from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { CreateUrlShortenerDto } from './dto/create-shortener.dto';
import { generateRandomString } from '@app/common/utils/generate-ramdom-string.util';

@Injectable()
export class ShortenerService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly rmqService: RmqService,
  ) {}

  async create(data: CreateUrlShortenerDto, context: RmqContext) {
    const random = generateRandomString(6);
    const shortUrl = `http://localhost:3000/shortener/count-click/${random}`;
    const url = await this.prisma.shortener.create({
      data: {
        originalUrl: data.originalUrl,
        shortUrl,
        userId: data.userId,
      },
    });
    this.rmqService.ack(context);
    return url;
  }

  async countClicks(shortUrl: string, context: RmqContext) {
    const url = await this.prisma.shortener.update({
      where: {
        shortUrl,
      },
      data: {
        clicks: { increment: 1 },
      },
    });
    console.log(url.shortUrl);
    const originalUrl = url.originalUrl;
    this.rmqService.ack(context);
    return originalUrl;
  }
}
