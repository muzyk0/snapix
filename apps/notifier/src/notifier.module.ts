import { Module } from '@nestjs/common'
import { NotifierService } from './notifier.service'
import { AppConfigModule } from '@app/config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EmailModule } from './email/email.module'

@Module({
  imports: [
    AppConfigModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailModule,
  ],
  providers: [ConfigService, NotifierService],
})
export class NotifierModule {}
