import { NestFactory } from '@nestjs/core'
import { PaymentsModule } from './payments.module'
import { type INestApplication, Logger } from '@nestjs/common'
import type { Express } from 'express'
import { AppConfigService } from '@app/config'

async function bootstrap() {
  const logger = new Logger('NestBootstrap Storage')
  const app = await NestFactory.create<INestApplication<Express>>(PaymentsModule)

  const appConfigService = app.get<AppConfigService>(AppConfigService)

  app.setGlobalPrefix(appConfigService.globalPrefix)

  await app.listen(appConfigService.port)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}
void bootstrap()
