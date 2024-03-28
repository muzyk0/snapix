import { NestFactory } from '@nestjs/core'
import { StorageModule } from './storage.module'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { type INestApplication, Logger } from '@nestjs/common'
import type { Express } from 'express'
import { AppConfigService } from '@app/config'

async function bootstrap() {
  const logger = new Logger('NestBootstrap Storage')
  const app = await NestFactory.create<INestApplication<Express>>(StorageModule)

  const appConfigService = app.get<AppConfigService>(AppConfigService)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: appConfigService.storageService.host || '0.0.0.0',
      port: appConfigService.storageService.port || 3247,
    },
  })

  await app.startAllMicroservices()
  logger.log('Microservice Notifier is running')

  await app.listen(appConfigService.port)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}

void bootstrap()
