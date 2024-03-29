import { NestFactory } from '@nestjs/core'
import { type INestApplication, Logger } from '@nestjs/common'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NotifierModule } from './notifier.module'
import { AppConfigService } from '@app/config'
import { type Express } from 'express'

async function bootstrap() {
  const logger = new Logger('NestBootstrap Notifier')

  const app = await NestFactory.create<INestApplication<Express>>(NotifierModule)

  const appConfigService = app.get<AppConfigService>(AppConfigService)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: appConfigService.rmqUrls,
    },
  })

  await app.startAllMicroservices()
  logger.log('Microservice Notifier is running')
}

void bootstrap()
