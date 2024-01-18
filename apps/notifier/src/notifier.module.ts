import { Module } from '@nestjs/common'
import { NotifierController } from './notifier.controller'
import { NotifierService } from './notifier.service'
import { AppConfigModule } from '@app/config'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppConfigModule,
  ],
  controllers: [NotifierController],
  providers: [ConfigService, NotifierService],
})
export class NotifierModule {}
