import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NotifierModule } from './notifier.module'
import { AppConfigService } from '@app/config'

async function bootstrap() {
  const logger = new Logger('NestBootstrap Notifier')

  const app = await NestFactory.create(NotifierModule)

  const appConfigService = app.get<AppConfigService>(AppConfigService)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: appConfigService.rmqUrls,
    },
  })

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotifierModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: configService.get<string>('RMQ_URLS')!.split(', '),
  //   },
  // })

  await app.startAllMicroservices()
  logger.log('Microservice Notifier is running')
}

void bootstrap()
