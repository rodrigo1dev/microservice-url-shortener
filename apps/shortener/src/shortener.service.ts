import { Injectable } from '@nestjs/common';
import { DatabaseService, RmqService } from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { CreateUrlShortenerDto } from './dto/create-shortener.dto';
import { generateRandomString } from '@app/common/utils/generate-ramdom-string.util';
import { NotFoundException } from '@app/common/exceptions/not-found.exception';

@Injectable()
export class ShortenerService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly rmqService: RmqService,
  ) {}

  async create(data: CreateUrlShortenerDto, context: RmqContext) {
    const random = generateRandomString(6);
    const shortUrl = `${process.env.BASE_URL}/shortener/count-click/${random}`;
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
    const originalUrl = url.originalUrl;
    this.rmqService.ack(context);
    return originalUrl;
  }

  async findAll(context: RmqContext, userId: string) {
    const urls = await this.prisma.shortener.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
    this.rmqService.ack(context);
    return urls;
  }

  async delete(id: string, context: RmqContext) {
    const findShortener = await this.prisma.shortener.findUnique({
      where: {
        id,
      },
    });
    if (!findShortener) {
      throw new NotFoundException('Shortener not found');
    }

    const url = await this.prisma.shortener.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    this.rmqService.ack(context);
    return url;
  }

  async updateUrlOriginalUrl(
    id: string,
    newOriginalUrl: string,
    context: RmqContext,
  ) {
    const findShortener = await this.prisma.shortener.findUnique({
      where: {
        id,
      },
    });
    if (!findShortener) {
      throw new NotFoundException('Shortener not found');
    }

    const url = await this.prisma.shortener.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        originalUrl: newOriginalUrl,
      },
    });
    this.rmqService.ack(context);
    return url;
  }
}
