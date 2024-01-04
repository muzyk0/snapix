import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
