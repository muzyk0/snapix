import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NotifierModule } from './notifier.module'

async function bootstrap() {
  const logger = new Logger('NestBootstrap Notifier')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotifierModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://abalwmzb:lEVoc-xMIEoTavHa2VwzFqnqfUjyYq8y@gull.rmq.cloudamqp.com/abalwmzb'],
    },
  })

  await app.listen()
  logger.log('Microservice Notifier is running')
}

void bootstrap()
