import { NestFactory } from '@nestjs/core'
import { MainModule } from './main.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { setupApp } from './setup-app'
import { buildSwaggerDocument } from './swagger/build-swagger-document'
import { type ConfigurationType } from '@app/config/configuration'

const PORT = 3000

async function bootstrap() {
  const logger = new Logger('NestBootstrap')
  const app = await NestFactory.create<NestExpressApplication>(MainModule)

  const configService = app.get<ConfigService<ConfigurationType>>(ConfigService)

  const globalPrefix = configService?.get<string>('GLOBAL_PREFIX', { infer: true })
  setupApp(app, globalPrefix)

  buildSwaggerDocument(app, {
    globalPrefix,
    swaggerVersion: configService?.get('APP_VERSION', { infer: true }),
  })

  await app.listen(configService.get('PORT', { infer: true }) ?? PORT)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}

void bootstrap()
