import { Controller, Get } from '@nestjs/common';
import { UsersApiService } from './users-api.service';

@Controller()
export class UsersApiController {
  constructor(private readonly usersApiService: UsersApiService) {}

  @Get()
  getHello(): string {
    return this.usersApiService.getHello();
  }
}
