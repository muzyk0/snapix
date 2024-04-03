import { NestFactory } from '@nestjs/core'
import { StorageModule } from './storage.module'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { type INestApplication, Logger } from '@nestjs/common'
import type { Express } from 'express'
import { AppConfigService } from '@app/config'

async function bootstrap() {
  const logger = new Logger('NestBootstrap Storage')
  const app = await NestFactory.create<INestApplication<Express>>(StorageModule)

  await app.init()

  const appConfigService = app.get<AppConfigService>(AppConfigService)

  const host = appConfigService.storageService.host || '0.0.0.0'

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host,
      port: appConfigService.storageService.port,
    },
  })

  await app.startAllMicroservices()
  logger.log('Microservice Storage is running')
  logger.log(`host: ${host}:${appConfigService.storageService.port}`)
}

void bootstrap()
