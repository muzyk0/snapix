import { NestFactory } from '@nestjs/core'
import { type INestApplication, Logger } from '@nestjs/common'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NotifierModule } from './notifier.module'
import { AppConfigService } from '@app/config'
import { type Express } from 'express'

async function bootstrap() {
  const logger = new Logger('NestBootstrap Notifier')

  const app = await NestFactory.create<INestApplication<Express>>(NotifierModule)

  await app.init()

  const appConfigService = app.get<AppConfigService>(AppConfigService)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: appConfigService.rmqUrls,
    },
  })

  app.setGlobalPrefix(appConfigService.globalPrefix)

  await app.startAllMicroservices()
  logger.log('Microservice Notifier is running')

  await app.listen(appConfigService.port)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}

void bootstrap()
