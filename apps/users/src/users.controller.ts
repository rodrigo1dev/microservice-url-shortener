import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create_user' })
  async create(
    @Payload() createUserDto: CreateUserDto,
    @Ctx() context: RmqContext,
  ) {
    return this.usersService.create(createUserDto, context);
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async findAll(@Ctx() context: RmqContext) {
    return this.usersService.findAll(context);
  }

  @MessagePattern({ cmd: 'validate_user' })
  async validateUser(
    @Payload() data: { email: string; password: string },
    @Ctx() context: RmqContext,
  ) {
    const { email, password } = data;
    return this.usersService.validateUser(email, password, context);
  }
}
