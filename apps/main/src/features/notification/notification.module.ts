import { Module } from '@nestjs/common'
import { NotificationService } from './services/notification.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AppConfigModule, AppConfigService } from '@app/config'
import { ServicesEnum } from '@app/core/constants'

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        name: ServicesEnum.NOTIFIER_SERVICE,
        imports: [AppConfigModule],
        useFactory: (configService: AppConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: configService.rmqUrls,
            },
          }
        },
        inject: [AppConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
