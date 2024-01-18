import { Module } from '@nestjs/common'
import { NotificationService } from './services/notification.service'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFIER_SERVICE',
        transport: Transport.RMQ,
        options: {
          // urls: 'amqps://abalwmzb:lEVoc-xMIEoTavHa2VwzFqnqfUjyYq8y@gull.rmq.cloudamqp.com/abalwmzb',
          urls: [
            'amqps://abalwmzb:lEVoc-xMIEoTavHa2VwzFqnqfUjyYq8y@gull.rmq.cloudamqp.com/abalwmzb',
          ],
        },
      },
    ]),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
