import { Injectable } from '@nestjs/common'

@Injectable()
export class StorageService {
  getHello(): string {
    return 'Hello World!'
  }
}
