require('newrelic')

/* eslint-disable import/first */
import 'multer'
import { NestFactory } from '@nestjs/core'
import { MainModule } from './main.module'
import { Logger } from '@nestjs/common'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { setupApp } from './setup-app'
import { buildSwaggerDocument } from './swagger/build-swagger-document'
import { AppConfigService } from '@app/config'

async function bootstrap() {
  const logger = new Logger('NestBootstrap')
  const app = await NestFactory.create<NestExpressApplication>(MainModule)

  app.set('trust proxy')

  const appConfigService = app.get<AppConfigService>(AppConfigService)

  setupApp(app, appConfigService.globalPrefix)

  buildSwaggerDocument(app, {
    globalPrefix: appConfigService.globalPrefix,
    swaggerVersion: appConfigService.appVersion,
  })

  await app.listen(appConfigService.port)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}

void bootstrap()
