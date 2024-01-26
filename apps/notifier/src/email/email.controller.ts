import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices'
import { EmailService } from './email.service'
import { SendConfirmationEmailCodeDto } from './dto/send-confirmation-email-code'
import { SendPassRecoveryEmailCodeDto } from './dto/send-password-recovery-email-code'

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern({ cmd: 'email-notification' })
  async sendTestEmail(
    @Payload() data: SendConfirmationEmailCodeDto,
    @Ctx() _context: MqttContext
  ): Promise<void> {
    await this.emailService.sendConfirmEmail(data)
  }

  @EventPattern({ cmd: 'email-pass-recovery' })
  async sendEmailToRecoverPass(
    @Payload() data: SendPassRecoveryEmailCodeDto,
    @Ctx() _context: MqttContext
  ): Promise<void> {
    await this.emailService.sendPassRecoveryEmail(data)
  }
}
