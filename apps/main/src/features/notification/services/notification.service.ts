import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class NotificationService {
  constructor(@Inject('NOTIFIER_SERVICE') private readonly client: ClientProxy) {}

  async sendEmailConfirmationCode(param: {
    confirmationCode: any
    userName: any
    email: string
  }): Promise<void> {
    this.client.emit<number>({ cmd: 'email-notification' }, param)
  }

  async sendRecoveryPasswordTempCode(param: {
    recoveryCode: string
    userName: string
    email: string
  }) {
    this.client.emit<number>({ cmd: 'email-notification' }, param)
  }
}
