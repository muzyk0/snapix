import { Controller, Get } from '@nestjs/common';
import { PostsApiService } from './posts-api.service';

@Controller()
export class PostsApiController {
  constructor(private readonly appService: PostsApiService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
