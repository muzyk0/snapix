import { Module } from '@nestjs/common'
import { NotificationService } from './services/notification.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AppConfigModule, AppConfigService } from '@app/config'

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'NOTIFIER_SERVICE',
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
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
