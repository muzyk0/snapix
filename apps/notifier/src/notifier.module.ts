import { Module } from '@nestjs/common'
import { NotifierService } from './notifier.service'
import { AppConfigModule } from '@app/config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EmailModule } from './email/email.module'
import { HealthModule } from '@app/core/health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppConfigModule,
    HealthModule,
    EmailModule,
  ],
  providers: [ConfigService, NotifierService],
})
export class NotifierModule {}
