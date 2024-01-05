import { NestFactory } from '@nestjs/core'
import { MainModule } from './main.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

const PORT = 3000

async function bootstrap() {
  const logger = new Logger('NestBootstrap')
  const app = await NestFactory.create(MainModule)

  const configService = app.get<ConfigService>(ConfigService)

  await app.listen(configService.get('PORT', { infer: true }) ?? PORT)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}

void bootstrap()
