import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'
import { MailerModule } from '@nestjs-modules/mailer'
import * as path from 'path'
import { SmtpConfigService } from '@app/config/email-config.service'
import { AppConfigModule } from '@app/config'
import { ConfigService } from '@nestjs/config'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

@Module({
  imports: [
    AppConfigModule,
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const pathToHbs = path.join(__dirname, 'email', 'templates')

        return {
          transport: {
            service: 'Gmail',
            auth: {
              user: config.get<string>('EMAIL_FROM'),
              pass: config.get<string>('EMAIL_FROM_PASSWORD'),
            },
          },
          defaults: {
            from: `"No Reply" <${config.get<string>('EMAIL_FROM')}>`,
          },
          template: {
            dir: pathToHbs,
            adapter: new HandlebarsAdapter(undefined, {
              inlineCssEnabled: true,
            }),
            options: {
              strict: true,
            },
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, SmtpConfigService, EmailService],
})
export class EmailModule {}
