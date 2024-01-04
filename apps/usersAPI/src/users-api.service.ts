import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
