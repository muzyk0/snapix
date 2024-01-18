import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class NotificationService {
  constructor(@Inject('NOTIFIER_SERVICE') private readonly client: ClientProxy) {}

  async sendEmailConfirmationCode(data: any): Promise<void> {
    this.client.emit<number>({ cmd: 'email-notification' }, data)
  }
}
