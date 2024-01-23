import { Injectable, Logger } from '@nestjs/common'
import { type ISendMailOptions, MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailSenderService {
  logger = new Logger(EmailSenderService.name)

  constructor(protected readonly mailerService: MailerService) {}

  private async send(mail: ISendMailOptions) {
    return this.mailerService.sendMail(mail)
  }

  async sendEmail(
    emailTo: string,
    subject: string,
    template: string,
    context: ISendMailOptions['context']
  ) {
    try {
      const info = await this.send({
        from: '"9ART.ru 👻" <info@9art.ru>',
        to: emailTo,
        subject,
        template,
        context,
      })

      this.logger.log('Message sent: %s', info)
    } catch (e) {
      this.logger.error(`Email isn't send. Error: ${JSON.stringify(e)}`)
    }
  }
}
