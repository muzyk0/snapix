import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices'
import { EmailService } from './email.service'
import { SendEmailDto } from './dto/send-confirmation-email-code'

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern({ cmd: 'email-notification', type: 'confirmation' })
  async sendConfirmation(
    @Payload() data: SendEmailDto,
    @Ctx() _context: MqttContext
  ): Promise<void> {
    console.log(data)
    await this.emailService.sendConfirmToken(data)
  }

  @EventPattern({ cmd: 'email-notification', type: 'recovery' })
  async sendRecovery(@Payload() data: SendEmailDto, @Ctx() _context: MqttContext): Promise<void> {
    console.log(data)
    await this.emailService.sendRecoveryToken(data)
  }
}
