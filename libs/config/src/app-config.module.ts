import { Module } from '@nestjs/common'
import { AppConfigService } from './app-config.service'
import { ConfigService } from '@nestjs/config'
import { SmtpConfigService } from './email-config.service'

@Module({
  providers: [ConfigService, AppConfigService, SmtpConfigService],
  exports: [AppConfigService, SmtpConfigService],
})
export class AppConfigModule {}
