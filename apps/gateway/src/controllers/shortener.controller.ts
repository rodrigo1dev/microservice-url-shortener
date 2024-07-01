import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { ShortenerDto, UpdateShortenerDto } from '../dto/shortener.dto';
import { ShortenerGuard } from '@app/common/auth/shortener.guard';
import { AuthGuard } from '@app/common';

@Controller('shortener')
export class ShortenerController {
  constructor(@Inject('SHORTENER') private readonly usersClient: ClientProxy) {}

  @Post()
  @UseGuards(ShortenerGuard)
  async create(
    @Request() request,
    @Body() data: ShortenerDto,
    @Res() response: Response,
  ) {
    try {
      const userId = request.user?.sub;
      const result = await lastValueFrom(
        this.usersClient.send(
          { cmd: 'create-url-shortener' },
          {
            ...data,
            userId,
          },
        ),
      );
      response.status(201).json(result);
    } catch (error) {
      response
        .status(400)
        .json({ message: 'Shortener failed', error: error.message });
    }
  }

  @Get('count-click/:shortUrl')
  async get(@Param() params: any, @Res() response: Response) {
    const shortUrl = `http://localhost:3000/shortener/count-click/${params.shortUrl}`;
    try {
      const result = await lastValueFrom(
        this.usersClient.send({ cmd: 'count-clicks-and-redirect' }, shortUrl),
      );
      return response.redirect(result);
    } catch (error) {
      response
        .status(400)
        .json({ message: 'Shortener failed', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-all-shorteners')
  async findAll(@Request() request, @Res() response: Response) {
    try {
      const userId = request.user.sub;
      const result = await lastValueFrom(
        this.usersClient.send({ cmd: 'get-all-url-shortener' }, userId),
      );
      return response.status(200).json(result);
    } catch (error) {
      response
        .status(400)
        .json({ message: 'Shortener failed', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Put('update-shortener/:id')
  async update(
    @Param() params: any,
    @Body() data: UpdateShortenerDto,
    @Res() response: Response,
  ) {
    try {
      const result = await lastValueFrom(
        this.usersClient.send(
          { cmd: 'update-url-shortener' },
          {
            ...data,
            id: params.id,
          },
        ),
      );
      return response.status(200).json(result);
    } catch (error) {
      response
        .status(400)
        .json({ message: 'Shortener failed', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param() params: any, @Res() response: Response) {
    try {
      const result = await lastValueFrom(
        this.usersClient.send({ cmd: 'delete-url-shortener' }, params.id),
      );
      return response.status(200).json(result);
    } catch (error) {
      response
        .status(400)
        .json({ message: 'Shortener failed', error: error.message });
    }
  }
}
