import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { type SendEmailDto } from '../../../../../notifier/src/email/dto/send-confirmation-email-code'
import { ServicesEnum } from '@app/core/constants'

@Injectable()
export class NotificationService {
  constructor(@Inject(ServicesEnum.NOTIFIER_SERVICE) private readonly client: ClientProxy) {}

  async sendEmailConfirmationCode(dto: SendEmailDto): Promise<void> {
    this.client.emit<number>({ cmd: 'email-notification', type: 'confirmation' }, dto)
  }

  async sendRecoveryPasswordTempCode(dto: SendEmailDto) {
    this.client.emit<number>({ cmd: 'email-notification', type: 'recovery' }, dto)
  }
}
