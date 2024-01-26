import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SmtpConfigService {
  constructor(private readonly configService: ConfigService) {}

  get smtpCredentials() {
    return {
      EMAIL: this.configService.get('EMAIL_FROM'),
      PASS: this.configService.get('EMAIL_FROM_PASSWORD'),
    }
  }

  get confirmRegisterLink() {
    return this.configService.get('EMAIL_CONFIRM_REGISTER_LINK')
  }
}
