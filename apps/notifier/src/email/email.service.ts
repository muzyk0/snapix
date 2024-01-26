import { Injectable, Logger } from '@nestjs/common'
import { EmailSenderService } from './email-sender.service'
import { type SendConfirmationEmailCodeDto } from './dto/send-confirmation-email-code'
import { SmtpConfigService } from '@app/config/email-config.service'
import { MailerService } from '@nestjs-modules/mailer'
import { Template } from './templates'
import { type SendPassRecoveryEmailCodeDto } from './dto/send-password-recovery-email-code'

@Injectable()
export class EmailService extends EmailSenderService {
  logger = new Logger(EmailService.name)

  constructor(
    protected readonly mailerService: MailerService,
    private readonly smtpConfigService: SmtpConfigService
  ) {
    super(mailerService)
  }

  async sendConfirmEmail({ confirmationCode, email, userName }: SendConfirmationEmailCodeDto) {
    await this.sendEmail(email, 'Confirm your email', Template.CONFIRM_EMAIL, {
      name: userName,
      confirmationLink: `${this.smtpConfigService.confirmRegisterLink}${confirmationCode}`,
      companyName: 'Snapix',
    })
  }

  async sendPassRecoveryEmail({ recoveryCode, email, userName }: SendPassRecoveryEmailCodeDto) {
    await this.sendEmail(email, 'Recover your password', Template.RECOVER_PASSWORD, {
      name: userName,
      recoveryLink: `${this.smtpConfigService.newPasswordLink}${recoveryCode}`,
      companyName: 'Snapix',
    })
  }
}
