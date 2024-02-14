import { Injectable, Logger } from '@nestjs/common'
import { EmailSenderService } from './email-sender.service'
import { type SendEmailDto } from './dto/send-confirmation-email-code'
import { SmtpConfigService } from '@app/config/email-config.service'
import { MailerService } from '@nestjs-modules/mailer'
import { Template } from './templates'

@Injectable()
export class EmailService extends EmailSenderService {
  logger = new Logger(EmailService.name)

  constructor(
    protected readonly mailerService: MailerService,
    private readonly smtpConfigService: SmtpConfigService
  ) {
    super(mailerService)
  }

  async sendConfirmToken({ token, email, userName }: SendEmailDto) {
    await this.sendEmail(email, 'Confirm your email', Template.CONFIRM_EMAIL, {
      name: userName,
      confirmationLink: `${this.smtpConfigService.confirmRegisterLink}${token}`,
    })
  }

  async sendRecoveryToken({ token, email, userName }: SendEmailDto) {
    await this.sendEmail(email, 'Recovery your password', Template.RECOVERY_PASSWORD, {
      name: userName,
      resetLink: `${this.smtpConfigService.forgotPasswordLink}${token}`,
    })
  }
}
