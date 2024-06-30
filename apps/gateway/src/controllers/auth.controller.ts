import { Controller, Post, Body, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH') private readonly authClient: ClientProxy) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    try {
      const result = await lastValueFrom(
        this.authClient.send({ cmd: 'login' }, loginDto),
      );

      response.status(200).json({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
    } catch (error) {
      response
        .status(400)
        .json({ message: 'Login failed', error: error.message });
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() response: Response) {
    try {
      const result = await lastValueFrom(
        this.authClient.send({ cmd: 'register' }, registerDto),
      );

      response.status(201).json({
        user: { email: registerDto.email, name: registerDto.name },
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
    } catch (error) {
      response
        .status(400)
        .json({ message: 'Registration failed', error: error.message });
    }
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: any, @Res() response: Response) {
    try {
      const result = await lastValueFrom(
        this.authClient.send({ cmd: 'refresh_token' }, refreshTokenDto),
      );

      response.status(200).json({
        message: 'Token refreshed successfully',
        access_token: result.access_token,
      });
    } catch (error) {
      response
        .status(400)
        .json({ message: 'Token refresh failed', error: error.message });
    }
  }
}
