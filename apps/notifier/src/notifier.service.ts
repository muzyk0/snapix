import { Injectable } from '@nestjs/common'

@Injectable()
export class NotifierService {
  getHello(): string {
    return 'Hello World!'
  }
}
